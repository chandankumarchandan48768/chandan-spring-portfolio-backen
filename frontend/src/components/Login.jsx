import React, { useState } from 'react';
import { Mail, Lock, Key, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Password Reset State
    const [resetMode, setResetMode] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                onLoginSuccess(response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setResetMessage('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setResetStep(2);
            setResetMessage('OTP sent to your email! (Check spam folder)');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setResetStep(1);
            setResetMode(false);
            setResetMessage('Password reset successfully! You can now login.');
            setOtp('');
            setNewPassword('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP or Reset Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)' }}>
            <div className="card glass-effect" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', marginBottom: '1rem' }}>
                        <Lock size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{resetMode ? 'Reset Password' : 'Admin Login'}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {resetMode ? 'Verify your identity to regain access.' : 'Secure portal to manage your portfolio.'}
                    </p>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

                {resetMessage && !error && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>{resetMessage}</div>}

                {!resetMode ? (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="Admin Email"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="Password"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => { setResetMode(true); setError(''); setResetMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
                                Forgot Password?
                            </button>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
                        </button>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {resetStep === 1 && (
                            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="Enter your email" style={{ paddingLeft: '2.75rem' }} required />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </form>
                        )}

                        {resetStep === 2 && (
                            <form onSubmit={handleVerifyAndReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <CheckCircle size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="input" placeholder="6-digit OTP" style={{ paddingLeft: '2.75rem', letterSpacing: '2px' }} required maxLength={6} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" placeholder="New Password" style={{ paddingLeft: '2.75rem' }} required minLength={6} />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Reset Password'}
                                </button>
                            </form>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button type="button" onClick={() => { setResetMode(false); setResetStep(1); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}>
                                ← Back to Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
