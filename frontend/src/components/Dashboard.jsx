import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, BookOpen, Briefcase, Code, Folder } from 'lucide-react';
import { educationService, skillsService, experienceService, projectService } from '../services/api';
import Modal from './Modal';
import PortfolioForm from './PortfolioForm';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('education');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const tabs = [
        { id: 'education', label: 'Education', icon: BookOpen },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: Folder },
    ];

    const getService = () => {
        if (activeTab === 'education') return educationService;
        if (activeTab === 'skills') return skillsService;
        if (activeTab === 'experience') return experienceService;
        if (activeTab === 'projects') return projectService;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const service = getService();
            const response = await service.getAll();
            setData(response.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

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
            if (editingItem && editingItem.id) {
                await service.update(editingItem.id, formData);
            } else {
                await service.create(formData);
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
                    if (type === 'marksCard') {
                        await educationService.uploadMarksCard(id, file);
                    } else {
                        await educationService.uploadCertificate(id, file);
                    }
                    alert('File uploaded successfully!');
                    fetchData();
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        };
        input.click();
    };

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <header className="section-header" style={{ marginBottom: '3rem' }}>
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
                <button onClick={handleAdd} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
                    <Plus size={20} />
                    Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </button>
            </header>

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
                            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'glass-effect'}`}
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
                <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--text-secondary)' }}>
                    <div className="loader" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid var(--glass-border)',
                        borderTop: '3px solid var(--primary)',
                        borderRadius: '50%',
                        margin: '0 auto 1.5rem',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ fontSize: '1.1rem' }}>Synchronizing with database...</p>
                </div>
            ) : (
                <div className="grid">
                    {data.length > 0 ? (
                        data.map((item) => (
                            <div key={item.id} className="card glass-effect" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                                            {item.degree || item.skillName || item.role || item.projectName || 'Untitled'}
                                        </h3>
                                        <p style={{ color: 'var(--primary)', fontWeight: '500', fontSize: '0.95rem' }}>
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
                                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-dark)', borderRadius: '10px' }}>
                                                <p style={{ marginBottom: '0.5rem' }}>📅 <strong>Year:</strong> {item.year}</p>
                                                <p>🎓 <strong>Grade:</strong> {item.grade}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button onClick={() => handleFileUpload(item.id, 'marksCard')} className="btn glass-effect" style={{ fontSize: '0.8rem', flex: 1, padding: '0.75rem' }}>
                                                    <Upload size={16} /> Marks Card
                                                </button>
                                                <button onClick={() => handleFileUpload(item.id, 'certificate')} className="btn glass-effect" style={{ fontSize: '0.8rem', flex: 1, padding: '0.75rem' }}>
                                                    <Upload size={16} /> Certificate
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'skills' && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <span style={{ fontWeight: '500' }}>Expertise Level</span>
                                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.proficiency}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '10px', background: 'var(--bg-dark)', borderRadius: '5px', overflow: 'hidden' }}>
                                                <div style={{ width: `${item.proficiency}%`, height: '100%', background: 'linear-gradient(to right, #6366f1, #10b981)', borderRadius: '5px' }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'experience' && (
                                        <>
                                            <div style={{ display: 'inline-block', padding: '0.35rem 0.85rem', background: 'var(--glass)', borderRadius: '20px', border: '1px solid var(--glass-border)', fontSize: '0.85rem', marginBottom: '1.25rem', color: 'var(--primary)', fontWeight: '600' }}>
                                                {item.duration}
                                            </div>
                                            <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>{item.description}</p>
                                        </>
                                    )}

                                    {activeTab === 'projects' && (
                                        <>
                                            <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.7' }}>{item.description}</p>
                                            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
                                                {item.githubLink && (
                                                    <a href={item.githubLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                                                        <Code size={18} /> Repo
                                                    </a>
                                                )}
                                                {item.liveLink && (
                                                    <a href={item.liveLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
                                                        <Folder size={18} /> Demo
                                                    </a>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            gridColumn: '1/-1',
                            textAlign: 'center',
                            padding: '8rem 2rem',
                            color: 'var(--text-secondary)',
                            background: 'rgba(30, 41, 59, 0.4)',
                            borderRadius: '32px',
                            border: '2px dashed var(--glass-border)'
                        }}>
                            <div style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                                <Briefcase size={64} style={{ margin: '0 auto' }} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>No Records Found</h2>
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
