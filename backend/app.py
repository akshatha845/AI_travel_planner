import os
from flask import Flask, send_from_directory, abort
from flask_cors import CORS
from models import db
from auth import auth_bp

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel_planner.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db.init_app(app)
app.register_blueprint(auth_bp)

with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return send_from_directory(ROOT_DIR, 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    if filename.startswith('api/'):
        return abort(404)
    return send_from_directory(ROOT_DIR, filename)


if __name__ == '__main__':
    app.run(port=4200)
