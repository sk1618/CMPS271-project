import React, { useState, useRef, useEffect } from 'react';

// API Key for the chat completion (replace with your actual API key)!!!!!!!!!!!!!!!!!!!!!(ask me)
const API_KEY = '';

const ChatScript = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello!👋 How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      { sender: 'user', text: input }
    ];
    setMessages(newMessages);
    setInput('');

    // Call the API to get bot's response
    fetchBotResponse(input, newMessages);
  };

  const fetchBotResponse = (question, updatedMessages) => {
    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-llama-70b:free",
        messages: [
          { role: "user", content: question },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const botResponse = data.choices[0].message.content;

        // Add bot message
        const updatedMessagesWithBot = [
          ...updatedMessages,
          { sender: 'bot', text: botResponse }
        ];
        setMessages(updatedMessagesWithBot);
      })
      .catch((error) => {
        console.error("Error fetching bot response:", error);
      });
  };

  // Scroll to bottom when new message is added
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <footer className="chat-form">
        <input
          type="text"
          className="chat-input"
          placeholder="How can I assist with your finances today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="send-button" onClick={handleSendMessage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ fill: 'white' }}
          >
            <path d="m21.426 11.095-17-8A1 1 0 0 0 3.03 4.242l1.212 4.849L12 12l-7.758 2.909-1.212 4.849a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81z"></path>
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default ChatScript;
