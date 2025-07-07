// src/chatbot/index.js
"use client"
import React, { useState, useEffect, useRef } from 'react';
import ChatIcon from './components/ChatIcon';
import ChatWindow from './components/ChatWindow';
import useGeminiAPI from './hooks/useGeminiAPI';
import './styles/chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const { sendMessageToGemini, loading } = useGeminiAPI();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Reset to corner position when closing
    if (isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = async (message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    try {
      // Get response from Gemini API
      const response = await sendMessageToGemini(message);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`chatbot-container ${isExpanded ? 'expanded' : ''}`} ref={chatRef}>
      {isOpen && (
        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          onClose={toggleChat}
          isLoading={loading}
          isExpanded={isExpanded}
          onToggleExpand={toggleExpand}
        />
      )}
      {!isExpanded && <ChatIcon onClick={toggleChat} isOpen={isOpen} />}
    </div>
  );
};

export default Chatbot;