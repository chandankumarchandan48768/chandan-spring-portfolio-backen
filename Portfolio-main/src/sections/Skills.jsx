import { useState, useEffect } from "react";
import { skills as staticSkills } from "../constants";
import { Code2, Filter } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

const Skills = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [skills, setSkills] = useState(staticSkills);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const data = await api.getSkills();
                const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api$/, '');
                const getUploadUrl = (filename) => {
                    if (!filename) return null;
                    if (filename.startsWith('http')) return filename; // Cloudinary/S3 full URL
                    return filename.startsWith('/uploads/') ? `${baseUrl}${filename}` : `${baseUrl}/uploads/${filename}`;
                };

                const transformedData = data.map(skill => ({
                    ...skill,
                    iconUrl: getUploadUrl(skill.icon)
                }));
                setSkills(transformedData);
            } catch (err) {
                console.error('Failed to fetch skills from API, using static data:', err);
                // Keep static data as fallback
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    // Get unique categories
    const categories = ["All", ...new Set(skills.map(skill => skill.category))];

    // Filter skills by category
    const filteredSkills = selectedCategory === "All"
        ? skills
        : skills.filter(skill => skill.category === selectedCategory);

    return (
        <section id="skills" className="c-space section-spacing py-20 bg-gradient-to-b from-gray-900/50 to-black/50 relative overflow-hidden min-h-screen">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl animate-bounce [animation-delay:2s]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative z-10 container mx-auto px-6"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 mb-6 hover:scale-105 transition-transform duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Code2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium uppercase tracking-wider text-neutral-300">Technical Expertise</span>
                    </motion.div>
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-neutral-200 bg-clip-text text-transparent"
                        initial={{ y: 20 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Skills & Technologies
                    </motion.h2>
                    <div className="bg-gradient-to-r from-emerald-500/30 via-neutral-700/50 to-blue-500/30 mt-6 h-[2px] w-24 mx-auto rounded-full" />
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-3 mb-12 flex-wrap"
                >
                    <Filter className="w-4 h-4 text-neutral-500" />
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`
                px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/50'
                                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'}
              `}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {filteredSkills.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 overflow-hidden"
                        >
                            {/* Top gradient bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 transform origin-left group-hover:scale-x-110 transition-transform duration-500" />

                            {/* Category Badge */}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                                {skill.category}
                            </div>

                            {/* Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl p-4 mb-4 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                <div className="w-full h-full flex items-center justify-center">
                                    {skill.iconUrl ? (
                                        <img src={skill.iconUrl} alt={skill.skillName} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-2xl font-bold text-emerald-400">{skill.skillName.substring(0, 2)}</span>
                                    )}
                                </div>
                            </div>

                            {/* Skill Name */}
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                {skill.skillName}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                                {skill.description}
                            </p>

                            {/* Experience */}
                            <div className="flex items-center gap-2 mb-4 text-xs text-neutral-500">
                                <span className="font-semibold">Experience:</span>
                                <span className="text-neutral-300">{skill.yearsOfExperience}</span>
                            </div>

                            {/* Proficiency Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-500 font-semibold">Proficiency</span>
                                    <span className="text-emerald-400 font-bold">{skill.proficiencyLevel}%</span>
                                </div>
                                <div className="w-full h-2 bg-neutral-800/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.proficiencyLevel}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                                        viewport={{ once: true }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Skills;
