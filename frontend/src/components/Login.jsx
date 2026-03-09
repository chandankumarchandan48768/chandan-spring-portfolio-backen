import React, { useState } from 'react';
import { Mail, Lock, Key, CheckCircle, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Modes: 'login' | 'forgot' | 'register'
    const [mode, setMode] = useState('login');

    // Password Reset State
    const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP+NewPass
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Registration State
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regOtp, setRegOtp] = useState('');
    const [regStep, setRegStep] = useState(1); // 1: Form, 2: OTP Verify

    const clearMessages = () => { setError(''); setSuccessMsg(''); };

    // ── Login ──────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                onLoginSuccess(response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    // ── Forgot Password ────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setResetStep(2);
            setSuccessMsg('OTP sent to your email! Check your inbox (or spam folder).');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Check if the email is registered.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setMode('login');
            setResetStep(1);
            setSuccessMsg('Password reset successfully! You can now sign in.');
            setOtp('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP or reset failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Admin Registration ─────────────────────────────
    const handleRequestRegistration = async (e) => {
        e.preventDefault();
        clearMessages();
        if (regPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/register', { email: regEmail, password: regPassword });
            setRegStep(2);
            setSuccessMsg(
                'Registration request sent! An OTP has been sent to the master admin (chandankumarchandan48768@gmail.com). ' +
                'Obtain the OTP from the master admin, then enter it below to complete your registration.'
            );
        } catch (err) {
            setError(err.response?.data?.error || 'Registration request failed. This email may already be registered.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyRegistration = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);
        try {
            await api.post('/auth/verify-registration', { email: regEmail, otp: regOtp });
            setMode('login');
            setRegStep(1);
            setEmail(regEmail);
            setRegEmail('');
            setRegPassword('');
            setRegOtp('');
            setSuccessMsg('Admin account created! You can now sign in with your new credentials.');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP. It may have expired. Please request a new registration.');
        } finally {
            setLoading(false);
        }
    };

    // ── UI Helpers ─────────────────────────────────────
    const styles = {
        container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)', padding: '1rem' },
        card: { width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
        header: { textAlign: 'center', marginBottom: '2rem' },
        iconBox: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', marginBottom: '1rem' },
        errorBox: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center', lineHeight: '1.4' },
        successBox: { background: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center', lineHeight: '1.4' },
        inputWrapper: { position: 'relative' },
        iconStyle: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' },
        inputPad: { paddingLeft: '2.75rem' },
        tabs: { display: 'flex', gap: '0', marginBottom: '1.5rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' },
        tab: (active) => ({ flex: 1, padding: '0.65rem', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', background: active ? 'var(--primary)' : 'transparent', color: active ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s' }),
        backLink: { background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '1rem', textAlign: 'center', display: 'block', width: '100%' },
        form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
        hint: { fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.4' }
    };

    const getIcon = () => {
        if (mode === 'register') return <UserPlus size={28} />;
        if (mode === 'forgot') return <Key size={28} />;
        return <Lock size={28} />;
    };

    const getTitle = () => {
        if (mode === 'register') return regStep === 1 ? 'Create Admin Account' : 'Verify Registration';
        if (mode === 'forgot') return resetStep === 1 ? 'Forgot Password' : 'Reset Password';
        return 'Admin Login';
    };

    return (
        <div style={styles.container}>
            <div className="card glass-effect" style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.iconBox}>{getIcon()}</div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{getTitle()}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        {mode === 'login' ? 'Secure portal to manage your portfolio.' :
                            mode === 'register' ? 'Register a new admin account with master approval.' :
                                'Verify your identity to regain access.'}
                    </p>
                </div>

                {/* Mode Tabs (Login / Register) */}
                {mode !== 'forgot' && (
                    <div style={styles.tabs}>
                        <button style={styles.tab(mode === 'login')} onClick={() => { setMode('login'); clearMessages(); }}>
                            Sign In
                        </button>
                        <button style={styles.tab(mode === 'register')} onClick={() => { setMode('register'); clearMessages(); setRegStep(1); }}>
                            Register
                        </button>
                    </div>
                )}

                {/* Messages */}
                {error && <div style={styles.errorBox}>{error}</div>}
                {successMsg && !error && <div style={styles.successBox}>{successMsg}</div>}

                {/* ── Login Form ── */}
                {mode === 'login' && (
                    <form onSubmit={handleLogin} style={styles.form}>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.iconStyle} />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className="input" placeholder="Admin Email" style={styles.inputPad} required />
                        </div>
                        <div style={styles.inputWrapper}>
                            <Key size={18} style={styles.iconStyle} />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                className="input" placeholder="Password" style={styles.inputPad} required />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => { setMode('forgot'); setResetStep(1); clearMessages(); }}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
                                Forgot Password?
                            </button>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            {loading ? 'Authenticating...' : 'Sign In'} {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}

                {/* ── Forgot Password ── */}
                {mode === 'forgot' && (
                    <div style={styles.form}>
                        {resetStep === 1 && (
                            <form onSubmit={handleSendOtp} style={styles.form}>
                                <div style={styles.inputWrapper}>
                                    <Mail size={18} style={styles.iconStyle} />
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                        className="input" placeholder="Your registered email" style={styles.inputPad} required />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </form>
                        )}
                        {resetStep === 2 && (
                            <form onSubmit={handleResetPassword} style={styles.form}>
                                <div style={styles.inputWrapper}>
                                    <CheckCircle size={18} style={styles.iconStyle} />
                                    <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                                        className="input" placeholder="6-digit OTP" style={{ ...styles.inputPad, letterSpacing: '2px' }}
                                        required maxLength={6} />
                                </div>
                                <div style={styles.inputWrapper}>
                                    <Key size={18} style={styles.iconStyle} />
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                        className="input" placeholder="New Password (min 6 chars)" style={styles.inputPad}
                                        required minLength={6} />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        )}
                        <button onClick={() => { setMode('login'); setResetStep(1); clearMessages(); }} style={styles.backLink}>
                            ← Back to Login
                        </button>
                    </div>
                )}

                {/* ── Admin Registration ── */}
                {mode === 'register' && (
                    <div>
                        {regStep === 1 && (
                            <form onSubmit={handleRequestRegistration} style={styles.form}>
                                <div style={styles.inputWrapper}>
                                    <Mail size={18} style={styles.iconStyle} />
                                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                                        className="input" placeholder="New Admin Email" style={styles.inputPad} required />
                                </div>
                                <div style={styles.inputWrapper}>
                                    <Key size={18} style={styles.iconStyle} />
                                    <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                                        className="input" placeholder="Set Password (min 6 chars)" style={styles.inputPad}
                                        required minLength={6} />
                                </div>
                                <p style={styles.hint}>
                                    An OTP will be sent to the master admin for approval. You'll need to get the OTP from them to complete registration.
                                </p>
                                <button type="submit" className="btn btn-primary" disabled={loading}
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    {loading ? 'Submitting...' : <>Request Registration <ShieldCheck size={18} /></>}
                                </button>
                            </form>
                        )}
                        {regStep === 2 && (
                            <form onSubmit={handleVerifyRegistration} style={styles.form}>
                                <div style={{ ...styles.hint, background: 'rgba(var(--primary-rgb),0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                    Registration Email: <strong>{regEmail}</strong>
                                </div>
                                <div style={styles.inputWrapper}>
                                    <CheckCircle size={18} style={styles.iconStyle} />
                                    <input type="text" value={regOtp} onChange={e => setRegOtp(e.target.value)}
                                        className="input" placeholder="Enter OTP from master admin"
                                        style={{ ...styles.inputPad, letterSpacing: '2px' }} required maxLength={6} />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    {loading ? 'Verifying...' : <>Verify & Create Account <ArrowRight size={18} /></>}
                                </button>
                                <button type="button" onClick={() => { setRegStep(1); clearMessages(); }} style={styles.backLink}>
                                    ← Back (request new OTP)
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
