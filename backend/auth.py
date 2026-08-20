import re
from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, User, AuthToken, ResetToken

auth_bp = Blueprint('auth', __name__)

PASSWORD_REGEX = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$')
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')

def token_required(headers):
    auth_header = headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token_str = auth_header.split(' ', 1)[1]
    token = AuthToken.query.filter_by(token=token_str).first()
    if not token:
        return None
    return token.user_id

@auth_bp.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    full_name = (data.get('fullName') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not full_name or not re.match(r'^[A-Za-z\s]{2,}$', full_name):
        return jsonify({'error': 'Invalid name. Use letters and spaces only (min 2 characters).'}), 400
    if not EMAIL_REGEX.match(email):
        return jsonify({'error': 'Invalid email address.'}), 400
    if not PASSWORD_REGEX.match(password):
        return jsonify({'error': 'Password must be 8+ characters with uppercase, lowercase, number and special character.'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'This email is already registered. Try logging in instead.'}), 409

    user = User(full_name=full_name, email=email)
    user.set_password(password)
    user.phone = (data.get('phone') or '').strip()
    user.country = (data.get('country') or '').strip()
    user.age_group = (data.get('ageGroup') or '').strip()
    db.session.add(user)
    db.session.flush()

    token = AuthToken.generate(user.id)
    return jsonify({'token': token, 'user': user.to_dict()}), 201

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Incorrect email or password.'}), 401

    token = AuthToken.generate(user.id)
    return jsonify({'token': token, 'user': user.to_dict()})

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    user_id = token_required(request.headers)
    if not user_id:
        return jsonify({'error': 'Invalid token.'}), 401
    auth_header = request.headers.get('Authorization', '')
    token_str = auth_header.split(' ', 1)[1]
    AuthToken.query.filter_by(token=token_str).delete()
    db.session.commit()
    return jsonify({'message': 'Logged out.'})

@auth_bp.route('/api/auth/me', methods=['GET'])
def me():
    user_id = token_required(request.headers)
    if not user_id:
        return jsonify({'error': 'Invalid token.'}), 401
    user = User.query.get(user_id)
    return jsonify({'user': user.to_dict()})

@auth_bp.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = (data.get('email') or '').strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'No account found with that email.'}), 404

    token = ResetToken.generate(user.id)
    print(f'[RESET TOKEN] User: {email}, Token: {token}')
    return jsonify({
        'message': 'Password reset link sent to your email.',
        'token': token
    })

@auth_bp.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token_str = (data.get('token') or '').strip()
    new_password = data.get('newPassword') or ''

    reset = ResetToken.query.filter_by(token=token_str, used=False).first()
    if not reset:
        return jsonify({'error': 'Invalid or expired reset token.'}), 400
    if datetime.utcnow() > reset.expires_at:
        return jsonify({'error': 'Reset token has expired.'}), 400
    if not PASSWORD_REGEX.match(new_password):
        return jsonify({'error': 'Password must be 8+ characters with uppercase, lowercase, number and special character.'}), 400

    user = User.query.get(reset.user_id)
    user.set_password(new_password)
    reset.used = True
    db.session.commit()
    return jsonify({'message': 'Password reset successfully.'})
