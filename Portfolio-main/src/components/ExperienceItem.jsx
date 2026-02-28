import React from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";

const ExperienceItem = ({
    company,
    role,
    location,
    startDate,
    endDate,
    duration,
    currentlyWorking,
    description,
    responsibilities = [],
    skillsUsed = [],
    onClick,
    className = "",
}) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "Present";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div
            onClick={onClick}
            className={`
                group flex flex-col gap-6 p-8 transition-all duration-500 
                border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl 
                hover:border-purple-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/25
                cursor-pointer overflow-hidden relative ${className}
            `}
        >
            {/* Decorative top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-purple-500/80 transform origin-left group-hover:scale-x-110 transition-transform duration-500" />

            {/* Icon + Header */}
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-3 border border-white/20 backdrop-blur-sm group-hover:bg-purple-500/30 transition-all duration-300">
                    <Briefcase className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500 mb-1">
                        {role}
                    </h3>
                    <p className="text-lg font-semibold text-neutral-300 group-hover:text-white/90 transition-colors">
                        {company}
                    </p>
                </div>
            </div>

            {/* Location & Date */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors" />
                    <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">
                        {location}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors" />
                    <span className="text-sm font-medium text-neutral-400 bg-neutral-800/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-neutral-700/50 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all duration-300">
                        {formatDate(startDate)} - {formatDate(endDate)} • {duration}
                    </span>
                </div>
            </div>

            {/* Description */}
            <p className="text-neutral-300 leading-relaxed text-base group-hover:text-neutral-200 transition-colors">
                {description}
            </p>

            {/* Responsibilities */}
            {responsibilities?.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3">Key Responsibilities</h4>
                    <ul className="space-y-2">
                        {responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-2 text-neutral-300">
                                <span className="text-purple-400 mt-1">•</span>
                                <span className="flex-1">{resp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Skills Used */}
            {skillsUsed?.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                    {skillsUsed.map((skill, index) => (
                        <motion.span
                            key={skill.name}
                            className="group/tag relative px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-100 
                                       bg-gradient-to-r from-neutral-800/60 via-neutral-900/80 to-neutral-700/60 
                                       backdrop-blur-xl rounded-xl border border-neutral-600/50 shadow-lg
                                       hover:from-purple-500/20 hover:via-pink-500/20 hover:to-purple-600/20 
                                       hover:border-purple-500/50 hover:text-purple-200 hover:shadow-purple-500/30
                                       hover:scale-105 hover:rotate-1 transition-all duration-400"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                        >
                            {skill.name}
                        </motion.span>
                    ))}
                </div>
            )}

            {/* Hover shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 -rotate-2 scale-150" />
        </div>
    );
};

export default ExperienceItem;
