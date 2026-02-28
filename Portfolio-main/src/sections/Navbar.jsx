import { useState } from "react";
import { motion } from "motion/react";

function Navigation({ onClose }) {
  const navItems = [
    { label: "Home", href: "#home", icon: "fas fa-home" },
    { label: "About", href: "#about", icon: "fas fa-user" },
    { label: "Work", href: "#work", icon: "fas fa-briefcase" },
    { label: "Contact", href: "#contact", icon: "fas fa-envelope" },
    { label: "Education", href: "#education", icon: "fas fa-graduation-cap" },
    { label: "Skills", href: "#skills", icon: "fas fa-bolt" },
  ];

  return (
    <ul className="nav-ul flex gap-3 lg:gap-3 items-center">
      {navItems.map((item, idx) => (
        <li key={idx} className="nav-li">
          <a
            className="inline-flex items-center gap-4 px-5 py-2 rounded-full text-base font-semibold text-white border border-purple-500/50 hover:border-purple-400 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            href={item.href}
            onClick={onClose}
          >
            <i className={`hidden sm:inline text-lg ${item.icon}`}></i>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
      <li className="nav-li">
        <a
          href="https://chandan-portfolio-admin.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="inline-flex items-center gap-4 px-5 py-2 rounded-full text-base font-semibold text-white border border-purple-500/50 hover:border-purple-400 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
        >
          <i className="fas fa-lock text-lg"></i> Admin
        </a>
      </li>
    </ul>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed inset-x-0 z-50 w-full backdrop-blur-xl bg-black/30 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
      <div className="mx-auto c-space max-w-7xl">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <a
            href="/"
            className="text-2xl font-black tracking-tighter transition-colors text-white hover:text-purple-400 flex items-center gap-2 group"
          >
            <img
              src="assets/chandan.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300"
            />
            ChandanDev <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse hidden sm:block"></span>
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden"
          >
            <img
              src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
              className="w-6 h-6"
              alt="toggle"
            />
          </button>
          <nav className="hidden sm:flex">
            <Navigation onClose={() => setIsOpen(false)} />
          </nav>
        </div>
      </div>
      {isOpen && (
        <motion.div
          className="block overflow-y-auto text-center sm:hidden bg-black/90 backdrop-blur-3xl border-t border-white/5 shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxHeight: "calc(100vh - 80px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <nav className="py-8 px-6">
            <Navigation onClose={() => setIsOpen(false)} />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;

