from flask import Flask, request, render_template, make_response
from flask_cors import CORS
from pathlib import Path

# APP_DIR = Path(__file__).parent
# UI_DIR = APP_DIR.parent / "index.html"
app = Flask(__name__)
CORS(app)


@app.route('/')
def serve_frontend():
    response = render_template('index.html')
    return response


if __name__ == "__main__":
    app.run(port=4200)
