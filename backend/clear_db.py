from app import app, db
from models import ChatThread, ChatMessage

def clear_chat_data():
    with app.app_context():
        # Order matters due to foreign key constraints
        db.session.query(ChatMessage).delete()
        db.session.query(ChatThread).delete()
        db.session.commit()
        print("Successfully cleared chat threads and messages.")

if __name__ == '__main__':
    clear_chat_data()
