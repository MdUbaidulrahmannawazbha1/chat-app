import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import Home from './pages/Home';
import Chat from './pages/Chat';
import './styles/chat.css';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Navigate to="/chat" replace />} />
            <Route path="/signup" element={<Navigate to="/chat" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;