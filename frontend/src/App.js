import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles/chat.css';

function App() {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <ChatProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/chat" /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/chat" /> : <Signup />} 
            />
            <Route 
              path="/chat" 
              element={user ? <Chat /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;