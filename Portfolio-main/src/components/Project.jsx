import React, { useState } from "react";
import ProjectDetails from "./ProjectDetails";

const Project = ({
  name,
  description,
  technologies,
  githubUrl,
  demoUrl,
  image,
  setPreview,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <>
      <div
        className="flex-wrap items-center justify-between py-10 space-y-14 sm:flex sm:space-y-0"
        onMouseEnter={() => setPreview(image)}
        onMouseLeave={() => setPreview(null)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-3xl font-bold text-white mb-2">{name}</p>
          <p className="text-neutral-400 text-lg mb-4 line-clamp-2 max-w-2xl">{description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies && technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-semibold text-cyan-400 bg-cyan-900/20 border border-cyan-500/20 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsHidden(true)}
          className="flex items-center gap-1 cursor-pointer hover-animation py-2 px-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all"
        >
          Read More
          <img src="assets/arrow-right.svg" className="w-5" />
        </button>
      </div>
      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full" />
      {isHidden && (
        <ProjectDetails
          name={name}
          description={description}
          technologies={technologies}
          image={image}
          githubUrl={githubUrl}
          demoUrl={demoUrl}
          closeModal={() => setIsHidden(false)}
        />
      )}
    </>
  );
};

export default Project;
