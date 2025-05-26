'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  enabled?: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({ enabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Date.now().toString(36) + Math.random().toString(36).substr(2));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Capture conversation when messages change
  useEffect(() => {
    if (messages.length > 1) { // Don't capture just the welcome message
      captureConversation();
    }
  }, [messages]);

  const captureConversation = async () => {
    try {
      const conversation = {
        id: sessionId,
        timestamp: new Date().toISOString(),
        messages: messages.map(msg => ({
          id: msg.id,
          text: msg.text,
          isBot: msg.isBot,
          timestamp: msg.timestamp.toISOString()
        })),
        sessionId,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        resolved: false
      };

      await fetch('/api/chat-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation }),
      });
    } catch (error) {
      console.error('Failed to capture conversation:', error);
    }
  };

  const handleBotAction = (action: { type: string; target: string; guidance?: string }) => {
    if (action.type === 'redirect' && typeof window !== 'undefined') {
      // Don't actually redirect - just show the guidance message with a link
      if (action.guidance) {
        // Modify the guidance to include a clickable link instead
        const linkText = action.target.includes('/book') ? 'Click here to book' : 
                        action.target.includes('/contact') ? 'Click here to contact us' :
                        action.target.includes('/services') ? 'Click here to view services' :
                        'Click here to learn more';
        
        const guidanceWithLink = `${action.guidance} ${linkText}: ${window.location.origin}${action.target}`;
        
        setTimeout(() => {
          const guidanceMessage: Message = {
            id: Date.now().toString() + '_guidance',
            text: guidanceWithLink,
            isBot: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, guidanceMessage]);
        }, 500); // Small delay for natural conversation flow
      }

      // Fire analytics event
      if (window.gtag) {
        window.gtag('event', 'chatbot_suggested_link', {
          event_category: 'engagement',
          event_label: action.target
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message when chat opens
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "Hi! I'm here to help answer questions about our therapy services. How can I assist you today?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        text: data.response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle automatic redirects and guidance
      if (data.action) {
        handleBotAction(data.action);
      }

      // Fire GA4 event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'chatbot_interaction', {
          event_category: 'engagement',
          event_label: 'question_asked'
        });
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        text: "I'm sorry, I'm having trouble responding right now. Please feel free to contact us directly at jana@bloompsychologynorthaustin.com or book a free consultation.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Fire GA4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', isOpen ? 'chatbot_closed' : 'chatbot_opened', {
        event_category: 'engagement',
        event_label: 'chatbot_toggle'
      });
    }
  };

  if (!enabled) return null;

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-bloompink hover:bg-[#B03979] text-white rounded-full p-4 shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-40 bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-96 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-bloompink text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Bloom Assistant</h3>
                  <p className="text-xs opacity-90">Here to help</p>
                </div>
              </div>
              <button onClick={toggleChat} className="text-white hover:text-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-bloompink text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about our services..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-bloompink hover:bg-[#B03979] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;