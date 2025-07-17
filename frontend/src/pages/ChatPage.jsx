import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { socket } from '../socket';
import { jwtDecode } from 'jwt-decode';
import '../styles/ChatPage.css';


const ChatPage = () => {
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setCurrentUser(jwtDecode(token));
        }

        socket.emit('join_room', conversationId);

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const markAsRead = () => {
            api.patch(`/chat/messages/${conversationId}/read`, {}, config)
                .catch(err => console.error("Gagal menandai pesan terbaca", err));
        };
        markAsRead();

        api.get(`/chat/messages/${conversationId}`, config)
            .then(res => setMessages(res.data));

        const messageListener = (data) => {
            setMessages(prevMessages => {
                if (prevMessages.find(msg => msg.id === data.id)) return prevMessages;
                return [...prevMessages, data];
            });
        };
        socket.on('receive_message', messageListener);
        return () => socket.off('receive_message', messageListener);
    }, [conversationId]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !currentUser) return;

        const messageData = {
            conversation_id: conversationId,
            sender_id: currentUser.id,
            receiver_id: 0, 
            message_text: newMessage,
        };

        const optimisticMessage = { ...messageData, id: Date.now() };
        setMessages(prev => [...prev, optimisticMessage]);

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    if (!currentUser) return <p>Memuat...</p>;

    return (
        <div className="chat-page-container">
            <div className="chat-header">
                <button className="chat-back-btn" onClick={() => navigate(-1)}>&lt;</button>
                <span>Obrolan Produk</span>
            </div>
            <div className="message-list">
                {messages.map(msg => (
                    <div key={msg.id} className={`message-bubble ${msg.sender_id === currentUser.id ? 'sent' : 'received'}`}>
                        {msg.message_text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form className="message-form" onSubmit={handleSendMessage}>
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Ketik pesan..."
                />
                <button type="submit">Kirim</button>
            </form>
        </div>
    );
};

export default ChatPage;