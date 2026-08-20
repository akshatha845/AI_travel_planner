# AI Travel Planner India

An AI-powered travel planning application for India, featuring an interactive chatbot, personalized itinerary generation, and persistent conversation threads.

## Prerequisites

- Python 3.11+
- [Ollama](https://ollama.com/) (installed and running)

## Setup Instructions

### 1. Backend Environment Setup

Create and activate a virtual environment:

```cmd
:: Navigate to the project root
cd C:\path\to\AI_travel_planner

:: Create virtual environment
python -m venv venv

:: Activate virtual environment
venv\Scripts\activate
```

Install the required dependencies:

```cmd
pip install -r backend\requirements.txt
```

### 2. Ollama Setup

1.  **Install Ollama**: Download and install Ollama from [ollama.com](https://ollama.com/).
2.  **Start Ollama Service**: In a separate terminal, start the Ollama server:
    ```cmd
    ollama serve
    ```
3.  **Download the LLM**: In another terminal, pull the model used by this application (`llama3.2`):
    ```cmd
    ollama pull llama3.2
    ```

### 3. Running the Project

1.  Ensure your virtual environment is activated.
2.  Start the Flask backend:

```cmd
python backend\app.py
```

The application will be accessible at `http://127.0.0.1:4200`.
