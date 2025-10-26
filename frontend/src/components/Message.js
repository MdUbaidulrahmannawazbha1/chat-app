import React from 'react';

const Message = ({ message }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isOwnMessage = message.sender._id === userInfo._id;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-content">
        {!isOwnMessage && (
          <img 
            src={message.sender.profilePicture} 
            alt={message.sender.name} 
            className="message-avatar"
          />
        )}
        <div className="message-bubble">
          {!isOwnMessage && (
            <span className="message-sender">{message.sender.name}</span>
          )}
          
          {/* Display image if messageType is 'image' */}
          {message.messageType === 'image' ? (
            <div className="message-image-container">
              <img 
                src={message.content} 
                alt="Shared image" 
                className="message-image"
                onClick={() => window.open(message.content, '_blank')}
              />
            </div>
          ) : (
            <p>{message.content}</p>
          )}
          
          <div className="message-footer">
            <span className="message-time">{formatTime(message.createdAt)}</span>
            {isOwnMessage && message.isRead && (
              <span className="read-receipt">✓✓</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;