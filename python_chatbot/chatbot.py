from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Any


@dataclass
class ChatTurn:
    role: str
    content: str
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat(timespec="seconds") + "Z")


class PythonAIChatBot:
    def __init__(self, name: str = "NawazBot") -> None:
        self.name = name
        self.history: List[ChatTurn] = [
            ChatTurn(
                role="assistant",
                content=(
                    f"Hi, I am {self.name}. Ask me to explain code, brainstorm project ideas, "
                    "or help you build a chatbot in Python."
                ),
            )
        ]

    def reply(self, user_message: str) -> str:
        message = user_message.strip()
        if not message:
            return "Say something and I will help."

        self.history.append(ChatTurn(role="user", content=message))

        api_reply = self._reply_from_openai(message)
        if api_reply:
            self.history.append(ChatTurn(role="assistant", content=api_reply))
            return api_reply

        fallback_reply = self._local_reply(message)
        self.history.append(ChatTurn(role="assistant", content=fallback_reply))
        return fallback_reply

    def _reply_from_openai(self, message: str) -> str | None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return None

        model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
        payload: Dict[str, Any] = {
            "model": model,
            "messages": self._chat_messages_for_api(message),
            "temperature": 0.7,
        }

        request = urllib.request.Request(
            "https://api.openai.com/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                response_data = json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
            return None

        choices = response_data.get("choices") or []
        if not choices:
            return None

        first_choice = choices[0]
        return (first_choice.get("message") or {}).get("content")

    def _chat_messages_for_api(self, latest_message: str) -> List[Dict[str, str]]:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful, concise Python chatbot assistant. "
                    "Help the user build and customize chatbot projects."
                ),
            }
        ]

        for turn in self.history[-8:]:
            messages.append({"role": turn.role, "content": turn.content})

        messages.append({"role": "user", "content": latest_message})
        return messages

    def _local_reply(self, message: str) -> str:
        normalized = message.lower()

        if any(word in normalized for word in ("hello", "hi", "hey")):
            return (
                f"Hello. I am {self.name}, your Python chatbot. I can help you write code, "
                "explain concepts, or sketch a better AI chatbot design."
            )

        if "python" in normalized and "chatbot" in normalized:
            return (
                "A good Python chatbot starts with a small reply engine, a memory list, "
                "and then a real AI API when you are ready."
            )

        if "code" in normalized or "example" in normalized:
            return (
                "Use a `ChatBot` class, store message history, and route requests through a `reply()` method."
            )

        if "project" in normalized or "own version" in normalized:
            return (
                "Make it yours by changing the assistant name, prompt style, colors, and response rules."
            )

        if "openai" in normalized or "api" in normalized:
            return (
                "Set OPENAI_API_KEY in your environment and the bot will use the OpenAI API automatically."
            )

        return (
            f"I heard: {message}. I can help you turn this into a Python chatbot with a local fallback and an AI API path."
        )


def print_conversation(bot: PythonAIChatBot) -> None:
    for turn in bot.history:
        label = "You" if turn.role == "user" else bot.name
        print(f"{label}: {turn.content}")


def run_cli() -> None:
    bot = PythonAIChatBot()
    print(f"{bot.name} ready. Type 'exit' to quit.\n")
    print(bot.history[0].content)

    while True:
        try:
            user_message = input("\nYou: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye.")
            break

        if user_message.lower() in {"exit", "quit"}:
            print("Goodbye.")
            break

        bot_reply = bot.reply(user_message)
        print(f"{bot.name}: {bot_reply}")


if __name__ == "__main__":
    run_cli()