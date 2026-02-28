// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// API Service
export const api = {
    // Projects
    async getProjects() {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    // Education
    async getEducation() {
        const response = await fetch(`${API_BASE_URL}/education`);
        if (!response.ok) throw new Error('Failed to fetch education');
        return response.json();
    },

    // Experience
    async getExperience() {
        const response = await fetch(`${API_BASE_URL}/experience`);
        if (!response.ok) throw new Error('Failed to fetch experience');
        return response.json();
    },

    // Skills
    async getSkills() {
        const response = await fetch(`${API_BASE_URL}/skills`);
        if (!response.ok) throw new Error('Failed to fetch skills');
        return response.json();
    },

    // Resume
    async getResume() {
        const response = await fetch(`${API_BASE_URL}/resume/status`);
        if (!response.ok) throw new Error('Failed to fetch resume status');
        return response.json();
    },

    // Contact
    async submitContact(data) {
        const response = await fetch(`${API_BASE_URL}/contact/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit contact form');
        }
        return response.json();
    }
};

export default api;
