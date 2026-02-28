import { useState, useEffect } from "react";
import { experiences as staticExperiences } from "../constants";
import ExperienceItem from "../components/ExperienceItem";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

const Experiences = () => {
  const [experiences, setExperiences] = useState(staticExperiences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await api.getExperience();

        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api$/, '');

        const getUploadUrl = (filename) => {
          if (!filename) return null;
          if (filename.startsWith('http')) return filename; // Cloudinary/S3 full URL
          return filename.startsWith('/uploads/') ? `${baseUrl}${filename}` : `${baseUrl}/uploads/${filename}`;
        };

        // Transform API data - convert skillsUsed strings to objects
        const transformedData = data.map(exp => {
          const certUrl = exp.certificates?.length > 0 ? getUploadUrl(exp.certificates[0]) : null;

          return {
            ...exp,
            certificateUrl: certUrl,
            skillsUsed: exp.skillsUsed ? exp.skillsUsed.map(skill => ({
              name: skill
            })) : []
          };
        });

        setExperiences(transformedData);
      } catch (err) {
        console.error('Failed to fetch experiences from API, using static data:', err);
        // Keep static data as fallback
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="c-space section-spacing py-20 bg-gradient-to-b from-black/50 to-gray-900/50 relative overflow-hidden min-h-screen">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl animate-bounce [animation-delay:2s]" />
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 mb-6 hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Briefcase className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium uppercase tracking-wider text-neutral-300">Professional Journey</span>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-neutral-200 bg-clip-text text-transparent"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Work Experience
          </motion.h2>
          <div className="bg-gradient-to-r from-purple-500/30 via-neutral-700/50 to-pink-500/30 mt-6 h-[2px] w-24 mx-auto rounded-full" />
        </motion.div>

        {/* Experience Grid */}
        <div className="grid gap-8 max-w-5xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <ExperienceItem
                {...exp}
                onClick={() => exp.certificateUrl && window.open(exp.certificateUrl, '_blank')}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Experiences;
