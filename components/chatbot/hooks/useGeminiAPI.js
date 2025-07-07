// src/chatbot/hooks/useGeminiAPI.js
"use client"
import { useState } from 'react';

const useGeminiAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Your Gemini API key
  const API_KEY = "AIzaSyAMN0mS5W-UyscY9teuMvFl07ST981FcEo";
  
  const sendMessageToGemini = async (message) => {
    setLoading(true);
    setError(null);
    
    try {
      // Updated Gemini API endpoint with correct model name
      const apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
      
      const response = await fetch(`${apiUrl}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API response:", errorData);
        throw new Error(`API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      // Extract the response text based on Gemini's response structure
      let responseText = "Sorry, I couldn't generate a response.";
      
      if (data.candidates && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts[0] && 
          data.candidates[0].content.parts[0].text) {
        responseText = data.candidates[0].content.parts[0].text;
      }
      
      setLoading(false);
      return responseText;
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError(err.message);
      setLoading(false);
      return "Sorry, I couldn't process that request. Please try again later.";
    }
  };

  return {
    sendMessageToGemini,
    loading,
    error,
  };
};

export default useGeminiAPI;