import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { getClaudeResponse } from '../services/Claude';

const ChatOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const newMessage = { text: inputMessage, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getClaudeResponse(inputMessage);
      const botResponse = { text: response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error getting Claude AI response:', error);
      const errorResponse = { text: error.message, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <button
          onClick={toggleChat}
          aria-label="Open chat"
          className="bg-pink-400 text-white p-3 rounded-full shadow-lg hover:bg-pink-500 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="bg-pink-50 rounded-lg shadow-xl w-80 h-96 flex flex-col border-2 border-pink-300">
          <div className="bg-pink-400 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold font-cursive text-lg">Chat with Chloe</h3>
            <button onClick={toggleChat} aria-label="Close chat" className="text-white hover:text-pink-200">
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 bg-pink-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-pink-400 text-white'
                      : 'bg-white text-pink-800 border border-pink-300'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-pink-300 bg-white">
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                aria-label="Chat message"
                className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400 border-pink-300"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                aria-label="Send message"
                className={`bg-pink-400 text-white p-2 rounded-r-lg transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-500'
                }`}
                disabled={isLoading}
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatOverlay;