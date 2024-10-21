// pages/about.js
import React, { useState, useEffect } from 'react';
import Layout from './Layout';

// Fungsi untuk membuat nama acak
const generateRandomName = () => {
  const names = ['Hikaru', 'Akira', 'Yuki', 'Sora', 'Rin', 'Emi'];
  return names[Math.floor(Math.random() * names.length)];
};

const Ai = () => {
  const [messages, setMessages] = useState([]); // Menyimpan pesan chat
  const [input, setInput] = useState(''); // Input pertanyaan pengguna
  const [loading, setLoading] = useState(false); // Indikator loading
  const [error, setError] = useState(null); // Pesan error
  const [randomName, setRandomName] = useState(''); // Nama acak

  // Membuat nama acak saat komponen pertama kali di-load
  useEffect(() => {
    setRandomName(generateRandomName());
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]); // Tambahkan pesan pengguna
    setInput(''); // Kosongkan input
    setLoading(true); // Set loading true

    try {
      const apiUrl = `/api/ai/emilia?ask=${encodeURIComponent(input)}&name=${encodeURIComponent(randomName)}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.status) {
        const aiMessage = { role: 'ai', text: result.answer };
        setMessages((prev) => [...prev, aiMessage]); // Tambahkan pesan AI
      } else {
        setError('AI failed to respond. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false); // Set loading false
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <h1>Chat with Emilia</h1>
        <p>Chatting as: <strong>{randomName}</strong></p>

        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            height: '400px',
            overflowY: 'scroll',
            marginBottom: '10px',
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.role === 'user' ? 'right' : 'left',
                margin: '5px 0',
              }}
            >
              <strong>{msg.role === 'user' ? randomName : 'Emilia'}:</strong>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Emilia something..."
            style={{ flex: 1, marginRight: '10px' }}
            required
          />
          <button type="submit" disabled={loading} style={{ padding: '10px' }}>
            {loading ? '...' : 'Send'}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </Layout>
  );
};

export default Ai;