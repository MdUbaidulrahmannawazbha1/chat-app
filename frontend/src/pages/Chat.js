import React from 'react';
import ChatBox from '../components/ChatBox';
import { useChat } from '../context/ChatContext';

const Chat = () => {
  const { botProfile, userName, setUserName, messages, suggestions, isTyping, clearChat } = useChat();

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">NB</div>
          <div>
            <h3>{botProfile.name}</h3>
            <p>{botProfile.tagline}</p>
          </div>
        </div>

        <div className="sidebar-panel">
          <label htmlFor="display-name">Your display name</label>
          <input
            id="display-name"
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="Guest"
          />
          <p>This name is used in the greeting and next to your messages.</p>
        </div>

        <div className="sidebar-panel">
          <h4>What this version does</h4>
          <ul className="feature-list">
            <li>Uses one branded chatbot instead of contacts.</li>
            <li>Saves your conversation in the browser.</li>
            <li>Returns simple replies from a small backend.</li>
          </ul>
        </div>

        <div className="sidebar-stats">
          <div>
            <strong>{messages.length}</strong>
            <span>Messages</span>
          </div>
          <div>
            <strong>{suggestions.length}</strong>
            <span>Suggestions</span>
          </div>
          <div>
            <strong>{isTyping ? 'Yes' : 'No'}</strong>
            <span>Typing</span>
          </div>
        </div>

        <button type="button" className="btn-secondary wide" onClick={clearChat}>
          Restart conversation
        </button>
      </div>

      <div className="chat-main">
        <div className="chat-topbar">
          <div>
            <span className="eyebrow">Custom chatbot</span>
            <h2>Make this repo your own</h2>
            <p>Change the assistant copy, colors, and reply rules to fit your style.</p>
          </div>
        </div>

        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
