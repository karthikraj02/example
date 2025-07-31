import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("User" + Math.floor(Math.random() * 1000));

  useEffect(() => {
    axios.get("http://localhost:5000/messages").then(res => {
      setMessages(res.data);
    });

    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit('sendMessage', { sender: name, content: text });
      setText('');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
      <h2 style={{ background: '#1d4ed8', color: 'white', padding: '10px', borderRadius: '5px' }}>
        Two-Way Chat
      </h2>

      <div style={{
        maxHeight: 300,
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
      }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ margin: 5 }}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage} style={{ padding: '8px 12px' }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
