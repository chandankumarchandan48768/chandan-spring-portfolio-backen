import { motion } from "framer-motion";
import { X } from "lucide-react";

const EducationDetails = ({
    title,
    institution,
    date,
    description,
    details = [],
    image,
    tags,
    certificateUrl,
    marksCardUrl,
    closePanel,
}) => {
    return (
        <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#1a1f3a] to-[#0d1117] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Close Button */}
            <button
                onClick={closePanel}
                className="absolute top-6 right-6 z-10 p-2 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Header Image */}
            <div className="relative w-full h-72 overflow-hidden bg-gradient-to-br from-cyan-900/40 to-purple-900/40">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="text-center space-y-4">
                            <div className="text-6xl">🎓</div>
                            <div className="text-white/50 text-sm uppercase tracking-wider">{institution}</div>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f3a] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="px-12 py-10 space-y-8">
                {/* Title */}
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                        {title}
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        {description}
                    </p>
                </div>

                {/* Details/Bullet Points */}
                {details && details.length > 0 && (
                    <div className="space-y-3">
                        {details.map((detail, index) => (
                            <p key={index} className="text-neutral-300 leading-relaxed">
                                {detail}
                            </p>
                        ))}
                    </div>
                )}

                {/* Tags/Technologies */}
                {tags && tags.length > 0 && (
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            {tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                                    title={tag.name}
                                >
                                    {tag.icon ? (
                                        <img src={tag.icon} alt={tag.name} className="w-8 h-8" />
                                    ) : (
                                        <span className="text-xs font-bold text-cyan-400">{tag.name?.substring(0, 2)}</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Optional Action Button */}
                        <div className="flex gap-4">
                            {certificateUrl && (
                                <a href={certificateUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-sm flex items-center gap-2">
                                    <span className="uppercase tracking-wider font-medium">View Certificate</span>
                                    <svg className="w-4 h-4" transform="rotate(-45)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}
                            {marksCardUrl && (
                                <a href={marksCardUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-sm flex items-center gap-2">
                                    <span className="uppercase tracking-wider font-medium">View Marks Card</span>
                                    <svg className="w-4 h-4" transform="rotate(-45)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationDetails;
