import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import '../styles/ChatInboxPage.css';

const ChatInboxPage = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setCurrentUser(jwtDecode(token));
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const fetchConversations = async () => {
            try {
                const res = await api.get('/chat/inbox', config);
                setConversations(res.data);
            } catch (error) {
                toast.error("Gagal memuat daftar chat.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    if (loading) return <p>Memuat inbox...</p>;

    return (
        <div className="inbox-container">
            <h1>Inbox Pesan</h1>
            <div className="conversation-list">
                {conversations.length > 0 ? conversations.map(convo => {
                    const otherPartyName = currentUser.role === 'seller' ? convo.buyer_name : convo.seller_name;
                    
                    return (
                        <Link to={`/chat/${convo.id}`} key={convo.id} className="conversation-item">
                            <div className="convo-info">
                                <p className="buyer-name">Percakapan dengan: {otherPartyName}</p>
                                <p className="product-name">Produk: {convo.product_name}</p>
                                <p className="last-message">{convo.last_message || "Belum ada pesan."}</p>
                            </div>
                            {convo.unread_count > 0 && (
                                <div className="unread-badge">
                                    {convo.unread_count}
                                </div>
                            )}
                        </Link>
                    )
                }) : (
                    <p>Tidak ada pesan masuk.</p>
                )}
            </div>
        </div>
    );
};

export default ChatInboxPage;