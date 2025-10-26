 import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (userInfo) {
      const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Connect user
      newSocket.emit('user_connected', userInfo._id);

      // Listen for incoming messages
      newSocket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Listen for user status changes
      newSocket.on('user_status', ({ userId, status }) => {
        setOnlineUsers((prev) => {
          if (status === 'online') {
            return [...prev, userId];
          } else {
            return prev.filter(id => id !== userId);
          }
        });
      });

      // Listen for typing indicator
      newSocket.on('user_typing', ({ isTyping, senderName }) => {
        setTyping(isTyping);
        setTypingUser(senderName);
      });

      // Listen for read receipts
      newSocket.on('message_read_receipt', ({ messageId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      });

      return () => newSocket.close();
    }
  }, []);

  const sendMessage = (message) => {
    if (socket && selectedUser) {
      socket.emit('send_message', {
        receiverId: selectedUser._id,
        message
      });
    }
  };

  const emitTyping = (isTyping) => {
    if (socket && selectedUser) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      socket.emit('typing', {
        receiverId: selectedUser._id,
        isTyping,
        senderName: userInfo.name
      });
    }
  };

  const value = {
    socket,
    messages,
    setMessages,
    onlineUsers,
    selectedUser,
    setSelectedUser,
    sendMessage,
    typing,
    typingUser,
    emitTyping
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
