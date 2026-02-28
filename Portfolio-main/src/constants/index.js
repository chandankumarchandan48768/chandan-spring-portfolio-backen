export const myProjects = [
  {
    id: "697db870701080accbb2963b",
    name: "E-Commerce Dashboard",
    description: "Full-stack e-commerce admin panel with real-time analytics, inventory management, and order processing built with Spring Boot, React, and MongoDB.",
    technologies: ["Spring Boot", "React", "MongoDB", "Tailwind CSS", "JWT Auth", "Redis"],
    githubUrl: "https://github.com/chandankumar/ecommerce-dashboard",
    demoUrl: "https://ecommerce-dashboard-chandan.vercel.app",
    createdAt: "2026-01-31",
    image: "/assets/projects/ecommerce.jpg"
  },
  {
    id: "697db8a2701080accbb2963c",
    name: "Real-Time Chat Application",
    description: "Full-stack chat app with WebSocket real-time messaging, user authentication, group chats, and message persistence using Spring Boot WebSocket + React frontend.",
    technologies: ["Spring Boot", "WebSocket", "React", "MongoDB", "Socket.io", "Tailwind CSS"],
    githubUrl: "https://github.com/chandankumar/realtime-chat-app",
    demoUrl: "https://chatapp-chandan.vercel.app",
    createdAt: "2026-01-31",
    image: "/assets/projects/chat-app.jpg"
  },
  {
    id: "project-portfolio-001",
    name: "3D Portfolio Website",
    description: "Modern portfolio website with 3D animations, smooth transitions, and interactive elements built with React, Three.js, and Vite.",
    technologies: ["React", "Three.js", "Vite", "Tailwind CSS", "Framer Motion", "GSAP"],
    githubUrl: "https://github.com/chandankumar/portfolio-3d",
    demoUrl: "https://portfolio-chandan.vercel.app",
    createdAt: "2026-01-15",
    image: "/assets/projects/portfolio.jpg"
  }
];

export const mySocials = [
  {
    name: "WhatsApp",
    href: "https://wa.me/919663101541", // Replace with your country code + number
    icon: "/assets/socials/whatsApp.svg",
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/chandan-kumar-k-n-825912261",
    icon: "/assets/socials/linkedIn.svg",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/chandu20030623/",
    icon: "/assets/socials/instagram.svg",
  },
];

export const experiences = [
  {
    id: "697373dc632bba1f901bf3d1",
    company: "Tap Academy",
    role: "Full Stack Developer Trainee",
    location: "Bangalore, Karnataka",
    startDate: "2024-06-01",
    endDate: "2025-01-15",
    duration: "6 months",
    currentlyWorking: false,
    description: "Production-ready Spring Boot + React applications",
    responsibilities: [
      "Built REST APIs with Spring Boot",
      "Created React frontend",
      "Deployed with Docker"
    ],
    skillsUsed: [
      { name: "Spring Boot", icon: "/assets/logos/java.svg" },
      { name: "React", icon: "/assets/logos/react.svg" },
      { name: "MongoDB", icon: "/assets/logos/mongodb.svg" },
      { name: "Docker", icon: "/assets/logos/docker.svg" }
    ]
  },
  {
    id: "697374b1632bba1f901bf3d2",
    company: "AccuKnox",
    role: "Security Trainee Intern",
    location: "Remote",
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    duration: "3 months",
    currentlyWorking: false,
    description: "Kubernetes security and policy management training",
    responsibilities: [
      "Implemented Kubernetes security policies",
      "Container security vulnerability scanning",
      "Policy-as-code development and testing"
    ],
    skillsUsed: [
      { name: "Kubernetes", icon: "/assets/logos/kubernetes.svg" },
      { name: "Docker", icon: "/assets/logos/docker.svg" },
      { name: "Linux", icon: "/assets/logos/linux.svg" },
      { name: "Security", icon: "/assets/logos/security.svg" }
    ]
  },
  {
    id: "697374c8632bba1f901bf3d3",
    company: "Freelance",
    role: "Full Stack Developer",
    location: "Bangalore, Karnataka",
    startDate: "2025-10-01",
    endDate: null,
    duration: "4 months",
    currentlyWorking: false,
    description: "Personal portfolio and e-commerce project",
    responsibilities: [
      "Developed this exact portfolio API backend",
      "Created responsive React frontend",
      "Deployed with Docker containerization"
    ],
    skillsUsed: [
      { name: "Spring Boot", icon: "/assets/logos/java.svg" },
      { name: "React", icon: "/assets/logos/react.svg" },
      { name: "MongoDB", icon: "/assets/logos/mongodb.svg" },
      { name: "Docker", icon: "/assets/logos/docker.svg" }
    ]
  }
];

