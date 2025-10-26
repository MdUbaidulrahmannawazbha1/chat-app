 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatBox from '../components/ChatBox';
import { useChat } from '../context/ChatContext';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedUser, setSelectedUser, onlineUsers } = useChat();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/users`,
        config
      );

      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <img src={userInfo.profilePicture} alt={userInfo.name} />
            <div>
              <h3>{userInfo.name}</h3>
              <span className="status online">Online</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>

        <div className="user-list">
          <h4>Contacts</h4>
          {loading ? (
            <p className="loading-text">Loading users...</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <img src={user.profilePicture} alt={user.name} />
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <span className={`status ${onlineUsers.includes(user._id) ? 'online' : 'offline'}`}>
                    {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-main">
        {selectedUser ? (
          <ChatBox />
        ) : (
          <div className="no-chat-selected">
            <h2>Welcome to Chat App</h2>
            <p>Select a user from the sidebar to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
