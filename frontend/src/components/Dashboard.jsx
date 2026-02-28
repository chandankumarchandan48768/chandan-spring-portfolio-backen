import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Upload, BookOpen, Briefcase, Code, Folder, LogOut, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { educationService, skillsService, experienceService, projectService, resumeService } from '../services/api';
import Modal from './Modal';
import PortfolioForm from './PortfolioForm';

const Dashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('education');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [resumeStatus, setResumeStatus] = useState({ exists: false, url: null });

    const getUploadUrl = (filename) => {
        if (!filename) return '';
        if (filename.startsWith('http')) return filename; // S3 full URL
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api$/, '');
        return filename.startsWith('/uploads/') ? `${baseUrl}${filename}` : `${baseUrl}/uploads/${filename}`;
    };

    const tabs = [
        { id: 'education', label: 'Education', icon: BookOpen },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: Folder },
    ];

    const getService = useCallback(() => {
        if (activeTab === 'education') return educationService;
        if (activeTab === 'skills') return skillsService;
        if (activeTab === 'experience') return experienceService;
        if (activeTab === 'projects') return projectService;
    }, [activeTab]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const service = getService();
            const response = await service.getAll();
            setData(response.data || []);

            // Also fetch resume status
            const resumeRes = await resumeService.getStatus();
            setResumeStatus(resumeRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [getService]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const service = getService();
                await service.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const service = getService();
            let dataToSend = { ...formData };

            // Handle technologies as an array for projects
            if (activeTab === 'projects' && typeof dataToSend.technologies === 'string') {
                dataToSend.technologies = dataToSend.technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
            }

            // Handle skillsUsed and responsibilities as arrays for experience
            if (activeTab === 'experience') {
                if (typeof dataToSend.skillsUsed === 'string') {
                    dataToSend.skillsUsed = dataToSend.skillsUsed.split(',').map(s => s.trim()).filter(s => s !== '');
                }
                if (typeof dataToSend.responsibilities === 'string') {
                    dataToSend.responsibilities = dataToSend.responsibilities.split(',').map(r => r.trim()).filter(r => r !== '');
                }
            }

            if (editingItem && editingItem.id) {
                await service.update(editingItem.id, dataToSend);
            } else {
                await service.create(dataToSend);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleFileUpload = async (id, type) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const service = getService();
                    if (activeTab === 'education') {
                        if (type === 'marksCard') await service.uploadMarksCard(id, file);
                        else await service.uploadCertificate(id, file);
                    } else if (activeTab === 'projects' && type === 'image') {
                        await service.uploadImage(id, file);
                    } else if (activeTab === 'skills' && type === 'icon') {
                        await service.uploadIcon(id, file);
                    } else if (type === 'certificate') {
                        await service.uploadCertificate(id, file);
                    }
                    fetchData();
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('Error uploading file. Check console.');
                }
            }
        };
        input.click();
    };

    const handleResumeUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    await resumeService.upload(file);
                    fetchData(); // Refreshes status
                } catch (err) {
                    alert('Failed to upload resume. PDF only.');
                }
            }
        };
        input.click();
    };

    const handleDeleteResume = async () => {
        if (window.confirm('Delete your uploaded resume?')) {
            try {
                await resumeService.delete();
                fetchData();
            } catch (err) {
                alert('Failed to delete resume.');
            }
        }
    };

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <header className="section-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '0.75rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.025em'
                    }}>
                        Portfolio Control Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage your professional identity with ease</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleAdd} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
                        <Plus size={20} />
                        Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </button>
                    <button onClick={onLogout} className="btn" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </header>

            {/* Resume Management Card */}
            <div className="card glass-effect" style={{ marginBottom: '3rem', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: resumeStatus.exists ? '#dcfce7' : '#f3f4f6', borderRadius: '12px', color: resumeStatus.exists ? '#16a34a' : '#6b7280' }}>
                        <FileText size={28} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>Master Resume</h3>
                        {resumeStatus.exists ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.9rem', fontWeight: 500 }}>
                                <CheckCircle size={16} /> Ready for download
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}>
                                <AlertCircle size={16} /> No resume uploaded
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleResumeUpload} className="btn" style={{ background: 'var(--bg-secondary)', color: 'var(--primary)', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                        <Upload size={18} /> {resumeStatus.exists ? 'Update PDF' : 'Upload PDF'}
                    </button>
                    {resumeStatus.exists && (
                        <>
                            <a href={getUploadUrl(resumeStatus.url)} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                View Resume
                            </a>
                            <button onClick={handleDeleteResume} className="btn" style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '3rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                scrollbarWidth: 'none'
            }}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`btn glass-effect ${activeTab === tab.id ? 'active' : ''}`}
                            style={{
                                padding: '1rem 2rem',
                                flexShrink: 0,
                                borderRadius: '16px',
                                fontSize: '1rem'
                            }}
                        >
                            <Icon size={20} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {loading ? (
                <div className="animate-slide-up" style={{ textAlign: 'center', padding: '8rem 2rem', color: 'var(--text-secondary)' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
                        {/* Outer glowing ring */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            border: '3px solid transparent',
                            borderTopColor: 'var(--primary)',
                            borderRightColor: 'var(--accent)',
                            borderRadius: '50%',
                            animation: 'spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
                        }}></div>
                        {/* Inner spinning ring */}
                        <div style={{
                            position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px',
                            border: '3px solid transparent',
                            borderTopColor: 'var(--accent)',
                            borderLeftColor: 'var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite reverse'
                        }}></div>
                        {/* Center glowing dot */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '12px', height: '12px',
                            background: 'var(--primary)',
                            borderRadius: '50%',
                            boxShadow: '0 0 15px 5px var(--glow-primary)',
                            animation: 'pulseGlow 2s infinite'
                        }}></div>
                    </div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Synchronizing Data</h3>
                    <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Connecting to secure backend server...</p>
                </div>
            ) : (
                <div className="grid">
                    {data.length > 0 ? (
                        data.map((item, index) => {
                            // Max delay class is delay-5
                            const delayClass = `delay-${Math.min(index + 1, 5)}`;
                            return (
                                <div key={item.id} className={`card animate-slide-up ${delayClass}`}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {activeTab === 'skills' && item.icon && (
                                                    <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                        <img src={`http://localhost:8080/uploads/${item.icon}`} alt={item.skillName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    </div>
                                                )}
                                                {item.degree || item.skillName || item.role || item.name || 'Untitled'}
                                            </h3>
                                            {item.description && activeTab === 'skills' && (
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                                                    {item.description}
                                                </p>
                                            )}
                                            <p style={{ color: 'var(--primary)', fontWeight: '500', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                {item.institution || item.category || item.company}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEdit(item)} className="btn glass-effect" style={{ padding: '0.6rem', color: 'var(--text-secondary)', borderRadius: '10px' }}>
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="btn glass-effect" style={{ padding: '0.6rem', color: 'var(--danger)', borderRadius: '10px' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        {activeTab === 'education' && (
                                            <>
                                                <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(79, 70, 229, 0.05)', border: '1px solid rgba(79, 70, 229, 0.1)', borderRadius: '12px' }}>
                                                    <p style={{ marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                                        <span style={{ opacity: 0.7, marginRight: '0.5rem' }}>📅</span>
                                                        Year <span style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: '700' }}>{item.graduationYear}</span>
                                                    </p>
                                                    {item.fieldOfStudy && (
                                                        <p style={{ marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                                            <span style={{ opacity: 0.7, marginRight: '0.5rem' }}>📚</span>
                                                            Field of Study <span style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: '700' }}>{item.fieldOfStudy}</span>
                                                        </p>
                                                    )}
                                                    <p style={{ marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                                        <span style={{ opacity: 0.7, marginRight: '0.5rem' }}>🎓</span>
                                                        Grade <span style={{ color: 'var(--accent)', marginLeft: '0.5rem', fontWeight: '700' }}>{item.grade}</span>
                                                    </p>
                                                    {(item.startDate || item.endDate) && (
                                                        <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                                            <span style={{ opacity: 0.7, marginRight: '0.5rem' }}>⏱️</span>
                                                            Duration <span style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: '700' }}>{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'} - {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Present'}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button onClick={() => handleFileUpload(item.id, 'marksCard')} className="btn glass-effect" style={{ fontSize: '0.8rem', flex: 1, padding: '0.75rem' }}>
                                                        <Upload size={16} /> Marks Card
                                                    </button>
                                                    <button onClick={() => handleFileUpload(item.id, 'certificate')} className="btn glass-effect" style={{ fontSize: '0.8rem', flex: 1, padding: '0.75rem' }}>
                                                        <Upload size={16} /> Certificate
                                                    </button>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                                                    {item.marksCards?.length > 0 && (
                                                        <a href={getUploadUrl(item.marksCards[0])} target="_blank" rel="noopener noreferrer" className="btn glass-effect" style={{ fontSize: '0.8rem', flex: 1, padding: '0.75rem', color: 'var(--primary)', textDecoration: 'none', textAlign: 'center' }}>
                                                            View Marks Card
                                                        </a>
                                                    )}
                                                    {item.certificates?.length > 0 && (
                                                        <a href={getUploadUrl(item.certificates[0])} target="_blank" rel="noopener noreferrer" className="btn glass-effect" style={{ fontSize: '0.8rem', flex: 1, padding: '0.75rem', color: 'var(--primary)', textDecoration: 'none', textAlign: 'center' }}>
                                                            View Certificate
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'skills' && (
                                            <>
                                                {item.yearsOfExperience && (
                                                    <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(79, 70, 229, 0.08)', borderRadius: '20px', border: '1px solid rgba(79, 70, 229, 0.2)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                        {item.yearsOfExperience} {item.yearsOfExperience === '1' || item.yearsOfExperience === 1 ? 'Year' : 'Years'} Exp
                                                    </div>
                                                )}
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                        <span style={{ fontWeight: '500' }}>Expertise Level</span>
                                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.proficiencyLevel}%</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${item.proficiencyLevel || 0}%`, height: '100%', background: 'linear-gradient(to right, #4f46e5, #059669)', borderRadius: '5px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                                    <button onClick={() => handleFileUpload(item.id, 'icon')} className="btn glass-effect" style={{ fontSize: '0.8rem', padding: '0.75rem', flex: '1 1 calc(50% - 0.375rem)' }}>
                                                        <Upload size={16} /> Upload Icon
                                                    </button>
                                                    <button onClick={() => handleFileUpload(item.id, 'certificate')} className="btn glass-effect" style={{ fontSize: '0.8rem', padding: '0.75rem', flex: '1 1 calc(50% - 0.375rem)' }}>
                                                        <Upload size={16} /> Upload Certificate
                                                    </button>
                                                    {item.certificates?.length > 0 && (
                                                        <a href={getUploadUrl(item.certificates[0])} target="_blank" rel="noopener noreferrer" className="btn glass-effect" style={{ fontSize: '0.8rem', padding: '0.75rem', color: 'var(--primary)', textDecoration: 'none', flex: '1 1 100%', textAlign: 'center', marginTop: '0.25rem' }}>
                                                            View Certificate
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'experience' && (
                                            <>
                                                <div style={{ display: 'inline-block', padding: '0.35rem 0.85rem', background: 'var(--glass)', borderRadius: '20px', border: '1px solid var(--glass-border)', fontSize: '0.85rem', marginBottom: '1.25rem', color: 'var(--primary)', fontWeight: '600' }}>
                                                    {item.duration}
                                                </div>
                                                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>{item.description}</p>
                                                {item.skillsUsed && item.skillsUsed.length > 0 && (
                                                    <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {item.skillsUsed.map((skill, idx) => (
                                                            <span key={idx} style={{ padding: '0.2rem 0.6rem', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.responsibilities && item.responsibilities.length > 0 && (
                                                    <div style={{ marginTop: '1rem' }}>
                                                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Responsibilities:</h5>
                                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                            {item.responsibilities.map((resp, idx) => (
                                                                <li key={idx} style={{ marginBottom: '0.25rem' }}>{resp}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                                    <button onClick={() => handleFileUpload(item.id, 'certificate')} className="btn glass-effect" style={{ fontSize: '0.8rem', padding: '0.75rem', flex: 1 }}>
                                                        <Upload size={16} /> Upload Certificate
                                                    </button>
                                                    {item.certificates?.length > 0 && (
                                                        <a href={getUploadUrl(item.certificates[0])} target="_blank" rel="noopener noreferrer" className="btn glass-effect" style={{ fontSize: '0.8rem', padding: '0.75rem', color: 'var(--primary)', textDecoration: 'none', flex: 1, textAlign: 'center' }}>
                                                            View Certificate
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'projects' && (
                                            <>
                                                {item.imageUrl && (
                                                    <div className="img-wrapper">
                                                        <img src={getUploadUrl(item.imageUrl)} alt={item.name} />
                                                    </div>
                                                )}
                                                <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.7' }}>{item.description}</p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                                    {item.technologies && item.technologies.map((tech, idx) => (
                                                        <span key={idx} style={{ padding: '0.2rem 0.6rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
                                                    {item.githubUrl && (
                                                        <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                                                            <Code size={18} /> Repo
                                                        </a>
                                                    )}
                                                    {item.liveUrl && (
                                                        <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
                                                            <Folder size={18} /> Demo
                                                        </a>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button onClick={() => handleFileUpload(item.id, 'image')} className="btn glass-effect" style={{ fontSize: '0.8rem', padding: '0.75rem', flex: 1 }}>
                                                        <Upload size={16} /> Upload Image
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="animate-slide-up delay-1" style={{
                            gridColumn: '1/-1',
                            textAlign: 'center',
                            padding: '6rem 2rem',
                            color: 'var(--text-secondary)',
                            background: 'var(--glass)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '24px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                                <Briefcase size={64} style={{ margin: '0 auto' }} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Records Found</h2>
                            <p style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>Ready to showcase your {activeTab}? Start by adding your first record using the button above.</p>
                            <button onClick={handleAdd} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${editingItem ? 'Edit' : 'Add New'} ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            >
                <PortfolioForm
                    type={activeTab}
                    initialData={editingItem}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Dashboard;
