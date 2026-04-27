from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys


CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from chatbot import PythonAIChatBot


BOT = PythonAIChatBot()


class ChatbotRequestHandler(BaseHTTPRequestHandler):
    server_version = "PythonChatbotAPI/1.0"

    def _set_headers(self, status_code: int = 200) -> None:
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self) -> None:
        self._set_headers(204)

    def do_GET(self) -> None:
        if self.path == "/api/health":
            self._set_headers(200)
            self.wfile.write(
                json.dumps({"status": "ok", "service": "python-chatbot-api"}).encode("utf-8")
            )
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"message": "Not found"}).encode("utf-8"))

    def do_POST(self) -> None:
        if self.path != "/api/chat":
            self._set_headers(404)
            self.wfile.write(json.dumps({"message": "Not found"}).encode("utf-8"))
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length) if content_length else b"{}"

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({"message": "Invalid JSON"}).encode("utf-8"))
            return

        message = str(payload.get("message", "")).strip()
        user_name = str(payload.get("userName", "there")).strip() or "there"

        if message.lower() in {"history", "reset"}:
            BOT.history = BOT.history[:1]

        reply = BOT.reply(message)

        self._set_headers(200)
        self.wfile.write(
            json.dumps(
                {
                    "botName": BOT.name,
                    "reply": reply,
                    "userName": user_name,
                    "historyCount": len(BOT.history),
                }
            ).encode("utf-8")
        )

    def log_message(self, format: str, *args) -> None:
        return


def run_server(host: str = "127.0.0.1", port: int = 8000) -> None:
    server = ThreadingHTTPServer((host, port), ChatbotRequestHandler)
    print(f"Python chatbot API running on http://{host}:{port}")
    print("POST /api/chat and GET /api/health are available.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Shutting down.")
    finally:
        server.server_close()


if __name__ == "__main__":
    run_server()