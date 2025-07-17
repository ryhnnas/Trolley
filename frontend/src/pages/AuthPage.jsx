import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../styles/AuthPage.css';

const AuthPage = () => {
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', loginData);
            localStorage.setItem('token', response.data.token);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', registerData);
            alert('Registrasi berhasil! Silakan login.');
            setIsSignUpActive(false); 
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal.');
        }
    };

    return (
        <div className="auth-body">
            <button className="back-to-home-btn" onClick={() => navigate(-1)}>
                &lt; Kembali
            </button>
            <div className={`auth-container ${isSignUpActive ? 'right-panel-active' : ''}`}>
                
                <div className="form-container sign-up-container">
                    <form className="auth-form" onSubmit={handleRegisterSubmit}>
                        <h1>Create Account</h1>
                        {error && isSignUpActive && <p style={{color: 'red'}}>{error}</p>}
                        <input className="auth-input" type="text" name="name" placeholder="Name" value={registerData.name} onChange={handleRegisterChange} required />
                        <input className="auth-input" type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
                        <input className="auth-input" type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required />
                        <button className="auth-button" type="submit">Sign Up</button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <h1>Sign in</h1>
                        {error && !isSignUpActive && <p style={{color: 'red'}}>{error}</p>}
                        <input className="auth-input" type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required />
                        <input className="auth-input" type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
                        <button className="auth-button" type="submit">Sign In</button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="auth-button ghost" onClick={() => setIsSignUpActive(false)}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="auth-button ghost" onClick={() => setIsSignUpActive(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;