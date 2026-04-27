import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import Message from './Message';

const ChatBox = () => {
  const [messageInput, setMessageInput] = useState('');
  const { messages, suggestions, isTyping, isSending, sendMessage, clearChat, botProfile, userName } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!messageInput.trim() || isSending) {
      return;
    }

    const outgoingMessage = messageInput;
    setMessageInput('');
    await sendMessage(outgoingMessage);
  };

  const handleSuggestionClick = async (prompt) => {
    setMessageInput('');
    await sendMessage(prompt);
  };

  return (
    <div className="chatbox">
      <div className="chat-header">
        <div className="bot-avatar">NB</div>
        <div className="chat-header-copy">
          <h3>{botProfile.name}</h3>
          <p>{botProfile.tagline}</p>
        </div>
        <button type="button" className="btn-ghost" onClick={clearChat}>
          Reset
        </button>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">Start by asking the bot how to make this project your own.</p>
        ) : (
          messages.map((message) => <Message key={message.id} message={message} />)
        )}

        {isTyping && (
          <div className="typing-row">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
            <span>{botProfile.name} is thinking...</span>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="suggestion-pills">
            {suggestions.map((item) => (
              <button key={item} type="button" className="suggestion-pill" onClick={() => handleSuggestionClick(item)}>
                {item}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <div className="input-stack">
          <span className="input-label">Reply as {userName}</span>
          <input
            type="text"
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            placeholder="Ask something about your chatbot version..."
            className="message-input"
            disabled={isSending}
          />
        </div>
        <button type="submit" className="btn-send" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;