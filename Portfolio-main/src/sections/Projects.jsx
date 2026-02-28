import { useState, useEffect } from "react";
import Project from "../components/Project";
import { myProjects } from "../constants";
import { motion, useMotionValue, useSpring } from "motion/react";
import api from "../services/api";

const Projects = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 10, stiffness: 50 });
  const springY = useSpring(y, { damping: 10, stiffness: 50 });
  const handleMouseMove = (e) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };

  const [preview, setPreview] = useState(null);
  const [projects, setProjects] = useState(myProjects); // Fallback to static data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.getProjects();

        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api$/, '');
        const getUploadUrl = (filename) => {
          if (!filename) return null;
          if (filename.startsWith('http')) return filename; // S3 full URL
          return filename.startsWith('/uploads/') ? `${baseUrl}${filename}` : `${baseUrl}/uploads/${filename}`;
        };

        // Add default image if not provided
        const transformedData = data.map(project => ({
          ...project,
          image: getUploadUrl(project.imageUrl) || getUploadUrl(project.image) || "/assets/projects/project-placeholder.jpg",
          demoUrl: project.liveUrl, // map backend liveUrl to frontend demoUrl
          technologies: project.technologies || [] // ensure technologies exists
        }));

        setProjects(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch projects from API, using static data:', err);
        setError(err.message);
        // Keep static data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="work"
      onMouseMove={handleMouseMove}
      className="relative c-space section-spacing"
    >
      <h2 className="text-heading">My Selected Projects</h2>
      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-12 h-[1px] w-full" />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && projects.map((project) => (
        <Project key={project.id} {...project} setPreview={setPreview} />
      ))}

      {preview && (
        <motion.img
          className="fixed top-0 left-0 z-50 object-cover h-56 rounded-lg shadow-lg pointer-events-none w-80"
          src={preview}
          style={{ x: springX, y: springY }}
        />
      )}
    </section>
  );
};

export default Projects;
