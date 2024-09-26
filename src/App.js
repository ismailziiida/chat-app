import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connect to the server

function App() {
    const [messages, setMessages] = useState([]); // State for messages
    const [input, setInput] = useState(''); // State for input

    useEffect(() => {
        // Listen for incoming messages
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Clean up the listener on unmount
        return () => {
            socket.off('chat message');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (input) {
            const messageData = { msg: input, timestamp: new Date().toLocaleTimeString() };
            socket.emit('chat message', messageData); // Send message to server
            setInput(''); // Clear input field
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <h1>Chat Application</h1>
            <ul style={{ listStyleType: 'none', padding: 0, height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                {messages.map((message, index) => (
                    <li key={index} style={{ margin: '10px 0', padding: '8px', background: '#ececec', borderRadius: '5px' }}>
                        {message.msg} <span style={{ fontSize: '0.8em', color: '#999' }}>({message.timestamp})</span>
                    </li>
                ))}
            </ul>
            <form onSubmit={sendMessage} style={{ display: 'flex', marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default App;
