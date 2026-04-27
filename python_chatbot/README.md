# Python AI Chatbot

This folder contains a small chatbot written in Python.

It works in two modes:

1. Local fallback mode with built-in responses.
2. OpenAI API mode when `OPENAI_API_KEY` is set.

## API Server

You can also run it as a small HTTP API:

```bash
cd python_chatbot
python api_server.py
```

Endpoints:

1. `GET /api/health`
2. `POST /api/chat`

## Run

```bash
cd python_chatbot
python main.py
```

## Optional OpenAI Setup

Set these environment variables before starting the CLI:

```bash
set OPENAI_API_KEY=your_key
set OPENAI_MODEL=gpt-4.1-mini
```

If you want, I can also turn this into a FastAPI server next.