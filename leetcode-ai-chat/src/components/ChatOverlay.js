import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// This is a placeholder for the Claude AI API client
// Replace this with the actual Claude AI API client when it becomes available
const claudeAI = {
  generateResponse: async (prompt) => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `This is a simulated response from Claude AI to: "${prompt}"`;
  }
};

const ChatOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = { text: inputMessage, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      try {
        // Call to Claude AI API
        const response = await claudeAI.generateResponse(inputMessage);

        const aiMessage = { text: response, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { text: "Sorry, I couldn't process that request. Please try again.", sender: 'ai' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Chat with Claude</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-2 max-w-[70%] ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-2">
                  Claude is thinking...
                </div>
              </div>
            )}
          </div>
          <div className="border-t p-4 flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Claude something..."
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatOverlay;