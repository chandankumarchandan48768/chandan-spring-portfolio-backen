import { useState, useEffect } from "react";
import { myEducation as staticEducation } from "../constants";
import EducationItem from "../components/EducationItem";
import EducationDetails from "../components/EducationDetails";
import { GraduationCap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../services/api";

const Education = () => {
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [myEducation, setMyEducation] = useState(staticEducation);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                setLoading(true);
                const data = await api.getEducation();

                const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api$/, '');
                const getUploadUrl = (filename) => {
                    if (!filename) return null;
                    if (filename.startsWith('http')) return filename; // S3 full URL
                    return filename.startsWith('/uploads/') ? `${baseUrl}${filename}` : `${baseUrl}/uploads/${filename}`;
                };

                // Transform API data to match component props
                const transformedData = data.map(edu => {
                    const certUrl = edu.certificates?.length > 0 ? getUploadUrl(edu.certificates[0]) : null;
                    const marksCardUrl = edu.marksCards?.length > 0 ? getUploadUrl(edu.marksCards[0]) : null;

                    const formatYear = dateString => dateString ? new Date(dateString).getFullYear() : '';
                    let dateStr = '';
                    if (edu.startDate || edu.endDate) {
                        const start = formatYear(edu.startDate);
                        const end = formatYear(edu.endDate) || 'Present';
                        dateStr = `${start}${start ? ' - ' : ''}${end}`;
                    } else if (edu.graduationYear) {
                        dateStr = `${edu.graduationYear}`;
                    }

                    const detailsList = [];
                    if (edu.fieldOfStudy) detailsList.push(`Field of Study: ${edu.fieldOfStudy}`);
                    if (edu.grade) detailsList.push(`Grade: ${edu.grade}`);
                    if (edu.graduationYear) detailsList.push(`Graduation Year: ${edu.graduationYear}`);

                    const descList = [];
                    if (edu.fieldOfStudy) descList.push(edu.fieldOfStudy);
                    if (edu.grade) descList.push(`Grade: ${edu.grade}`);

                    return {
                        id: edu.id,
                        title: edu.degree || 'Degree',
                        institution: edu.institution || 'Institution',
                        date: dateStr,
                        description: descList.join(' | '),
                        details: detailsList,
                        tags: edu.fieldOfStudy ? edu.fieldOfStudy.split(',').map((field, index) => ({
                            id: index,
                            name: field.trim()
                        })) : [],
                        image: marksCardUrl || certUrl || null, // Use marks card or cert as preview
                        certificateUrl: certUrl,
                        marksCardUrl: marksCardUrl
                    };
                });

                setMyEducation(transformedData);
            } catch (err) {
                console.error('Failed to fetch education from API, using static data:', err);
                // Keep static data as fallback
            } finally {
                setLoading(false);
            }
        };
        fetchEducation();
    }, []);

    return (
        <section id="education" className="c-space section-spacing py-20 bg-gradient-to-b from-gray-900/50 to-black/50 relative overflow-hidden min-h-screen">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl animate-bounce [animation-delay:2s]" />
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
                    className="text-center mb-20"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 mb-6 hover:scale-105 transition-transform duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <GraduationCap className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm font-medium uppercase tracking-wider text-neutral-300">Academic Journey</span>
                    </motion.div>
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-neutral-200 bg-clip-text text-transparent"
                        initial={{ y: 20 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        My Education
                    </motion.h2>
                    <div className="bg-gradient-to-r from-cyan-500/30 via-neutral-700/50 to-purple-500/30 mt-6 h-[2px] w-24 mx-auto rounded-full" />
                </motion.div>

                {/* Simple Grid Layout */}
                <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-2">
                    {myEducation.map((edu, index) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <EducationItem
                                {...edu}
                                onClick={() => setSelectedEducation(edu)}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Education Details Modal */}
            <AnimatePresence mode="wait">
                {selectedEducation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setSelectedEducation(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <EducationDetails
                                {...selectedEducation}
                                closePanel={() => setSelectedEducation(null)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}

export default Education;