export const skills = [
  {
    id: "69732e4ebe9e9ebfdc6db4e2",
    skillName: "MongoDB",
    category: "Database",
    description: "NoSQL document database for scalable applications",
    icon: "mongodb.svg",
    proficiencyLevel: 85,
    yearsOfExperience: "1+ year"
  },
  {
    id: "69733d060bb4169e49383832",
    skillName: "Spring Boot (Expert)",
    category: "Backend",
    description: "Production-ready microservices + React full-stack",
    icon: "spring-boot.svg",
    proficiencyLevel: 98,
    yearsOfExperience: "2+ years"
  },
  {
    id: "skill-react-001",
    skillName: "React",
    category: "Frontend",
    description: "Modern UI development with hooks and state management",
    icon: "react.svg",
    proficiencyLevel: 90,
    yearsOfExperience: "2+ years"
  },
  {
    id: "skill-docker-001",
    skillName: "Docker",
    category: "DevOps",
    description: "Containerization and orchestration",
    icon: "docker.svg",
    proficiencyLevel: 80,
    yearsOfExperience: "1+ year"
  },
  {
    id: "skill-kubernetes-001",
    skillName: "Kubernetes",
    category: "DevOps",
    description: "Container orchestration and deployment",
    icon: "kubernetes.svg",
    proficiencyLevel: 75,
    yearsOfExperience: "1 year"
  },
  {
    id: "skill-java-001",
    skillName: "Java",
    category: "Programming",
    description: "Object-oriented programming and enterprise applications",
    icon: "java.svg",
    proficiencyLevel: 95,
    yearsOfExperience: "2+ years"
  }
];

export const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://robohash.org/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://robohash.org/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://robohash.org/john",
  },
  {
    name: "Alice",
    username: "@alice",
    body: "This is hands down the best thing I've experienced. Highly recommend!",
    img: "https://robohash.org/alice",
  },
  {
    name: "Bob",
    username: "@bob",
    body: "Incredible work! The attention to detail is phenomenal.",
    img: "https://robohash.org/bob",
  },
  {
    name: "Charlie",
    username: "@charlie",
    body: "This exceeded all my expectations. Absolutely stunning!",
    img: "https://robohash.org/charlie",
  },
  {
    name: "Dave",
    username: "@dave",
    body: "Simply breathtaking. The best decision I've made in a while.",
    img: "https://robohash.org/dave",
  },
  {
    name: "Eve",
    username: "@eve",
    body: "So glad I found this. It has changed the game for me.",
    img: "https://robohash.org/eve",
  },
];


export const myEducation = [
  {
    id: 1,
    title: "Bachelor of Science in Computer Science",
    institution: "University of Technology",
    date: "2017 - 2021",
    description: "Graduated with honors, focusing on Software Engineering and Artificial Intelligence.",
    details: [
      "Completed comprehensive coursework in algorithms, data structures, and software design patterns.",
      "Specialized in machine learning and artificial intelligence with focus on neural networks.",
      "Developed multiple full-stack applications as part of senior capstone projects.",
      "Maintained a GPA of 3.8/4.0 and received Dean's List recognition for academic excellence."
    ],
    image: "/assets/projects/education.jpg",
    tags: [
      { id: 1, name: "Algorithms", icon: "/assets/logos/git.svg" },
      { id: 2, name: "Data Structures", icon: "/assets/logos/javascript.svg" },
      { id: 3, name: "Web Dev", icon: "/assets/logos/react.svg" },
      { id: 4, name: "AI/ML", icon: "/assets/logos/python.svg" },
    ],
  },
  {
    id: 2,
    title: "Full Stack Web Development Bootcamp",
    institution: "Tech Academy",
    date: "2021",
    description: "Intensive 12-week program covering MERN stack, advanced JavaScript, and cloud deployment.",
    details: [
      "Built production-ready applications using MongoDB, Express.js, React, and Node.js.",
      "Implemented RESTful APIs with authentication and authorization using JWT.",
      "Deployed applications to cloud platforms including AWS and Heroku with CI/CD pipelines.",
      "Collaborated with teams using Agile methodologies and version control with Git."
    ],
    image: "/assets/projects/bootcamp.jpg",
    tags: [
      { id: 1, name: "MERN", icon: "/assets/logos/mongodb.svg" },
      { id: 2, name: "React", icon: "/assets/logos/react.svg" },
      { id: 3, name: "Node.js", icon: "/assets/logos/nodejs.svg" },
      { id: 4, name: "AWS", icon: "/assets/logos/azure.svg" },
    ],
  },
];

