from flask import Blueprint, jsonify
from models import Destination, Adventure

content_bp = Blueprint('content', __name__)


@content_bp.route('/api/destinations', methods=['GET'])
def list_destinations():
    items = Destination.query.order_by(Destination.name).all()
    return jsonify([item.to_dict() for item in items])


@content_bp.route('/api/destinations/<slug>', methods=['GET'])
def get_destination(slug):
    item = Destination.query.filter_by(slug=slug).first()
    if not item:
        return jsonify({'error': 'Destination not found.'}), 404
    return jsonify(item.to_dict(include_spots=True))


@content_bp.route('/api/adventure', methods=['GET'])
def list_adventure():
    items = Adventure.query.order_by(Adventure.name).all()
    return jsonify([item.to_dict() for item in items])


@content_bp.route('/api/adventure/<slug>', methods=['GET'])
def get_adventure(slug):
    item = Adventure.query.filter_by(slug=slug).first()
    if not item:
        return jsonify({'error': 'Adventure not found.'}), 404
    return jsonify(item.to_dict(include_spots=True))