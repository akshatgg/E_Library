// brain.js Neural Network Chat System
import { NeuralNetwork } from 'brain.js';
import { processInput, generateResponse } from './nlp-engine.js';
import { loadConfig } from './config.js';

// Core chatbot class
class DynamicChatbot {
  constructor(options = {}) {
    this.options = {
      learningRate: 0.3,
      momentum: 0.1,
      hiddenLayers: [16, 16],
      maxTokens: 100,
      temperature: 0.7,
      ...options
    };
    
    this.network = null;
    this.vocabulary = new Set();
    this.intents = [];
    this.responses = [];
    this.contextMemory = [];
    this.maxContextLength = 10;
    this.isInitialized = false;
  }
  
  // Initialize the model
  async initialize(modelPath = null) {
    try {
      if (modelPath) {
        const { model, metadata } = await this.loadModel(modelPath);
        this.network = new NeuralNetwork().fromJSON(model);
        this.vocabulary = new Set(metadata.vocabulary || []);
        this.intents = metadata.intents || [];
        this.responses = metadata.responses || [];
      } else {
        this.network = new NeuralNetwork({
          hiddenLayers: this.options.hiddenLayers,
          learningRate: this.options.learningRate,
          momentum: this.options.momentum
        });
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Initialization error:', error);
      return false;
    }
  }
  
  // Load a pre-trained model
  async loadModel(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load model: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Model loading error:', error);
      throw error;
    }
  }
  
  // Save the current model
  async saveModel() {
    if (!this.isInitialized) {
      throw new Error('Cannot save: model not initialized');
    }
    
    const modelData = {
      model: this.network.toJSON(),
      metadata: {
        vocabulary: Array.from(this.vocabulary),
        intents: this.intents,
        responses: this.responses,
        timestamp: new Date().toISOString()
      }
    };
    
    return modelData;
  }
  
  // Train the model with new data
  async train(trainingData, iterations = 2000) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // Process training data to extract vocabulary and create training pairs
    const processedData = trainingData.map(item => {
      // Extract words for vocabulary building
      const words = this.tokenize(item.input);
      words.forEach(word => this.vocabulary.add(word));
      
      // Store intent and response data
      if (!this.intents.includes(item.intent)) {
        this.intents.push(item.intent);
      }
      
      if (item.responses) {
        item.responses.forEach(response => {
          if (!this.responses.includes(response)) {
            this.responses.push(response);
          }
        });
      }
      
      return {
        input: item.input,
        intent: item.intent,
        responses: item.responses || []
      };
    });
    
    // Create training set
    const trainingSet = processedData.map(item => {
      return {
        input: this.vectorizeInput(item.input),
        output: this.vectorizeOutput(item.intent)
      };
    });
    
