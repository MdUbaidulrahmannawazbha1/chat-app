 import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-orb orb-one" />
      <div className="home-orb orb-two" />
      <div className="home-content">
        <span className="eyebrow">Personal chatbot starter</span>
        <h1>NawazBot turns this repo into your own chatbot version.</h1>
        <p>
          This build keeps the app self-contained, branded, and easy to customize.
          You can rename the bot, change the theme, and swap in a real AI later.
        </p>
        
        <div className="home-features">
          <div className="feature-card">
            <span className="feature-icon">01</span>
            <h3>Custom personality</h3>
            <p>Change the welcome text, quick prompts, and response style.</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">02</span>
            <h3>Simple backend</h3>
            <p>Replies come from a lightweight API that works out of the box.</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">03</span>
            <h3>Saved conversation</h3>
            <p>Your chat history stays in the browser so you can keep iterating.</p>
          </div>
        </div>

        <div className="home-actions">
          <Link to="/chat" className="btn-primary">
            Open chatbot
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
