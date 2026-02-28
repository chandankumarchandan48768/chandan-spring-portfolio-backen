import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const ProjectDetails = ({
  name,
  description,
  technologies,
  image,
  githubUrl,
  demoUrl,
  closeModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden backdrop-blur-sm">
      <motion.div
        className="relative max-w-3xl border shadow-sm rounded-2xl bg-gradient-to-b from-[#1a1f3a] to-[#0d1117] border-white/10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          className="absolute p-2 rounded-sm top-5 right-5 bg-midnight hover:bg-gray-500 z-10"
        >
          <img src="assets/close.svg" className="w-6 h-6" />
        </button>

        {/* Header Image */}
        <div className="relative w-full h-72 overflow-hidden rounded-t-2xl bg-gradient-to-br from-cyan-900/40 to-purple-900/40">
          {image ? (
            <img src={image} alt={name} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-6xl">💻</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f3a] via-transparent to-transparent" />
        </div>

        <div className="px-12 py-10 space-y-8">
          {/* Title & Description */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">{name}</h2>
            <p className="text-neutral-300 leading-relaxed text-lg">{description}</p>
          </div>

          {/* Technologies */}
          {technologies && technologies.length > 0 && (
            <div>
              <h4 className="text-sm font-bold tracking-widest text-neutral-500 uppercase mb-4">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm font-semibold text-cyan-300 rounded-full bg-cyan-900/20 border border-cyan-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white font-medium"
              >
                <Github className="w-5 h-5" />
                View Code
              </a>
            )}
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-colors text-white font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
