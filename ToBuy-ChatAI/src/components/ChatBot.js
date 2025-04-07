import React, { useState } from 'react';
import './ChatBot.css';
import ChatScript from './ChatScript';

const ChatBot = () => {
  const [isChatVisible, setChatVisible] = useState(false);

  const toggleChat = () => {
    setChatVisible(!isChatVisible);
    console.log('Chat visibility toggled:', !isChatVisible);
  };

  return (
    <div id="chatBot-container">
      <button
        id="chatBot-toggle"
        onClick={toggleChat}
      >
        {isChatVisible ? 'Close Chat' : '💬 Chat'}
      </button>

      {isChatVisible && (
        <div id="chatBot" className="chat-visible">
          <main className="container">
            
            <div className="content" id="content">
              <ChatScript />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default ChatBot;


