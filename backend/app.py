import os
import uuid
import json
from flask import Flask, send_from_directory, abort, request, Response, stream_with_context, jsonify
from flask_cors import CORS
from models import db, Destination, Adventure, ChatThread, ChatMessage, ThreadImage
from auth import auth_bp
from content import content_bp
from seed import seed
from planner_graph import run_graph, graph

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
BACKEND_DIR = os.path.dirname(__file__)
INSTANCE_DIR = os.path.join(BACKEND_DIR, 'instance')
os.makedirs(INSTANCE_DIR, exist_ok=True)
DB_PATH = os.path.join(INSTANCE_DIR, 'travel_planner.db')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(content_bp)

with app.app_context():
    db.create_all()
    if Destination.query.count() == 0 and Adventure.query.count() == 0:
        seed()
        print('Content tables seeded.')

@app.route('/')
def index():
    return send_from_directory(ROOT_DIR, 'index.html')

@app.route('/api/generate-itinerary', methods=['POST'])
def generate_itinerary():
    data = request.json or {}
    query = data.get('query')
    thread_id = data.get('thread_id')
    is_explore = bool(data.get('is_explore', False))
    
    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    # Ensure thread_id exists in ChatThread to satisfy foreign keys
    if not thread_id:
        thread_id = str(uuid.uuid4())
        thread = ChatThread(id=thread_id, user_id=1, title="New Chat")
        db.session.add(thread)
        db.session.commit()
    else:
        thread = ChatThread.query.get(thread_id)
        if not thread:
            thread = ChatThread(id=thread_id, user_id=1, title="New Chat")
            db.session.add(thread)
            db.session.commit()
    
    # Save user message safely
    try:
        user_msg = ChatMessage(thread_id=thread_id, sender='user', text=query)
        db.session.add(user_msg)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error saving user message: {e}")
    
    app.logger.info(f"Received itinerary request: {query} (thread_id={thread_id}, is_explore={is_explore})")

    def generate():
        full_response = ""
        current_images = []
        saved_to_db = False
        try:
            for chunk in run_graph(query, thread_id, is_explore=is_explore):
                full_response += chunk
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            
            # Now retrieve state to get title and curated images
            config = {"configurable": {"thread_id": thread_id}}
            state = graph.get_state(config)
            
            if state.values and state.values.get("images"):
                current_images = state.values.get("images")

            # Emit images event for immediate frontend display
            if current_images:
                yield f"data: {json.dumps({'images': current_images})}\n\n"

            # Immediately persist to database within application context
            with app.app_context():
                ai_msg = ChatMessage(thread_id=thread_id, sender='bot', text=full_response, images=json.dumps(current_images))
                db.session.add(ai_msg)
                
                for img in current_images:
                    img_url = img.get("url") if isinstance(img, dict) else str(img)
                    img_title = img.get("title", "") if isinstance(img, dict) else ""
                    if img_url:
                        exists = ThreadImage.query.filter_by(thread_id=thread_id, image_url=img_url).first()
                        if not exists:
                            db.session.add(ThreadImage(thread_id=thread_id, image_url=img_url, title=img_title))

                thread = ChatThread.query.get(thread_id)
                if thread and state.values and state.values.get("title"):
                    thread.title = state.values.get("title")
                db.session.commit()
                saved_to_db = True
                app.logger.info(f"Persisted AI response and {len(current_images)} curated images for thread {thread_id}")

        except GeneratorExit:
            app.logger.info("Client disconnected before stream completed")
        except Exception as e:
            app.logger.error(f"Error in graph generation: {str(e)}")
            yield f"data: {json.dumps({'error': 'Failed to generate itinerary'})}\n\n"
        finally:
            if not saved_to_db and full_response:
                try:
                    with app.app_context():
                        config = {"configurable": {"thread_id": thread_id}}
                        state = graph.get_state(config)
                        if not current_images and state.values and state.values.get("images"):
                            current_images = state.values.get("images")

                        ai_msg = ChatMessage(thread_id=thread_id, sender='bot', text=full_response, images=json.dumps(current_images))
                        db.session.add(ai_msg)
                        
                        for img in current_images:
                            img_url = img.get("url") if isinstance(img, dict) else str(img)
                            img_title = img.get("title", "") if isinstance(img, dict) else ""
                            if img_url:
                                exists = ThreadImage.query.filter_by(thread_id=thread_id, image_url=img_url).first()
                                if not exists:
                                    db.session.add(ThreadImage(thread_id=thread_id, image_url=img_url, title=img_title))

                        thread = ChatThread.query.get(thread_id)
                        if thread and state.values and state.values.get("title"):
                            thread.title = state.values.get("title")
                        db.session.commit()
                        app.logger.info(f"Persisted AI response and {len(current_images)} curated images in finally for thread {thread_id}")
                except Exception as e:
                    app.logger.error(f"Error persisting bot response in finally: {e}")
    
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

# --- Thread Management ---

@app.route('/api/threads', methods=['GET'])
def get_threads():
    threads = ChatThread.query.filter_by(user_id=1).order_by(ChatThread.created_at.desc()).all()
    return jsonify([thread.to_dict() for thread in threads])

@app.route('/api/threads', methods=['POST'])
def create_thread():
    thread_id = str(uuid.uuid4())
    new_thread = ChatThread(id=thread_id, user_id=1, title="New Chat")
    db.session.add(new_thread)
    db.session.commit()
    return jsonify(new_thread.to_dict())

@app.route('/api/threads/<thread_id>/messages', methods=['GET'])
def get_thread_messages(thread_id):
    messages = ChatMessage.query.filter_by(thread_id=thread_id).order_by(ChatMessage.created_at.asc()).all()
    formatted_messages = [
        {
            "sender": msg.sender,
            "text": msg.text,
            "images": json.loads(msg.images or '[]')
        }
        for msg in messages
    ]
    return jsonify(formatted_messages)

@app.route('/api/threads/<thread_id>/images', methods=['GET'])
def get_thread_images(thread_id):
    images = ThreadImage.query.filter_by(thread_id=thread_id).order_by(ThreadImage.id.asc()).all()
    return jsonify([img.to_dict() for img in images])

@app.route('/<path:filename>')
def serve_static(filename):
    if filename.startswith('api/'):
        return abort(404)
    return send_from_directory(ROOT_DIR, filename)

if __name__ == '__main__':
    app.run(port=4200)
