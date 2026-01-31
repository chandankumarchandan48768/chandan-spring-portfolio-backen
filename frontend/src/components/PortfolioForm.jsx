import React, { useState, useEffect } from 'react';

const PortfolioForm = ({ type, initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {type === 'education' && (
                <>
                    <label>Degree</label>
                    <input name="degree" value={formData.degree || ''} onChange={handleChange} className="input" placeholder="e.g. B.Tech in CSE" required />
                    <label>Institution</label>
                    <input name="institution" value={formData.institution || ''} onChange={handleChange} className="input" placeholder="e.g. SSIT" required />
                    <label>Year</label>
                    <input name="year" value={formData.year || ''} onChange={handleChange} className="input" placeholder="e.g. 2021" />
                    <label>Grade</label>
                    <input name="grade" value={formData.grade || ''} onChange={handleChange} className="input" placeholder="e.g. 8.5 CGPA" />
                </>
            )}

            {type === 'skills' && (
                <>
                    <label>Skill Name</label>
                    <input name="skillName" value={formData.skillName || ''} onChange={handleChange} className="input" placeholder="e.g. React" required />
                    <label>Category</label>
                    <input name="category" value={formData.category || ''} onChange={handleChange} className="input" placeholder="e.g. Frontend" />
                    <label>Proficiency (%)</label>
                    <input name="proficiency" type="number" value={formData.proficiency || ''} onChange={handleChange} className="input" placeholder="0-100" />
                </>
            )}

            {type === 'experience' && (
                <>
                    <label>Role</label>
                    <input name="role" value={formData.role || ''} onChange={handleChange} className="input" placeholder="e.g. Full Stack Developer" required />
                    <label>Company</label>
                    <input name="company" value={formData.company || ''} onChange={handleChange} className="input" placeholder="e.g. Google" required />
                    <label>Duration</label>
                    <input name="duration" value={formData.duration || ''} onChange={handleChange} className="input" placeholder="e.g. Jan 2022 - Present" />
                    <label>Description</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} className="input" rows="4" placeholder="Describe your achievements..." />
                </>
            )}

            {type === 'projects' && (
                <>
                    <label>Project Name</label>
                    <input name="projectName" value={formData.projectName || ''} onChange={handleChange} className="input" placeholder="e.g. Portfolio App" required />
                    <label>Description</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} className="input" rows="4" placeholder="Project overview..." />
                    <label>Github Link</label>
                    <input name="githubLink" value={formData.githubLink || ''} onChange={handleChange} className="input" placeholder="https://github.com/..." />
                    <label>Live Link</label>
                    <input name="liveLink" value={formData.liveLink || ''} onChange={handleChange} className="input" placeholder="https://..." />
                </>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {initialData?.id ? 'Update' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
                <button type="button" onClick={onCancel} className="btn glass-effect" style={{ flex: 1 }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default PortfolioForm;
