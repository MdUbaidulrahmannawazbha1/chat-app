import React from 'react';

const Message = ({ message }) => {
  const isBotMessage = message.role === 'bot';

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`message-row ${isBotMessage ? 'bot' : 'user'}`}>
      {isBotMessage && <div className="message-avatar bot-avatar">NB</div>}

      <div className={`message-bubble ${isBotMessage ? 'bot-bubble' : 'user-bubble'}`}>
        {!isBotMessage && <span className="message-sender">You</span>}
        <p>{message.content}</p>
        <div className="message-footer">
          <span className="message-time">{formatTime(message.createdAt)}</span>
        </div>
      </div>

      {!isBotMessage && <div className="message-avatar user-avatar">{(message.author || 'You').charAt(0).toUpperCase()}</div>}
    </div>
  );
};

export default Message;