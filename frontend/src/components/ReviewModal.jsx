import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/OrderHistory.css'; 

const ReviewModal = ({ show, onClose, product, orderId, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    if (!show) return null;

    const handleSubmit = () => {
        if (rating === 0) {
            alert("Mohon berikan rating bintang.");
            return;
        }
        onSubmit({ productId: product.product_id, orderId, rating, comment });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content review-modal">
                <h2>Beri Ulasan untuk</h2>
                <h3>{product.product_name}</h3>
                <div className="star-rating">
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                            <FaStar
                                key={index}
                                className="star"
                                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                size={40}
                                onClick={() => setRating(ratingValue)}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                            />
                        );
                    })}
                </div>
                <textarea
                    rows="5"
                    placeholder="Bagaimana pendapat Anda tentang produk ini?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', marginTop: '20px' }}
                />
                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="cancel-btn">Batal</button>
                    <button type="button" onClick={handleSubmit} className="profile-button">Kirim Ulasan</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;