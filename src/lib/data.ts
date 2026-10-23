/**
 * Single source of truth for all text on the site.
 * Every value comes from Ramanan_Dhakshanamoorthi_Resume.pdf (incl. its embedded hyperlinks).
 * If something is not in the résumé it is not here.
 */

export const PROFILE = {
  name: "Ramanan Dhakshanamoorthi",
  first: "Ramanan",
  initials: "RD",
  role: "Full Stack Developer",
  email: "ramanan2735@gmail.com",
  phone: "+91 8169034377",
  phoneHref: "tel:+918169034377",
  github: "https://github.com/ramanan-2735",
  githubLabel: "github.com/ramanan-2735",
  linkedin: "https://linkedin.com/in/ramanan-d/",
  linkedinLabel: "linkedin.com/in/ramanan-d",
  resume: "/Ramanan_Dhakshanamoorthi_Resume.pdf",
  resumeSummary:
    "Full Stack Developer with production experience designing, deploying and maintaining React, Next.js, Node.js, Express.js, TypeScript and PostgreSQL applications for Central Railway and 4+ clients. Skilled in REST APIs, RBAC, responsive interfaces, database design, SQL optimization, Docker, Linux, testing, debugging and production support.",
  extraLine:
    "Delivered and maintained production software for 4+ clients across legal, fashion and non-profit sectors.",
  quote:
    "I turn client requirements into maintainable architectures, then own them in production.",
  degree: "B.Tech in Computer Science and Engineering",
  school: "Bharati Vidyapeeth (DU) – Department of Engineering and Technology",
  cgpa: "9.12/10.00",
  gradYear: "2027",
  dept: "Computer Science and Engineering",
  currentRole: "Freelance Full-Stack Developer",
  currentPlace: "Self-Employed",
  paperNo: "202521020607",
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export type ProjectId = "central-railway" | "temple-erp";

export type Skill = { name: string; symbol: string; logo?: string; concept?: string; projects?: ProjectId[] };
export type SkillGroup = { family: string; skills: Skill[] };

const CR: ProjectId = "central-railway";
const TE: ProjectId = "temple-erp";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      { name: "TypeScript", symbol: "Ts", logo: "typescript", projects: [TE] },
      { name: "JavaScript", symbol: "Js", logo: "javascript" },
      { name: "Python", symbol: "Py", logo: "python" },
      { name: "SQL", symbol: "Sq", concept: "database", projects: [CR] },
    ],
  },
  {
    family: "Frontend",
    skills: [
      { name: "React.js", symbol: "Re", logo: "react" },
      { name: "Next.js", symbol: "Nx", logo: "nextjs", projects: [TE] },
      { name: "HTML5", symbol: "H5", logo: "html5", projects: [CR] },
      { name: "CSS3", symbol: "C3", logo: "css3" },
      { name: "Tailwind CSS", symbol: "Tw", logo: "tailwindcss", projects: [CR, TE] },
    ],
  },
  {
    family: "Backend & APIs",
    skills: [
      { name: "Node.js", symbol: "No", logo: "nodejs", projects: [CR] },
      { name: "Express.js", symbol: "Ex", logo: "express", projects: [CR] },
      { name: "REST APIs", symbol: "Rs", concept: "api", projects: [CR] },
      { name: "MVC", symbol: "Mv", concept: "layers" },
    ],
  },
  {
    family: "Databases",
    skills: [
      { name: "PostgreSQL", symbol: "Pg", logo: "postgresql", projects: [CR, TE] },
      { name: "Prisma ORM", symbol: "Pr", logo: "prisma", projects: [TE] },
      { name: "Database Design", symbol: "Dd", concept: "database", projects: [CR] },
      { name: "SQL Optimization", symbol: "So", concept: "gauge", projects: [CR] },
    ],
  },
  {
    family: "Authentication",
    skills: [
      { name: "NextAuth", symbol: "Na", concept: "key", projects: [TE] },
      { name: "Google OAuth", symbol: "Go", logo: "google", projects: [CR] },
      { name: "RBAC", symbol: "Rb", concept: "shield", projects: [CR, TE] },
    ],
  },
  {
    family: "DevOps",
    skills: [
      { name: "Docker", symbol: "Dk", logo: "docker", projects: [CR] },
      { name: "Docker Compose", symbol: "Dc", logo: "docker", projects: [CR, TE] },
      { name: "Linux", symbol: "Lx", logo: "linux", projects: [CR] },
      { name: "Production Deployment", symbol: "Pd", concept: "rocket", projects: [CR] },
    ],
  },
  {
    family: "Tools",
    skills: [
      { name: "Git", symbol: "Gi", logo: "git" },
      { name: "GitHub", symbol: "Gh", logo: "github" },
      { name: "Postman", symbol: "Pm", logo: "postman", projects: [CR] },
      { name: "Render", symbol: "Rn", concept: "cloud", projects: [CR] },
      { name: "Railway", symbol: "Rw", logo: "railway", projects: [CR] },
    ],
  },
  {
    family: "Concepts",
    skills: [
      { name: "Testing", symbol: "Te", concept: "check" },
      { name: "Debugging", symbol: "De", concept: "bug" },
      { name: "System Design", symbol: "Sd", concept: "layers" },
      { name: "Scalability", symbol: "Sc", concept: "scale" },
      { name: "Performance Optimization", symbol: "Po", concept: "gauge" },
    ],
  },
];

export type Project = {
  id: ProjectId;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: { name: string; logo?: string }[];
  github?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "central-railway",
    index: "01",
    title: "Central Railway Patient Management System",
    kicker: "Healthcare platform",
    description:
      "Architected Node.js and Express.js REST APIs with PostgreSQL for appointments, patient records, electronic prescriptions, Google OAuth and role-based access.",
    features: [
      "EJS and Tailwind CSS clinical interfaces",
      "PDF generation",
      "WhatsApp automation",
      "HTML5 Canvas-based X-ray annotation",
      "Optimized PostgreSQL schemas and queries",
      "APIs validated with Postman",
      "Docker and Docker Compose deployment",
      "Linux, Render and Railway environments",
    ],
    tech: [
      { name: "Node.js", logo: "nodejs" },
      { name: "Express.js", logo: "express" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "EJS" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
    ],
  },
  {
    id: "temple-erp",
    index: "02",
    title: "Temple ERP & Digital Donation Management Platform",
    kicker: "Full-stack ERP",
    description:
      "Developed a responsive full-stack ERP using Next.js, TypeScript, Prisma and PostgreSQL for billing, donation management, administrative workflows and reporting dashboards.",
    features: [
      "NextAuth with role-based authentication",
      "Super Admin, Admin and Staff roles",
      "PDF invoices",
      "Thermal receipt printing",
      "Excel export",
      "Docker Compose deployment",
    ],
    tech: [
      { name: "Next.js", logo: "nextjs" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Prisma ORM", logo: "prisma" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: "NextAuth" },
    ],
  },
];

export const CERTIFICATIONS = [
  {
    title: "The Complete Full-Stack Web Development Bootcamp",
    issuer: "Udemy",
    href: "https://www.udemy.com/certificate/UC-a9057ea7-d246-476d-a706-c9f5d8e98a11/",
  },
];

export type TimelineItem = {
  kind: "Experience" | "Education" | "Leadership";
  when: string;
  title: string;
  place: string;
  detail: string[];
};

/** Chronological by start date. */
export const EXPERIENCE: TimelineItem[] = [
  {
    kind: "Experience",
    when: "Aug 2024 – Mar 2025",
    title: "Full-Stack Developer (Team Lead)",
    place: "Central Railway",
    detail: [
      "Led end-to-end delivery and production rollout of a healthcare platform digitizing patient records, prescriptions and appointment workflows.",
      "Owned system architecture, Docker-based deployment, production debugging and maintenance across Linux, Render and Railway environments.",
      "Automated WhatsApp distribution of prescriptions and reports, streamlining communication for healthcare professionals.",
      "Recognized as an inventor in a submitted research paper (Application No. 202521020607).",
    ],
  },
  {
    kind: "Experience",
    when: "Jan 2025 – Present",
    title: "Freelance Full-Stack Developer",
    place: "Self-Employed",
    detail: [
      "Delivered and maintained production software for 4+ clients across legal, fashion and non-profit sectors.",
      "Owned responsive frontend development, backend APIs, database design, testing and deployment.",
      "Maintained deployed systems, resolved production issues and iterated features through direct client communication.",
    ],
  },
  {
    kind: "Leadership",
    when: "Jul 2025 – Jul 2026",
    title: "Chairperson",
    place: "GeeksforGeeks DET Chapter",
    detail: [
      "Led chapter technical workshops and coding initiatives; organized an n8n Automation Workshop, International Student Meet and Women in Science & Technology Day with speakers and faculty.",
    ],
  },
  {
    kind: "Experience",
    when: "Mar 2026",
    title: "Technical Trainer",
    place: "Bharati Vidyapeeth",
    detail: [
      "Delivered hands-on workshops for nursing staff on Microsoft Office tools and AI Copilot, demonstrating practical features and workflows for more effective use.",
    ],
  },
];

export const EDUCATION: TimelineItem[] = [
  {
    kind: "Education",
    when: "Expected 2027",
    title: "B.Tech in Computer Science and Engineering",
    place: "Bharati Vidyapeeth (DU) – Department of Engineering and Technology",
    detail: ["CGPA: 9.12/10.00"],
  },
];

export type Achievement = {
  label: string;
  caption: string;
  detail: string;
  icon: string;
  /** numeric headline that counts up; otherwise `word` is shown */
  count?: { to: number; decimals?: number; prefix?: string; suffix?: string };
  word?: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    label: "Web Designing Competition",
    caption: "Secured 1st Place",
    detail: "Competition win",
    icon: "trophy",
    count: { to: 1, suffix: "st" },
  },
  {
    label: "Central Railway",
    caption: "Letter of Appreciation for leading development of a healthcare platform",
    detail: "Recognition",
    icon: "railway",
    word: "Letter",
  },
  {
    label: "Bharati Vidyapeeth",
    caption: "Official recognition for Microsoft 365 and AI Copilot training",
    detail: "Technical Trainer · Mar 2026",
    icon: "school",
    word: "Recognised",
  },
  {
    label: "Clients served",
    caption: "Production software across legal, fashion and non-profit sectors",
    detail: "Freelance · Jan 2025 – Present",
    icon: "users",
    count: { to: 4, suffix: "+" },
  },
  {
    label: "CGPA",
    caption: "B.Tech in Computer Science and Engineering",
    detail: "Out of 10.00 · Expected 2027",
    icon: "cap",
    count: { to: 9.12, decimals: 2 },
  },
  {
    label: "Research paper",
    caption: "Recognized as an inventor in a submitted research paper",
    detail: "Application No. 202521020607",
    icon: "paper",
    word: "Inventor",
  },
];
