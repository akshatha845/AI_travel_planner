import json
import secrets
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    phone = db.Column(db.String(20), default='')
    country = db.Column(db.String(50), default='')
    age_group = db.Column(db.String(10), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'fullName': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'country': self.country,
            'ageGroup': self.age_group,
        }

class AuthToken(db.Model):
    __tablename__ = 'auth_tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(128), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @staticmethod
    def generate(user_id):
        token_str = secrets.token_hex(32)
        token = AuthToken(user_id=user_id, token=token_str)
        db.session.add(token)
        db.session.commit()
        return token_str

class ResetToken(db.Model):
    __tablename__ = 'reset_tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(128), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)

    @staticmethod
    def generate(user_id):
        token_str = secrets.token_urlsafe(32)
        reset = ResetToken(
            user_id=user_id,
            token=token_str,
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        db.session.add(reset)
        db.session.commit()
        return token_str

class Destination(db.Model):
    __tablename__ = 'destinations'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    emoji = db.Column(db.String(16), default='')
    tagline = db.Column(db.String(200), default='')
    hero_image = db.Column(db.String(255), default='')
    highlight = db.Column(db.String(200), default='')
    spots = db.Column(db.Text, default='[]')

    def to_dict(self, include_spots=False):
        data = {
            'slug': self.slug,
            'name': self.name,
            'emoji': self.emoji,
            'highlight': self.highlight,
            'heroImage': self.hero_image,
        }
        if include_spots:
            data['tagline'] = self.tagline
            data['spots'] = json.loads(self.spots or '[]')
        return data

class Adventure(db.Model):
    __tablename__ = 'adventures'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    emoji = db.Column(db.String(16), default='')
    tagline = db.Column(db.String(200), default='')
    hero_image = db.Column(db.String(255), default='')
    highlight = db.Column(db.String(200), default='')
    spots = db.Column(db.Text, default='[]')

    def to_dict(self, include_spots=False):
        data = {
            'slug': self.slug,
            'name': self.name,
            'emoji': self.emoji,
            'highlight': self.highlight,
            'heroImage': self.hero_image,
        }
        if include_spots:
            data['tagline'] = self.tagline
            data['spots'] = json.loads(self.spots or '[]')
        return data

class ChatThread(db.Model):
    __tablename__ = 'chat_threads'
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), default='New Chat')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    messages = db.relationship('ChatMessage', backref='thread', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'createdAt': self.created_at.isoformat()
        }

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    thread_id = db.Column(db.String(36), db.ForeignKey('chat_threads.id'), nullable=False)
    sender = db.Column(db.String(10), nullable=False) # 'user' or 'bot'
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
