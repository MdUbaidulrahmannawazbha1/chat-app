 import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Real-Time Chat</h1>
        <p>Connect with friends and family instantly</p>
        
        <div className="home-features">
          <div className="feature">
            <span className="feature-icon">💬</span>
            <h3>Instant Messaging</h3>
            <p>Send and receive messages in real-time</p>
          </div>
          
          <div className="feature">
            <span className="feature-icon">👥</span>
            <h3>Online Status</h3>
            <p>See who's online and available to chat</p>
          </div>
          
          <div className="feature">
            <span className="feature-icon">✓</span>
            <h3>Read Receipts</h3>
            <p>Know when your messages are read</p>
          </div>
        </div>

        <div className="home-actions">
          <Link to="/login" className="btn-primary">
            Login
          </Link>
          <Link to="/signup" className="btn-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
