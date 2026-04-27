import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext();
const STORAGE_KEY = 'chatbot-conversation-v1';
const NAME_KEY = 'chatbot-display-name-v1';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const starterPrompts = [
  'What can you do?',
  'How do I make this project my own?',
  'Give me a chatbot idea for my app.'
];

const createWelcomeMessage = (userName) => ({
  id: 'welcome-message',
  role: 'bot',
  content: `Hi ${userName}, I am NawazBot. I can help you turn this repo into a polished chatbot version.`,
  createdAt: new Date().toISOString()
});

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState(starterPrompts);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userName, setUserNameState] = useState('Guest');
  const botProfile = {
    name: 'NawazBot',
    tagline: 'A custom chatbot version of your chat app.'
  };

  useEffect(() => {
    const storedName = localStorage.getItem(NAME_KEY);
    const storedMessages = localStorage.getItem(STORAGE_KEY);

    if (storedName) {
      setUserNameState(storedName);
    }

    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
          setSuggestions(starterPrompts);
          return;
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const welcomeMessage = createWelcomeMessage(storedName || 'Guest');
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(NAME_KEY, userName);
  }, [userName]);

  const setUserName = (nextUserName) => {
    setUserNameState(nextUserName || 'Guest');
  };

  const sendMessage = async (text) => {
    const trimmedMessage = String(text || '').trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      author: userName,
      content: trimmedMessage,
      createdAt: new Date().toISOString()
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setSuggestions([]);
    setIsTyping(true);
    setIsSending(true);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/chat`, {
        message: trimmedMessage,
        history: nextMessages.slice(-8).map(({ role, content }) => ({ role, content })),
        userName
      });

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: data.reply,
        createdAt: new Date().toISOString()
      };

      window.setTimeout(() => {
        setMessages((currentMessages) => [...currentMessages, botMessage]);
        setSuggestions(Array.isArray(data.suggestions) && data.suggestions.length > 0 ? data.suggestions : starterPrompts);
        setIsTyping(false);
        setIsSending(false);
      }, 450);
    } catch (error) {
      const fallbackMessage = {
        id: `fallback-${Date.now()}`,
        role: 'bot',
        content: 'I could not reach the chatbot backend just now, but this version still works offline as a starter. Try again in a moment.',
        createdAt: new Date().toISOString()
      };

      window.setTimeout(() => {
        setMessages((currentMessages) => [...currentMessages, fallbackMessage]);
        setSuggestions(starterPrompts);
        setIsTyping(false);
        setIsSending(false);
      }, 300);
    }
  };

  const clearChat = () => {
    const welcomeMessage = createWelcomeMessage(userName || 'Guest');
    setMessages([welcomeMessage]);
    setSuggestions(starterPrompts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([welcomeMessage]));
  };

  const value = {
    messages,
    setMessages,
    sendMessage,
    clearChat,
    suggestions,
    isTyping,
    isSending,
    userName,
    setUserName,
    botProfile,
    starterPrompts
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
