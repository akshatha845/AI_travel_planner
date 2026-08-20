import os
import uuid
import json
from flask import Flask, send_from_directory, abort, request, Response, stream_with_context, jsonify
from flask_cors import CORS
from models import db, Destination, Adventure, ChatThread, ChatMessage
from auth import auth_bp
from content import content_bp
from seed import seed
from planner_graph import run_graph, graph

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel_planner.db'
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
    data = request.json
    query = data.get('query')
    thread_id = data.get('thread_id', '1')
    
    # Save user message
    user_msg = ChatMessage(thread_id=thread_id, sender='user', text=query)
    db.session.add(user_msg)
    db.session.commit()
    
    app.logger.info(f"Received itinerary request: {query}")

    def generate():
        try:
            full_response = ""
            for chunk in run_graph(query, thread_id):
                full_response += chunk
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            
            # Save AI message
            ai_msg = ChatMessage(thread_id=thread_id, sender='bot', text=full_response)
            db.session.add(ai_msg)
            db.session.commit()
            
            # Now update the title from the graph state
            config = {"configurable": {"thread_id": thread_id}}
            state = graph.get_state(config)
            thread = ChatThread.query.get(thread_id)
            if thread and state.values.get("title"):
                thread.title = state.values.get("title")
                db.session.commit()
                
        except Exception as e:
            app.logger.error(f"Error in graph generation: {str(e)}")
            yield f"data: {json.dumps({'error': 'Failed to generate itinerary'})}\n\n"
    
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
    formatted_messages = [{"sender": msg.sender, "text": msg.text} for msg in messages]
    return jsonify(formatted_messages)

@app.route('/<path:filename>')
def serve_static(filename):
    if filename.startswith('api/'):
        return abort(404)
    return send_from_directory(ROOT_DIR, filename)

if __name__ == '__main__':
    app.run(port=4200)
