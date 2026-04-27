# NawazBot Chatbot

This project is a custom chatbot version of the original chat app. It keeps the experience self-contained, adds a branded assistant, and uses a lightweight backend rule engine so you can extend it later with a real AI provider.

## Run It

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm start
```

The frontend expects the backend on `http://localhost:5000` by default.

## Python Chatbot

There is also a standalone Python version in [python_chatbot/](python_chatbot) with a CLI entry point:

```bash
cd python_chatbot
python main.py
```
