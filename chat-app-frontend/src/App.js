import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './styles.css';

const socket = io('http://localhost:3000'); // Make sure this URL matches your server

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input) {
            const timestamp = new Date().toLocaleTimeString();
            socket.emit('chat message', { msg: input, timestamp });
            setInput('');
        }
    };

    return (
        <div>
            <h1>Chat App</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        <strong>{message.timestamp}:</strong> {message.msg}
                    </li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type a message..." 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default App;

