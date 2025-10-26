import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useChat } from '../context/ChatContext';
import Message from './Message';

const ChatBox = () => {
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { selectedUser, messages, setMessages, sendMessage, typing, typingUser, emitTyping } = useChat();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/messages/${selectedUser._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/messages`,
        {
          receiverId: selectedUser._id,
          content: messageInput
        },
        config
      );

      setMessages([...messages, data]);
      sendMessage(data);
      setMessageInput('');
      emitTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);

    try {
      // Compress and convert image to base64
      const compressedImage = await compressImage(file);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/messages`,
        {
          receiverId: selectedUser._id,
          content: compressedImage,
          messageType: 'image'
        },
        config
      );

      setMessages([...messages, data]);
      sendMessage(data);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try a smaller image.');
      setUploading(false);
    }
  };

  // Function to compress image
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if image is too large
          const maxWidth = 800;
          const maxHeight = 800;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 70% quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        
        img.onerror = reject;
      };
      
      reader.onerror = reject;
    });
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    
    emitTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chatbox">
      {/* Chat Header */}
      <div className="chat-header">
        <img src={selectedUser.profilePicture} alt={selectedUser.name} />
        <div>
          <h3>{selectedUser.name}</h3>
          <span className="status">
            {typing && typingUser === selectedUser.name 
              ? 'typing...' 
              : selectedUser.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {loading ? (
          <p className="loading-text">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <Message key={message._id} message={message} />
          ))
        )}
        {uploading && (
          <div className="uploading-indicator">
            <p>Uploading image...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="btn-attach"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
          📎
        </button>
        <input
          type="text"
          value={messageInput}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="btn-send" disabled={uploading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;