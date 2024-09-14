import React from 'react';
import ChatOverlay from './components/ChatOverlay';

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-center mt-10">Welcome to Your Coding Assistant</h1>
      <p className="text-center mt-4">Click the chat icon in the bottom right corner to get started!</p>
      <ChatOverlay />
    </div>
  );
}

export default App;