    // Train the network
    return this.network.train(trainingSet, {
      iterations,
      errorThresh: 0.005,
      log: true,
      logPeriod: 100
    });
  }
  
  // Process user input and generate a response
  async process(input, userId = 'default') {
    if (!this.isInitialized) {
      throw new Error('Model not initialized');
    }
    
    // Update context with the new input
    this.updateContext(userId, 'user', input);
    
    // Preprocess the input
    const cleanInput = this.preprocessInput(input);
    const inputVector = this.vectorizeInput(cleanInput);
    
    // Get prediction from neural network
    const prediction = this.network.run(inputVector);
    
    // Determine the intent
    const intentIndex = this.devectorizeOutput(prediction);
    const intent = this.intents[intentIndex];
    
    // Generate response based on intent
    const response = await this.generateResponseForIntent(intent, cleanInput, userId);
    
    // Update context with bot response
    this.updateContext(userId, 'bot', response);
    
    return {
      status: 'success',
      message: {
        id: this.generateMessageId(),
        sender: 'bot',
        text: response,
        intent: intent,
        confidence: prediction[intentIndex]
      }
    };
  }
  
  // Generate a response based on detected intent
  async generateResponseForIntent(intent, input, userId) {
    // Get all responses for this intent
    const matchingResponses = this.responses.filter(response => 
      response.intent === intent
    );
    
    if (matchingResponses.length === 0) {
      return "I'm not sure how to respond to that.";
    }
    
    // Get the context for this user
    const userContext = this.getContext(userId);
    
    // Select the best response using additional NLP techniques
    const responseText = await this.selectBestResponse(matchingResponses, input, userContext);
    
    return responseText;
  }
  
  // Select the best response from candidates
  async selectBestResponse(candidates, input, context) {
    if (candidates.length === 1) {
      return candidates[0].text;
    }
    
    // Calculate relevance scores for each candidate
    const scoredCandidates = candidates.map(candidate => {
      let score = 0;
      
      // Score based on keyword matching
      const inputTokens = this.tokenize(input);
      const responseTokens = this.tokenize(candidate.text);
      const keywordMatches = responseTokens.filter(token => 
        inputTokens.includes(token)
      ).length;
      
      score += keywordMatches * 0.5;
      
      // Score based on context relevance
      if (context.length > 0) {
        const lastUserMessage = context
          .filter(msg => msg.sender === 'user')
          .pop();
          
        if (lastUserMessage) {
          const contextTokens = this.tokenize(lastUserMessage.text);
          const contextMatches = responseTokens.filter(token => 
            contextTokens.includes(token)
          ).length;
          
          score += contextMatches * 0.3;
        }
      }
      
      // Adjust for response variety
      const recentResponses = context
        .filter(msg => msg.sender === 'bot')
        .slice(-3)
        .map(msg => msg.text);
        
      if (recentResponses.includes(candidate.text)) {
        score -= 1.0; // Heavily penalize repeated responses
      }
      
      return {
        text: candidate.text,
        score: score
      };
    });
    
    // Sort by score and add some randomness based on temperature
    scoredCandidates.sort((a, b) => b.score - a.score);
    
    const temperature = this.options.temperature;
    if (temperature > 0) {
      // Apply temperature-based selection
      // Higher temperatures make selection more random
      const topN = Math.max(1, Math.floor(candidates.length * temperature));
      const selectedIndex = Math.floor(Math.random() * topN);
      return scoredCandidates[selectedIndex].text;
    } else {
      // Just return the highest scoring response
      return scoredCandidates[0].text;
    }
  }
  
  // Update the conversation context
  updateContext(userId, sender, text) {
    if (!this.contextMemory[userId]) {
      this.contextMemory[userId] = [];
    }
    
    this.contextMemory[userId].push({
      timestamp: Date.now(),
      sender,
      text
    });
    
    // Trim to max length
    if (this.contextMemory[userId].length > this.maxContextLength) {
      this.contextMemory[userId] = this.contextMemory[userId].slice(-this.maxContextLength);
    }
  }
  
  // Get context for a user
  getContext(userId) {
    return this.contextMemory[userId] || [];
  }
  
  // Helper method to preprocess input
  preprocessInput(input) {
    return input.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .trim();
  }
  
  // Tokenize text into words
  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }
  
  // Convert text input to vector
  vectorizeInput(input) {
    const tokens = this.tokenize(input);
    const vocabArray = Array.from(this.vocabulary);
    
    // Create a binary bag of words vector
    const inputVector = new Array(vocabArray.length).fill(0);
    
    tokens.forEach(token => {
      const index = vocabArray.indexOf(token);
      if (index !== -1) {
        inputVector[index] = 1;
      }
    });
    
    return inputVector;
  }
  
  // Convert intent to output vector
  vectorizeOutput(intent) {
    const index = this.intents.indexOf(intent);
    const outputVector = new Array(this.intents.length).fill(0);
    
    if (index !== -1) {
      outputVector[index] = 1;
    }
    
    return outputVector;
  }
  
  // Convert output vector to intent index
  devectorizeOutput(outputVector) {
    return outputVector.indexOf(Math.max(...outputVector));
  }
  
  // Generate a unique message ID
  generateMessageId() {
    return crypto.randomUUID ? crypto.randomUUID() : 
      Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// NLP engine for more advanced text processing
export const nlpEngine = {
  // Extract entities from text
  extractEntities(text) {
    // Simple regex-based entity extraction
    const entities = {
      email: text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [],
      phone: text.match(/(\+\d{1,3}\s?)?(\(\d{1,4}\)\s?)?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}/g) || [],
      url: text.match(/https?:\/\/[^\s]+/g) || [],
      date: text.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/g) || []
    };
    
    return entities;
  },
  
  // Sentiment analysis (very basic)
  analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'thanks', 'thank you'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'upset', 'disappointed'];
    
    const tokens = text.toLowerCase().split(/\s+/);
    
    let score = 0;
    tokens.forEach(token => {
      if (positiveWords.includes(token)) score += 1;
      if (negativeWords.includes(token)) score -= 1;
    });
    
    return {
      score,
      sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
  }
};

// Example usage
export async function createChatbot(config = {}) {
  const chatbot = new DynamicChatbot(config);
  await chatbot.initialize();
  
  // Sample training data
  const trainingData = [
    {
      input: "Hello there",
      intent: "greeting",
      responses: ["Hi there! How can I help you today?", "Hello! What can I do for you?"]
    },
    {
      input: "Hi",
      intent: "greeting",
      responses: ["Hello! How are you doing?", "Hi there! How can I assist you?"]
    },
    {
      input: "What's your name",
      intent: "bot_identity",
      responses: ["I'm a dynamic chatbot. You can call me DynaBot.", "My name is DynaBot!"]
    },
    {
      input: "How are you",
      intent: "well_being",
      responses: ["I'm functioning well, thank you for asking!", "All systems operational and ready to help!"]
    },
    {
      input: "Tell me a joke",
      intent: "joke",
      responses: ["Why don't scientists trust atoms? Because they make up everything!", 
                  "How does a computer get drunk? It takes screenshots!"]
    },
    {
      input: "Thank you",
      intent: "gratitude",
      responses: ["You're welcome!", "Happy to help!", "Anytime!"]
    },
    {
      input: "Goodbye",
      intent: "farewell",
      responses: ["Goodbye! Have a great day!", "See you later!", "Take care!"]
    }
  ];
  
  await chatbot.train(trainingData);
  return chatbot;
}

// Helper functions for API integration
export async function handleChatbotRequest(request) {
  try {
    // Get or create chatbot instance
    const chatbot = await getChatbotInstance();
    
    const { input, userId = 'default' } = request;
    
    if (!input) {
      return { 
        status: 'error', 
        message: 'No input provided' 
      };
    }
    
    // Process input and get response
    return await chatbot.process(input, userId);
    
  } catch (error) {
    console.error('Chatbot error:', error);
    return { 
      status: 'error', 
      message: 'An error occurred while processing your request' 
    };
  }
}

// Singleton for chatbot instance
let botInstance = null;
async function getChatbotInstance() {
  if (!botInstance) {
    // Load config from environment or config file
    const config = await loadConfig();
    botInstance = await createChatbot(config);
  }
  return botInstance;
}