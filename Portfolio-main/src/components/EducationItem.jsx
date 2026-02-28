import React from "react";
import { motion } from "framer-motion";
import { Calendar, BookOpen } from "lucide-react";

const EducationItem = ({
    title,
    institution,
    date,
    description,
    tags = [],
    onClick,
    className = "",
}) => {
    return (
        <div
            onClick={onClick}
            className={`
                group flex flex-col gap-6 p-8 transition-all duration-500 
                border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl 
                hover:border-cyan-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/25
                cursor-pointer overflow-hidden relative ${className}
            `}
        >
            {/* Decorative top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/80 via-purple-500/80 to-cyan-500/80 transform origin-left group-hover:scale-x-110 transition-transform duration-500" />

            {/* Icon + Header */}
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl p-3 border border-white/20 backdrop-blur-sm group-hover:bg-cyan-500/30 transition-all duration-300">
                    <BookOpen className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500 mb-1">
                        {title}
                    </h3>
                    <p className="text-lg font-semibold text-neutral-300 group-hover:text-white/90 transition-colors">
                        {institution}
                    </p>
                </div>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-2 self-start">
                <Calendar className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                <span className="text-sm font-medium text-neutral-400 bg-neutral-800/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-neutral-700/50 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
                    {date}
                </span>
            </div>

            {/* Description */}
            <p className="text-neutral-300 leading-relaxed text-base group-hover:text-neutral-200 transition-colors">
                {description}
            </p>

            {/* COMPLETE Enhanced Tags Section */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10 pt-6">
                    {tags.map((tag, index) => (
                        <motion.span
                            key={tag.id || tag.name}
                            className="group/tag relative px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-100 
                                       bg-gradient-to-r from-neutral-800/60 via-neutral-900/80 to-neutral-700/60 
                                       backdrop-blur-xl rounded-xl border border-neutral-600/50 shadow-lg
                                       hover:from-cyan-500/20 hover:via-purple-500/20 hover:to-cyan-600/20 
                                       hover:border-cyan-500/50 hover:text-cyan-200 hover:shadow-cyan-500/30
                                       hover:scale-105 hover:rotate-1 transition-all duration-400 origin-center
                                       before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/0 before:via-cyan-500/20 before:to-cyan-500/0 
                                       before:opacity-0 before:group-hover/tag:opacity-100 before:rounded-xl before:transition-all before:duration-500
                                       before:-skew-x-12 before:scale-150"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                        >
                            {tag.name}
                        </motion.span>
                    ))}
                </div>
            )}

            {/* Hover shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 -rotate-2 scale-150" />
        </div>
    );
};

export default EducationItem;
