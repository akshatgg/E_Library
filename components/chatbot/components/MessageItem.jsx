// src/chatbot/components/MessageItem.jsx
import React from 'react';

const MessageItem = ({ message }) => {
  const { text, sender } = message;
  
  return (
    <div className={`message-item ${sender}`}>
      <div className="message-content">
        {text}
      </div>
    </div>
  );
};

export default MessageItem;