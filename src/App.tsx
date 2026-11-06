import React, { useState, useEffect, useRef, useMemo } from "react";
import JSZip from "jszip";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Search,
  FileText,
  HelpCircle,
  TrendingUp,
  Settings,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  UploadCloud,
  Layers,
  ArrowRight,
  Globe,
  DollarSign,
  Clipboard,
  Award,
  BookOpen,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  RotateCcw,
  Link2,
  File,
  Star,
  Filter,
  Sun,
  Moon,
  History,
  Save,
  FolderOpen,
  Clock,
  X,
  ChevronDown,
  Check,
  MessageSquare
} from "lucide-react";
import { CVPreview } from "./components/CVPreview";
import {
  CandidateCVState,
  Experience,
  Education,
  Project,
  Certification,
  LanguageItem,
  JobAnalysisResult,
  InterviewQuestion,
  RecruiterCandidate,
  RecruiterRankingResult,
  SavedRecruiterReport,
  SupportedLanguage,
  SUPPORTED_LANGUAGES
} from "./types";

import { TRANSLATIONS, getTranslation } from "./translations";

// ─── SMART SKILLS DICTIONARY & SUGGESTION ENGINE ───
const skillDictionary: Record<string, { fr: string[]; en: string[] }> = {
  developer: {
    fr: ["React", "TypeScript", "Node.js", "JavaScript", "HTML5", "CSS3", "Git", "APIs REST", "SQL", "NoSQL", "Tailwind CSS", "Docker", "CI/CD", "Next.js", "Redux", "PostgreSQL", "MongoDB", "Méthodologie Agile", "Scrum", "Jest"],
    en: ["React", "TypeScript", "Node.js", "JavaScript", "HTML5", "CSS3", "Git", "REST APIs", "SQL", "NoSQL", "Tailwind CSS", "Docker", "CI/CD", "Next.js", "Redux", "PostgreSQL", "MongoDB", "Agile Methodology", "Scrum", "Jest"]
  },
  frontend: {
    fr: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Next.js", "Vue.js", "Angular", "Sass", "Webpack", "Vite", "Responsive Design", "UI/UX", "Jest", "Cypress"],
    en: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Next.js", "Vue.js", "Angular", "Sass", "Webpack", "Vite", "Responsive Design", "UI/UX", "Jest", "Cypress"]
  },
  backend: {
    fr: ["Node.js", "Express", "Python", "Django", "FastAPI", "SQL", "PostgreSQL", "NoSQL", "MongoDB", "Docker", "Kubernetes", "APIs REST", "GraphQL", "Java", "Spring Boot", "Go", "C#", "Redis", "Microservices"],
    en: ["Node.js", "Express", "Python", "Django", "FastAPI", "SQL", "PostgreSQL", "NoSQL", "MongoDB", "Docker", "Kubernetes", "REST APIs", "GraphQL", "Java", "Spring Boot", "Go", "C#", "Redis", "Microservices"]
  },
  fullstack: {
    fr: ["React", "Node.js", "TypeScript", "JavaScript", "SQL", "NoSQL", "PostgreSQL", "MongoDB", "APIs REST", "GraphQL", "Git", "Docker", "Next.js", "Tailwind CSS", "Express", "CI/CD", "AWS"],
    en: ["React", "Node.js", "TypeScript", "JavaScript", "SQL", "NoSQL", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Git", "Docker", "Next.js", "Tailwind CSS", "Express", "CI/CD", "AWS"]
  },
  data: {
    fr: ["Python", "SQL", "Machine Learning", "Deep Learning", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Tableau", "Power BI", "Data Visualization", "ETL", "Spark", "BigQuery", "AWS", "Statistiques"],
    en: ["Python", "SQL", "Machine Learning", "Deep Learning", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Tableau", "Power BI", "Data Visualization", "ETL", "Spark", "BigQuery", "AWS", "Statistics"]
  },
  devops: {
    fr: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "GitLab CI", "GitHub Actions", "Ansible", "Linux", "Bash", "GCP", "Azure", "Prometheus", "Grafana", "Sécurité Cloud", "Python"],
    en: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "GitLab CI", "GitHub Actions", "Ansible", "Linux", "Bash", "GCP", "Azure", "Prometheus", "Grafana", "Cloud Security", "Python"]
  },
  project: {
    fr: ["Gestion de projet", "Méthodes Agiles", "Scrum", "Kanban", "Jira", "Confluence", "Planification", "Communication", "Management d'équipe", "Gestion du budget", "Gestion des risques", "KPIs"],
    en: ["Project Management", "Agile Methods", "Scrum", "Kanban", "Jira", "Confluence", "Project Planning", "Communication", "Team Management", "Budgeting", "Risk Management", "KPIs"]
  },
  product: {
    fr: ["Product Management", "Méthodes Agiles", "Scrum", "Roadmap Produit", "User Stories", "Figma", "Jira", "Analytics", "Tests A/B", "Recherche utilisateur", "Lancement de produit", "KPIs"],
    en: ["Product Management", "Agile Methods", "Scrum", "Product Roadmap", "User Stories", "Figma", "Jira", "Product Analytics", "A/B Testing", "User Research", "Product Launch", "KPIs"]
  },
  marketing: {
    fr: ["SEO", "Google Analytics", "Marketing Digital", "Growth Hacking", "CRM (HubSpot)", "Rédaction Web", "Stratégie de contenu", "Réseaux Sociaux", "Google Ads", "Email Marketing", "Copywriting"],
    en: ["SEO", "Google Analytics", "Digital Marketing", "Growth Hacking", "CRM (HubSpot)", "Copywriting", "Content Strategy", "Social Media", "Google Ads", "Email Marketing", "Copywriting"]
  },
  design: {
    fr: ["Figma", "Design UI", "Design UX", "Prototypage", "Maquettage", "Adobe Illustrator", "Adobe Photoshop", "Recherche Utilisateur", "Design Systems", "Responsive Design", "Design Graphique", "Wireframing"],
    en: ["Figma", "UI Design", "UX Design", "Prototyping", "Wireframing", "Adobe Illustrator", "Adobe Photoshop", "User Research", "Design Systems", "Responsive Design", "Graphic Design", "Wireframing"]
  },
  rh: {
    fr: ["Recrutement", "Gestion des talents", "Sourcing", "Onboarding", "Entretiens", "Droit du travail", "SIRH", "Marque Employeur", "Relations sociales", "Formation", "Gestion des conflits"],
    en: ["Recruitment", "Talent Management", "Sourcing", "Onboarding", "Interviewing", "Labor Law", "HRIS", "Employer Branding", "Employee Relations", "Training", "Conflict Resolution"]
  },
  finance: {
    fr: ["Analyse financière", "Modélisation financière", "Excel avancé", "Comptabilité", "Budgétisation", "Reporting", "Gestion de trésorerie", "Fiscalité", "Contrôle de gestion", "SAP", "Audit"],
    en: ["Financial Analysis", "Financial Modeling", "Advanced Excel", "Accounting", "Budgeting", "Reporting", "Cash Flow Management", "Taxation", "Management Controlling", "SAP", "Auditing"]
  },
  sales: {
    fr: ["Négociation", "Prospection commerciale", "Gestion de compte", "CRM (Salesforce)", "Stratégie commerciale", "Closing", "B2B", "B2C", "Lead Generation", "Reporting commercial", "Pitch"],
    en: ["Negotiation", "Lead Generation", "Account Management", "CRM (Salesforce)", "Sales Strategy", "Closing", "B2B", "B2C", "Business Development", "Sales Reporting", "Pitching"]
  }
};

const defaultSkills = {
  fr: ["Git", "SQL", "JavaScript", "Gestion de projet", "Méthodologie Agile", "Communication", "Résolution de problèmes", "Travail d'équipe", "Suite Office", "HTML5", "CSS3"],
  en: ["Git", "SQL", "JavaScript", "Project Management", "Agile Methodology", "Communication", "Problem Solving", "Teamwork", "Microsoft Office", "HTML5", "CSS3"]
};

const jobCategoryMappings = [
  { keywords: ["developpeur", "développeur", "developer", "software", "ingénieur", "ingenieur", "architect", "cod", "programm"], category: "developer" },
  { keywords: ["front"], category: "frontend" },
  { keywords: ["back"], category: "backend" },
  { keywords: ["fullstack", "full stack", "full-stack"], category: "fullstack" },
  { keywords: ["data", "ml", "machine learning", "ia", "ai", "scientist", "analyst", "intelligence d'affaires", "bi"], category: "data" },
  { keywords: ["devops", "cloud", "aws", "azure", "gcp", "docker", "kubernetes", "infra", "sysadmin", "system", "système"], category: "devops" },
  { keywords: ["projet", "project", "scrum", "agile", "chef de"], category: "project" },
  { keywords: ["product", "produit", "po", "pm", "owner"], category: "product" },
  { keywords: ["marketing", "growth", "seo", "communication", "pub", "ads"], category: "marketing" },
  { keywords: ["design", "ux", "ui", "figma", "graph"], category: "design" },
  { keywords: ["rh", "hr", "recrut", "talent", "ressources humaines", "human resources"], category: "rh" },
  { keywords: ["financ", "compta", "audit", "budget", "comptable", "gestion"], category: "finance" },
  { keywords: ["sales", "vent", "commerci", "bizdev", "business dev"], category: "sales" }
];

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function App() {
  const [lang, setLang] = useState<SupportedLanguage>("fr");
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [showTranslateCvModal, setShowTranslateCvModal] = useState<boolean>(false);
  const [showHrNotesExportMenu, setShowHrNotesExportMenu] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (e) {
      console.error(e);
    }
    return "light";
  });

  useEffect(() => {
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const [activeTab, setActiveTab] = useState<string>("editor");
  const [template, setTemplate] = useState<"classic" | "modern" | "creative" | "executive">("classic");
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [notif, setNotif] = useState<string>("");
  const [isTranslatingCV, setIsTranslatingCV] = useState<boolean>(false);

  // ─── STATE CV ───
  const [cvState, setCvState] = useState<CandidateCVState>({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    skills: [],
    experiences: [],
    educations: [],
    projects: [],
    certifications: [],
    languages: [],
    references: "",
    showReferences: false
  });

  // UI inputs
  const [skillIn, setSkillIn] = useState<string>("");

  // ─── SKILL SUGGESTIONS COMPUTE ───
  const suggestedSkills = useMemo(() => {
    // 1. Get matched categories based on cvState.jobTitle
    const normalizedJobTitle = normalizeText(cvState.jobTitle || "");
    const matchedCategories: string[] = [];
    
    if (normalizedJobTitle) {
      jobCategoryMappings.forEach(mapping => {
        const matches = mapping.keywords.some(keyword => 
          normalizedJobTitle.includes(normalizeText(keyword))
        );
        if (matches) {
          matchedCategories.push(mapping.category);
        }
      });
    }

    // 2. Accumulate skills from matched categories
    let pool: string[] = [];
    matchedCategories.forEach(category => {
      const catSkills = (skillDictionary[category] as any)?.[lang] || skillDictionary[category]?.en || skillDictionary[category]?.fr || [];
      catSkills.forEach((s: string) => {
        if (!pool.includes(s)) pool.push(s);
      });
    });

    // 3. Add default general skills to make it comprehensive
    const defaults = (defaultSkills as any)[lang] || defaultSkills.en || defaultSkills.fr || [];
    defaults.forEach((s: string) => {
      if (!pool.includes(s)) pool.push(s);
    });

    // 4. Exclude skills already present in candidate's CV
    const existingNormalized = cvState.skills.map(s => normalizeText(s));
    pool = pool.filter(s => !existingNormalized.includes(normalizeText(s)));

    // 5. Filter by current input typing chunk (if user is typing)
    const chunks = skillIn.split(",");
    const lastChunk = chunks[chunks.length - 1].trim();
    if (lastChunk) {
      const normalizedChunk = normalizeText(lastChunk);
      pool = pool.filter(s => normalizeText(s).includes(normalizedChunk));
    }

    // Limit to 8 top suggestions to keep the UI elegant and un-cluttered
    return pool.slice(0, 8);
  }, [cvState.jobTitle, cvState.skills, skillIn, lang]);

  const handleSelectSuggestion = (suggestion: string) => {
    const updated = [...cvState.skills];
    
    // If there were other comma-separated skills in input, add them first
    const chunks = skillIn.split(",");
    if (chunks.length > 1) {
      chunks.slice(0, -1).forEach(chunk => {
        const val = chunk.trim();
        if (val && !updated.includes(val)) {
          updated.push(val);
        }
      });
    }
    
    if (!updated.includes(suggestion)) {
      updated.push(suggestion);
    }
    saveCVState({ ...cvState, skills: updated });
    setSkillIn(""); // Clear the input field
    showNotification(lang === "fr" ? `Compétence "${suggestion}" ajoutée !` : `Skill "${suggestion}" added!`);
  };

  // ─── JOB MATCH ANALYZER STATE ───
  const [jobDescText, setJobDescText] = useState<string>("");
  const [isAnalyzingJob, setIsAnalyzingJob] = useState<boolean>(false);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysisResult | null>(null);
  const [jobDescUrl, setJobDescUrl] = useState<string>("");
  const [isScrapingJob, setIsScrapingJob] = useState<boolean>(false);

  // ─── COVER LETTER STATE ───
  const [coverCompany, setCoverCompany] = useState<string>("");
  const [coverRole, setCoverRole] = useState<string>("");
  const [coverWhy, setCoverWhy] = useState<string>("");
  const [coverTone, setCoverTone] = useState<"professional" | "dynamic" | "creative" | "concise">("professional");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isGeneratingCover, setIsGeneratingCover] = useState<boolean>(false);

  // ─── INTERVIEW STATE ───
  const [interviewRole, setInterviewRole] = useState<string>("");
  const [interviewQs, setInterviewQs] = useState<InterviewQuestion[]>([]);
  const [isGeneratingInterview, setIsGeneratingInterview] = useState<boolean>(false);

  // ─── SALARY STATE ───
  const [salaryRole, setSalaryRole] = useState<string>("");
  const [salaryExp, setSalaryExp] = useState<number>(0);
  const [salaryCity, setSalaryCity] = useState<string>("paris");
  const [salarySector, setSalarySector] = useState<string>("tech");

  // ─── RECRUITER STATE ───
  const [recruiterJobDesc, setRecruiterJobDesc] = useState<string>("");
  const [recruiterJobFile, setRecruiterJobFile] = useState<{ name: string; size: number; charCount: number; isUrl?: boolean } | null>(null);
  const [isUploadingRecruiterJob, setIsUploadingRecruiterJob] = useState<boolean>(false);
  const [recruiterJobUrlInput, setRecruiterJobUrlInput] = useState<string>("");
  const [isScrapingRecruiterJobUrl, setIsScrapingRecruiterJobUrl] = useState<boolean>(false);
  const [showRecruiterJobPreview, setShowRecruiterJobPreview] = useState<boolean>(false);
  const [isDraggingJobFile, setIsDraggingJobFile] = useState<boolean>(false);
  const [expandedCandDocs, setExpandedCandDocs] = useState<{ [candId: string]: "cv" | "cover" | "other" | "unique" | null }>({});
  const [recruiterCandidates, setRecruiterCandidates] = useState<RecruiterCandidate[]>([]);
  const [isRecruiterAnalyzing, setIsRecruiterAnalyzing] = useState<boolean>(false);
  const [analyzingCandId, setAnalyzingCandId] = useState<string | null>(null);
  const [recruiterResults, setRecruiterResults] = useState<RecruiterRankingResult | null>(null);
  const [recruiterShowFavoritesOnly, setRecruiterShowFavoritesOnly] = useState<boolean>(false);
  const [recruiterMinScoreFilter, setRecruiterMinScoreFilter] = useState<number>(0);
  const [savedRecruiterReports, setSavedRecruiterReports] = useState<SavedRecruiterReport[]>(() => {
    try {
      const raw = localStorage.getItem("recruiter_saved_reports_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse saved recruiter reports:", e);
    }
    return [];
  });
  const [showSavedReportsModal, setShowSavedReportsModal] = useState<boolean>(false);
  const [savedReportSearchQuery, setSavedReportSearchQuery] = useState<string>("");

  // ─── SHARE LINK STATE & HELPERS ───
  const [isSharedView, setIsSharedView] = useState<boolean>(false);

  const encodeCV = (state: CandidateCVState) => {
    try {
      const jsonStr = JSON.stringify(state);
      const utf8Bytes = new TextEncoder().encode(jsonStr);
      let binary = "";
      const len = utf8Bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      return btoa(binary);
    } catch (e) {
      console.error(e);
      return "";
    }
  };

  const decodeCV = (base64: string): CandidateCVState | null => {
    try {
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(bytes);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const generateShareLink = () => {
    try {
      const base64 = encodeCV(cvState);
      const shareUrl = `${window.location.origin}${window.location.pathname}#/view/${base64}`;
      navigator.clipboard.writeText(shareUrl);
      showNotification(
        lang === "fr"
          ? "Lien de partage unique copié dans le presse-papiers !"
          : "Unique share link copied to clipboard!"
      );
    } catch (e) {
      console.error(e);
      showNotification(
        lang === "fr"
          ? "Erreur lors de la génération du lien."
          : "Error generating the share link."
      );
    }
  };

  const exitSharedView = () => {
    setIsSharedView(false);
    window.location.hash = "";
    try {
      const savedNew = localStorage.getItem(`resumeai_data_v2_${lang}`);
      if (savedNew) {
        setCvState(JSON.parse(savedNew));
      } else {
        setCvState(lang === "fr" ? INITIAL_FR_CV : INITIAL_EN_CV);
      }
    } catch (e) {
      console.error(e);
    }
    showNotification(
      lang === "fr"
        ? "Retour au mode édition de votre CV"
        : "Returned to editing mode"
    );
  };

  const importSharedCandidateToRecruiter = () => {
    const experienceText = cvState.experiences.map(e => `${e.role} chez ${e.company} (${e.start} - ${e.end})\n${e.bullets}`).join("\n\n");
    const educationText = cvState.educations.map(e => `${e.degree} à ${e.school} (${e.year})`).join("\n");
    const cvText = `
NOM: ${cvState.name}
POSTE VISÉ: ${cvState.jobTitle}
EMAIL: ${cvState.email}
TELEPHONE: ${cvState.phone}
LINKEDIN: ${cvState.linkedin}

RÉSUMÉ:
${cvState.summary}

COMPÉTENCES:
${cvState.skills.join(", ")}

EXPÉRIENCE:
${experienceText}

FORMATION:
${educationText}
    `;

    const newCand: RecruiterCandidate = {
      id: `rcand-${Date.now()}`,
      name: cvState.name || "Candidat Partagé",
      cvText: cvText.trim(),
      coverText: "",
      otherText: "",
      filesLoaded: { cv: true, cover: false, other: false }
    };
    setRecruiterCandidates(prev => [...prev, newCand]);
    showNotification(
      lang === "fr"
        ? `${cvState.name} a été importé dans votre Espace Recruteur !`
        : `${cvState.name} has been imported into your Recruiter Space!`
    );
    setActiveTab("recruiter");
  };

  const t = getTranslation(lang);

  // Pre-defined defaults for French and English CVs
  const INITIAL_FR_CV: CandidateCVState = {
    name: "Sophie Martin",
    jobTitle: "Développeuse Full-Stack React / Node",
    email: "sophie.martin@example.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    linkedin: "linkedin.com/in/sophiemartin",
    summary: "Développeuse Full-Stack d'applications web avec 3 ans d'expérience. Spécialisée en React, TypeScript et Node.js. Passionnée par la conception d'architectures scalables, la performance web et l'optimisation de l'expérience utilisateur.",
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL", "Git"],
    experiences: [
      {
        id: "exp1",
        role: "Développeuse Web Full-Stack",
        company: "TechCorp SAS",
        start: "Janv 2022",
        end: "Présent",
        bullets: "• Conçu et développé l'interface principale d'une plateforme SaaS avec React et TypeScript\n• Optimisé les requêtes de base de données, réduisant le temps de chargement de 35%\n• Collaboré au déploiement de pipelines de CI/CD automatisés sur AWS"
      }
    ],
    educations: [
      {
        id: "edu1",
        degree: "Master en Ingénierie Informatique",
        school: "Sorbonne Université",
        year: "2019 - 2021",
        grade: "Mention Très Bien"
      }
    ],
    projects: [
      {
        id: "proj1",
        name: "EcoTrack",
        url: "github.com/sophie/ecotrack",
        desc: "Application d'analyse d'empreinte carbone personnelle en temps réel avec graphiques interactifs en D3.js."
      }
    ],
    certifications: [
      {
        id: "cert1",
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        year: "2023"
      }
    ],
    languages: [
      { id: "lang1", name: "Français", level: "Langue maternelle" },
      { id: "lang2", name: "Anglais", level: "Bilingue (C1/C2)" }
    ],
    references: "Référence sur demande",
    showReferences: true
  };

  const INITIAL_EN_CV: CandidateCVState = {
    name: "Sophie Martin",
    jobTitle: "Full-Stack React / Node Developer",
    email: "sophie.martin@example.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    linkedin: "linkedin.com/in/sophiemartin",
    summary: "Full-Stack developer with 3 years of experience. Specialized in React, TypeScript, and Node.js. Passionate about designing scalable architectures, web performance, and user experience optimization.",
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL", "Git"],
    experiences: [
      {
        id: "exp1",
        role: "Full-Stack Web Developer",
        company: "TechCorp SAS",
        start: "Jan 2022",
        end: "Present",
        bullets: "• Designed and developed the main interface of a SaaS platform using React and TypeScript\n• Optimized database queries, reducing load times by 35%\n• Collaborated on deploying automated CI/CD pipelines on AWS"
      }
    ],
    educations: [
      {
        id: "edu1",
        degree: "Master of Science in Computer Science",
        school: "Sorbonne University",
        year: "2019 - 2021",
        grade: "Summa Cum Laude"
      }
    ],
    projects: [
      {
        id: "proj1",
        name: "EcoTrack",
        url: "github.com/sophie/ecotrack",
        desc: "Real-time personal carbon footprint tracker application with interactive charts built in D3.js."
      }
    ],
    certifications: [
      {
        id: "cert1",
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        year: "2023"
      }
    ],
    languages: [
      { id: "lang1", name: "French", level: "Native speaker" },
      { id: "lang2", name: "English", level: "Bilingual (C1/C2)" }
    ],
    references: "References available upon request",
    showReferences: true
  };

  const prevLangRef = useRef<SupportedLanguage>("fr");

  // RTL support for Arabic and right-to-left languages
  useEffect(() => {
    const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    if (currentLangObj?.dir === "rtl") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [lang]);

  // Load from LocalStorage and handle HashRouter share link
  useEffect(() => {
    const handleHashAndData = () => {
      try {
        const hash = window.location.hash;
        if (hash && (hash.startsWith("#/view/") || hash.startsWith("#/share/"))) {
          const parts = hash.split("/");
          const base64Data = parts[parts.length - 1];
          if (base64Data) {
            const decoded = decodeCV(base64Data);
            if (decoded) {
              setCvState(decoded);
              setIsSharedView(true);
              setActiveTab("editor");
              return;
            } else {
              showNotification(lang === "fr" ? "Impossible de décoder le lien de partage." : "Unable to decode share link.");
            }
          }
        }

        // Standard load if no hash or hash decode fails
        const activeLang = lang;
        const savedNew = localStorage.getItem(`resumeai_data_v2_${activeLang}`);
        const savedFr = localStorage.getItem("resumeai_data_v2_fr") || localStorage.getItem("resumeai_data_v2");
        
        if (savedNew) {
          setCvState(JSON.parse(savedNew));
        } else if (activeLang === "fr" && savedFr) {
          setCvState(JSON.parse(savedFr));
        } else {
          setCvState(activeLang === "fr" ? INITIAL_FR_CV : INITIAL_EN_CV);
        }
        setIsSharedView(false);
        prevLangRef.current = activeLang;
      } catch (e) {
        console.error(e);
      }
    };

    handleHashAndData();

    // Listen to hash change for live routing (HashRouter simulation)
    const onHashChange = () => {
      handleHashAndData();
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []); // Run once on mount

  // Sync state when language changes
  useEffect(() => {
    const prevLang = prevLangRef.current;
    if (prevLang !== lang) {
      // Save old language state
      localStorage.setItem(`resumeai_data_v2_${prevLang}`, JSON.stringify(cvState));
      if (prevLang === "fr") {
        localStorage.setItem("resumeai_data_v2", JSON.stringify(cvState));
      }

      // Load new language state
      const savedNew = localStorage.getItem(`resumeai_data_v2_${lang}`);
      if (savedNew) {
        setCvState(JSON.parse(savedNew));
      } else {
        setCvState(lang === "fr" ? INITIAL_FR_CV : INITIAL_EN_CV);
      }
      prevLangRef.current = lang;
    }
  }, [lang]);

  // Save to LocalStorage
  const saveCVState = (newState: CandidateCVState) => {
    setCvState(newState);
    localStorage.setItem(`resumeai_data_v2_${lang}`, JSON.stringify(newState));
    if (lang === "fr") {
      localStorage.setItem("resumeai_data_v2", JSON.stringify(newState));
    }
  };

  const translateEntireCV = async (targetLangCode?: SupportedLanguage) => {
    const targetLanguage = targetLangCode || (lang === "fr" ? "en" : "fr");
    const targetObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage) || SUPPORTED_LANGUAGES[0];
    showNotification(
      lang === "fr" 
        ? `Traduction complète du CV en ${targetObj.name}...` 
        : `Translating entire CV to ${targetObj.name}...`
    );
    setIsTranslatingCV(true);
    try {
      const res = await fetch("/api/ai/translate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvState,
          targetLanguage
        })
      });
      if (res.ok) {
        const data = await res.json();
        
        // Safety restore for original company and school names
        if (data.experiences && Array.isArray(data.experiences)) {
          data.experiences = data.experiences.map((exp: any) => {
            const originalExp = cvState.experiences.find(e => e.id === exp.id);
            if (originalExp && originalExp.company) {
              return { ...exp, company: originalExp.company };
            }
            return exp;
          });
        }
        if (data.educations && Array.isArray(data.educations)) {
          data.educations = data.educations.map((edu: any) => {
            const originalEdu = cvState.educations.find(e => e.id === edu.id);
            if (originalEdu && originalEdu.school) {
              return { ...edu, school: originalEdu.school };
            }
            return edu;
          });
        }

        // Set language state
        setLang(targetLanguage);
        // Set the active cvState
        setCvState(data);
        // Persist immediately to prevent loss
        localStorage.setItem(`resumeai_data_v2_${targetLanguage}`, JSON.stringify(data));
        if (targetLanguage === "fr") {
          localStorage.setItem("resumeai_data_v2", JSON.stringify(data));
        }
        // Save the current language state as well
        localStorage.setItem(`resumeai_data_v2_${lang}`, JSON.stringify(cvState));
        
        // Update the ref to new language
        prevLangRef.current = targetLanguage;

        showNotification(
          lang === "fr" 
            ? `CV traduit avec succès en ${targetObj.name} !` 
            : `CV successfully translated to ${targetObj.name}!`
        );
      } else {
        throw new Error();
      }
    } catch (e) {
      showNotification(lang === "fr" ? "Erreur de traduction du CV." : "Error translating CV.");
    } finally {
      setIsTranslatingCV(false);
      setShowTranslateCvModal(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 4000);
  };

  // ─── ATS SCORE CALCULATION ───
  const getAtsScore = () => {
    let score = 0;
    if (cvState.name) score += 10;
    if (cvState.jobTitle) score += 10;
    if (cvState.email && cvState.phone) score += 10;
    if (cvState.summary && cvState.summary.length > 50) score += 15;
    if (cvState.skills.length >= 4) score += 20;
    if (cvState.experiences.length > 0 && cvState.experiences.some(e => e.bullets)) score += 25;
    if (cvState.educations.length > 0) score += 10;
    return Math.min(100, score);
  };

  // ─── CV PARSER & FILE IMPORTER ───
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsParsing(true);
    const ext = file.name.split(".").pop()?.toLowerCase();
    let text = "";

    try {
      if (ext === "txt") {
        text = await file.text();
      } else if (ext === "pdf") {
        text = await extractPdfText(file);
      } else if (ext === "docx") {
        text = await extractDocxText(file);
      } else {
        showNotification("Format non supporté. Chargez un fichier PDF, DOCX ou TXT.");
        setIsParsing(false);
        return;
      }

      if (!text.trim()) {
        showNotification("Impossible de lire le texte de ce fichier.");
        setIsParsing(false);
        return;
      }

      // Appel au serveur Express, qui interroge Claude
      const response = await fetch("/api/ai/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: lang })
      });

      if (!response.ok) {
        throw new Error("Erreur de décodage par le service d'IA.");
      }

      const data = await response.json();
      setParsedData(data);
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || "Erreur de traitement du fichier.");
    } finally {
      setIsParsing(false);
    }
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    // Use pdfjs loaded globally from CDN via index.html
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) throw new Error("Bibliothèque PDF.js manquante.");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const extractDocxText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = (window as any).mammoth;
    if (!mammoth) throw new Error("Bibliothèque Mammoth.js manquante.");
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  // Import application action
  const applyImport = async (mode: "fill" | "summary" | "bullets" | "full") => {
    if (!parsedData) return;

    let updated = { ...cvState };

    // Fill standard fields
    if (parsedData.name) updated.name = parsedData.name;
    if (parsedData.jobTitle) updated.jobTitle = parsedData.jobTitle;
    if (parsedData.email) updated.email = parsedData.email;
    if (parsedData.phone) updated.phone = parsedData.phone;
    if (parsedData.location) updated.location = parsedData.location;
    if (parsedData.linkedin) updated.linkedin = parsedData.linkedin;
    if (parsedData.skills && parsedData.skills.length > 0) updated.skills = parsedData.skills;
    if (parsedData.experiences && parsedData.experiences.length > 0) {
      updated.experiences = parsedData.experiences.map((e: any, idx: number) => ({
        id: `exp-${Date.now()}-${idx}`,
        role: e.role || "",
        company: e.company || "",
        start: e.start || "",
        end: e.end || "",
        bullets: e.bullets || ""
      }));
    }
    if (parsedData.educations && parsedData.educations.length > 0) {
      updated.educations = parsedData.educations.map((edu: any, idx: number) => ({
        id: `edu-${Date.now()}-${idx}`,
        degree: edu.degree || "",
        school: edu.school || "",
        year: edu.year || "",
        grade: edu.grade || ""
      }));
    }
    if (parsedData.projects && parsedData.projects.length > 0) {
      updated.projects = parsedData.projects.map((p: any, idx: number) => ({
        id: `proj-${Date.now()}-${idx}`,
        name: p.name || "",
        url: p.url || "",
        desc: p.desc || ""
      }));
    }
    if (parsedData.certifications && parsedData.certifications.length > 0) {
      updated.certifications = parsedData.certifications.map((c: any, idx: number) => ({
        id: `cert-${Date.now()}-${idx}`,
        name: c.name || "",
        issuer: c.issuer || "",
        year: c.year || ""
      }));
    }

    // Handle summary optimization
    if (mode === "summary" || mode === "full") {
      try {
        const res = await fetch("/api/ai/improve-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: updated.jobTitle,
            skills: updated.skills,
            summary: parsedData.summary || "",
            language: lang
          })
        });
        if (res.ok) {
          const improved = await res.json();
          updated.summary = improved.text;
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      if (parsedData.summary) updated.summary = parsedData.summary;
    }

    // Handle bullets optimization
    if (mode === "bullets" || mode === "full") {
      const optimizedExps = await Promise.all(
        updated.experiences.map(async (exp) => {
          try {
            const res = await fetch("/api/ai/improve-bullets", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                role: exp.role,
                company: exp.company,
                bullets: exp.bullets,
                language: lang
              })
            });
            if (res.ok) {
              const improved = await res.json();
              return { ...exp, bullets: improved.text };
            }
          } catch (err) {
            console.error(err);
          }
          return exp;
        })
      );
      updated.experiences = optimizedExps;
    }

    saveCVState(updated);
    setShowImportModal(false);
    setParsedData(null);
    showNotification("Profil professionnel importé et optimisé avec succès !");
  };

  // ─── AI HELPERS (SUMMARY & BULLETS) ───
  const triggerAiSummaryImprove = async () => {
    if (!cvState.jobTitle) {
      showNotification("Saisissez d'abord l'intitulé de votre poste.");
      return;
    }
    showNotification("L'IA affine votre accroche...");
    try {
      const res = await fetch("/api/ai/improve-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: cvState.jobTitle,
          skills: cvState.skills,
          summary: cvState.summary,
          language: lang
        })
      });
      if (res.ok) {
        const data = await res.json();
        saveCVState({ ...cvState, summary: data.text });
        showNotification("Accroche optimisée pour les ATS !");
      }
    } catch (e) {
      showNotification("Une erreur s'est produite lors de la génération.");
    }
  };

  const triggerAiBulletsImprove = async (expId: string) => {
    const exp = cvState.experiences.find(e => e.id === expId);
    if (!exp) return;
    if (!exp.role) {
      showNotification("Veuillez renseigner l'intitule du poste d'expérience.");
      return;
    }
    showNotification("Génération de puces de réalisations percutantes...");
    try {
      const res = await fetch("/api/ai/improve-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: exp.role,
          company: exp.company,
          bullets: exp.bullets,
          language: lang
        })
      });
      if (res.ok) {
        const data = await res.json();
        const updatedExps = cvState.experiences.map(e =>
          e.id === expId ? { ...e, bullets: data.text } : e
        );
        saveCVState({ ...cvState, experiences: updatedExps });
        showNotification("Réalisations chiffrées générées avec succès !");
      }
    } catch (e) {
      showNotification("Impossible de générer des puces d'expérience.");
    }
  };

  // ─── JOB ANALYZER ACTIONS ───
  const scrapeJobDescription = async () => {
    if (!jobDescUrl.trim()) {
      showNotification(lang === "fr" ? "Veuillez saisir une URL valide." : "Please enter a valid URL.");
      return;
    }
    setIsScrapingJob(true);
    try {
      const res = await fetch("/api/scrape-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobDescUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setJobDescText(data.text);
        showNotification(lang === "fr" ? "Offre d'emploi importée avec succès !" : "Job description imported successfully!");
      } else {
        const errData = await res.json();
        showNotification(errData.error || (lang === "fr" ? "Impossible d'importer l'offre d'emploi." : "Failed to import job description."));
      }
    } catch (e) {
      showNotification(lang === "fr" ? "Erreur réseau lors de l'import." : "Network error during import.");
    } finally {
      setIsScrapingJob(false);
    }
  };

  const triggerAutomatedGenerations = async (jobDesc: string) => {
    setIsGeneratingCover(true);
    setIsGeneratingInterview(true);
    showNotification(
      lang === "fr" 
        ? "Génération automatique de la lettre de motivation et des questions d'entretien..." 
        : "Auto-generating cover letter and interview questions..."
    );

    try {
      const [coverRes, interviewRes] = await Promise.all([
        fetch("/api/ai/generate-cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cvState.name,
            jobTitle: cvState.jobTitle,
            skills: cvState.skills,
            cvSummary: cvState.summary,
            companyName: coverCompany || "",
            targetRole: coverRole || cvState.jobTitle || "Desired position",
            whyCompany: coverWhy || (lang === "fr" ? "L'offre d'emploi correspond parfaitement à mon profil." : "The job position perfectly matches my profile."),
            tone: coverTone,
            language: lang,
            jobDescription: jobDesc
          })
        }),
        fetch("/api/ai/generate-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetRole: cvState.jobTitle || "Collaborator",
            cvSummary: cvState.summary,
            skills: cvState.skills,
            language: lang,
            jobDescription: jobDesc
          })
        })
      ]);

      if (coverRes.ok) {
        const coverData = await coverRes.json();
        setCoverLetter(coverData.text);
      }

      if (interviewRes.ok) {
        const interviewData = await interviewRes.json();
        setInterviewQs(interviewData);
        if (!interviewRole) {
          setInterviewRole(cvState.jobTitle || "Collaborator");
        }
      }

      showNotification(
        lang === "fr" 
          ? "Lettre de motivation et questions d'entretien prêtes !" 
          : "Cover letter and interview questions are ready!"
      );
    } catch (error) {
      console.error("Error auto-generating documents:", error);
    } finally {
      setIsGeneratingCover(false);
      setIsGeneratingInterview(false);
    }
  };

  const analyzeJobDescription = async () => {
    if (!jobDescText.trim()) {
      showNotification("Veuillez coller une offre d'emploi.");
      return;
    }
    setIsAnalyzingJob(true);
    setJobAnalysis(null);

    // Concatenate full resume text for high quality parsing
    const cvText = `
      Nom: ${cvState.name}
      Poste: ${cvState.jobTitle}
      Résumé: ${cvState.summary}
      Compétences: ${cvState.skills.join(", ")}
      Expériences: ${cvState.experiences.map(e => `${e.role} chez ${e.company}. Missions: ${e.bullets}`).join("\n")}
      Formations: ${cvState.educations.map(edu => `${edu.degree} - ${edu.school}`).join("\n")}
    `;

    try {
      const res = await fetch("/api/ai/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription: jobDescText, language: lang })
      });
      if (res.ok) {
        const data = await res.json();
        setJobAnalysis(data);
        showNotification("Analyse de l'offre terminée !");
        
        // Auto trigger document generation
        triggerAutomatedGenerations(jobDescText);
      } else {
        throw new Error();
      }
    } catch (e) {
      showNotification("Erreur lors de l'analyse de l'offre.");
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  const autoAddKeywordsToCV = () => {
    if (!jobAnalysis || jobAnalysis.missingKeywords.length === 0) return;
    const toAdd = jobAnalysis.missingKeywords.slice(0, 5);
    const updatedSkills = [...cvState.skills];
    toAdd.forEach(kw => {
      if (!updatedSkills.some(s => s.toLowerCase() === kw.toLowerCase())) {
        updatedSkills.push(kw);
      }
    });
    saveCVState({ ...cvState, skills: updatedSkills });
    showNotification(`Compétences ajoutées au CV : ${toAdd.join(", ")}`);
  };

  // ─── EXPORT/DOWNLOAD ACTIONS ───
  const exportCVPDF = () => {
    const element = document.getElementById("cv-preview-container");
    if (!element) return;

    // Create temporary iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    // Fetch styles to preserve tailwind rules
    let stylesHtml = "";
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        const rules = sheet.cssRules || sheet.rules;
        stylesHtml += "<style>";
        for (let j = 0; j < rules.length; j++) {
          stylesHtml += rules[j].cssText;
        }
        stylesHtml += "</style>";
      } catch (e) {
        if (document.styleSheets[i].href) {
          stylesHtml += `<link rel="stylesheet" href="${document.styleSheets[i].href}">`;
        }
      }
    }

    stylesHtml += `
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #cv-print-root {
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
        body {
          font-family: 'Inter', sans-serif;
          background: white;
          margin: 0;
          padding: 0;
        }
      </style>
    `;

    const cvContent = element.innerHTML;
    const nameText = cvState.name || (lang === "fr" ? "Votre_Nom" : "Your_Name");

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CV_${nameText.replace(/\s+/g, "_")}</title>
          ${stylesHtml}
        </head>
        <body>
          <div id="cv-print-root">
            ${cvContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000);
  };

  const exportCVWord = () => {
    const { name, jobTitle, email, phone, location, linkedin, summary } = cvState;
    const skills = cvState.skills || [];
    const experiences = cvState.experiences || [];
    const educations = cvState.educations || [];
    const projects = cvState.projects || [];
    const certifications = cvState.certifications || [];
    const languages = cvState.languages || [];
    
    const titleText = jobTitle || (lang === "fr" ? "Titre du Poste" : "Job Title");
    const nameText = name || (lang === "fr" ? "Votre Nom" : "Your Name");

    let experienceHtml = "";
    if (experiences && experiences.length > 0) {
      experienceHtml = `
        <h2 style="font-size: 14pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px;">
          ${lang === "fr" ? "EXPÉRIENCES PROFESSIONNELLES" : "PROFESSIONAL EXPERIENCE"}
        </h2>
      `;
      experiences.forEach((exp) => {
        const bulletsList = exp.bullets
          ? exp.bullets.split("\n").map(b => b.trim()).filter(Boolean).map(b => `<li style="font-size: 10pt; font-family: Arial, sans-serif; color: #334155; margin-bottom: 4px;">${b.replace(/^[•\-\*\s]+/g, "")}</li>`)
          : [];
        const bulletsHtml = bulletsList.length > 0 ? `<ul style="margin-top: 4px; margin-bottom: 10px; padding-left: 20px;">${bulletsList.join("")}</ul>` : "";
        
        experienceHtml += `
          <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top; text-align: left;">
                <strong style="font-size: 11pt; font-family: Arial, sans-serif; color: #0f172a;">${exp.role || ""}</strong>
                <span style="font-size: 11pt; font-family: Arial, sans-serif; color: #4f46e5;"> @ ${exp.company || ""}</span>
              </td>
              <td style="vertical-align: top; text-align: right; font-size: 10pt; font-family: Arial, sans-serif; color: #64748b; font-weight: bold;">
                ${exp.start || ""} – ${exp.end || ""}
              </td>
            </tr>
          </table>
          ${bulletsHtml}
        `;
      });
    }

    let educationHtml = "";
    if (educations && educations.length > 0) {
      educationHtml = `
        <h2 style="font-size: 14pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px;">
          ${lang === "fr" ? "FORMATION" : "EDUCATION"}
        </h2>
      `;
      educations.forEach((edu) => {
        educationHtml += `
          <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 8px; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top; text-align: left;">
                <strong style="font-size: 11pt; font-family: Arial, sans-serif; color: #0f172a;">${edu.degree || ""}</strong>
                <div style="font-size: 10pt; font-family: Arial, sans-serif; color: #4f46e5; margin-top: 2px;">${edu.school || ""}</div>
                ${edu.grade ? `<div style="font-size: 9.5pt; font-family: Arial, sans-serif; color: #64748b; font-style: italic; margin-top: 2px;">${edu.grade}</div>` : ""}
              </td>
              <td style="vertical-align: top; text-align: right; font-size: 10pt; font-family: Arial, sans-serif; color: #64748b; font-weight: bold;">
                ${edu.year || ""}
              </td>
            </tr>
          </table>
        `;
      });
    }

    let skillsHtml = "";
    if (skills && skills.length > 0) {
      skillsHtml = `
        <h2 style="font-size: 14pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px;">
          ${lang === "fr" ? "COMPÉTENCES" : "CORE SKILLS"}
        </h2>
        <p style="font-size: 10pt; font-family: Arial, sans-serif; color: #334155; line-height: 1.5; margin-bottom: 10px;">
          ${skills.join(" &bull; ")}
        </p>
      `;
    }

    let languagesHtml = "";
    if (languages && languages.length > 0) {
      languagesHtml = `
        <h2 style="font-size: 14pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px;">
          ${lang === "fr" ? "LANGUES" : "LANGUAGES"}
        </h2>
        <p style="font-size: 10pt; font-family: Arial, sans-serif; color: #334155; line-height: 1.5; margin-bottom: 10px;">
          ${languages.map(l => `<strong>${l.name || ""}</strong> (${l.level || ""})`).join(" &bull; ")}
        </p>
      `;
    }

    let projectsHtml = "";
    if (projects && projects.length > 0) {
      projectsHtml = `
        <h2 style="font-size: 14pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px;">
          ${lang === "fr" ? "PROJETS & PORTFOLIO" : "PROJECTS & PORTFOLIO"}
        </h2>
      `;
      projects.forEach((p) => {
        projectsHtml += `
          <div style="margin-bottom: 10px;">
            <strong style="font-size: 11pt; font-family: Arial, sans-serif; color: #0f172a;">${p.name || ""}</strong>
            ${p.url ? `<span style="font-size: 9.5pt; font-family: Arial, sans-serif; color: #4f46e5;"> (${p.url})</span>` : ""}
            <p style="font-size: 10pt; font-family: Arial, sans-serif; color: #334155; margin-top: 2px; margin-bottom: 8px;">${p.desc || ""}</p>
          </div>
        `;
      });
    }

    let certificationsHtml = "";
    if (certifications && certifications.length > 0) {
      certificationsHtml = `
        <h2 style="font-size: 14pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px;">
          ${lang === "fr" ? "CERTIFICATIONS" : "CERTIFICATIONS"}
        </h2>
      `;
      certifications.forEach((c) => {
        certificationsHtml += `
          <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 6px; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top; text-align: left;">
                <strong style="font-size: 10.5pt; font-family: Arial, sans-serif; color: #0f172a;">${c.name || ""}</strong>
                <span style="font-size: 9.5pt; font-family: Arial, sans-serif; color: #64748b;"> - ${c.issuer || ""}</span>
              </td>
              <td style="vertical-align: top; text-align: right; font-size: 10pt; font-family: Arial, sans-serif; color: #64748b; font-weight: bold;">
                ${c.year || ""}
              </td>
            </tr>
          </table>
        `;
      });
    }

    let referencesHtml = "";
    if (cvState.showReferences && cvState.references) {
      referencesHtml = `
        <h2 style="font-size: 14pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px;">
          ${lang === "fr" ? "RÉFÉRENCES" : "REFERENCES"}
        </h2>
        <p style="font-size: 10pt; font-family: Arial, sans-serif; color: #334155; line-height: 1.5; margin-bottom: 10px; font-style: italic;">
          ${cvState.references}
        </p>
      `;
    }

    const cvHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>CV_${nameText.replace(/\s+/g, "_")}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #1e293b;
            background-color: #ffffff;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 3px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 18px; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; text-align: left;">
              <h1 style="font-size: 26pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; margin: 0; line-height: 1.1;">
                ${nameText}
              </h1>
              <p style="font-size: 13pt; font-family: Arial, sans-serif; font-weight: bold; color: #64748b; text-transform: uppercase; tracking-wider; margin: 4px 0 0 0;">
                ${titleText}
              </p>
            </td>
            <td style="vertical-align: bottom; text-align: right; font-size: 9.5pt; font-family: Arial, sans-serif; color: #475569; line-height: 1.5;">
              ${email ? `<div>✉ ${email}</div>` : ""}
              ${phone ? `<div>📞 ${phone}</div>` : ""}
              ${location ? `<div>📍 ${location}</div>` : ""}
              ${linkedin ? `<div>🔗 ${linkedin}</div>` : ""}
            </td>
          </tr>
        </table>

        <!-- Professional Summary -->
        ${summary ? `
          <div style="margin-bottom: 15px;">
            <h2 style="font-size: 14pt; font-family: Arial, sans-serif; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px; margin-top: 0; margin-bottom: 8px;">
              ${lang === "fr" ? "PROFIL PROFESSIONNEL" : "PROFESSIONAL SUMMARY"}
            </h2>
            <p style="font-size: 10pt; font-family: Arial, sans-serif; color: #334155; line-height: 1.5; margin: 0;">
              ${summary}
            </p>
          </div>
        ` : ""}

        <!-- Content columns -->
        ${experienceHtml}
        ${educationHtml}
        ${skillsHtml}
        ${languagesHtml}
        ${projectsHtml}
        ${certificationsHtml}
        ${referencesHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + cvHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${nameText.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? "Téléchargement du CV Word démarré !" : "CV Word download started!");
  };

  const exportCoverLetterPDF = () => {
    if (!coverLetter) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const nameText = cvState.name || (lang === "fr" ? "Votre Nom" : "Your Name");

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lettre_Motivation_${nameText.replace(/\s+/g, "_")}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @media print {
              body {
                margin: 2cm !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
            body {
              font-family: 'Inter', Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #1e293b;
              background: white;
              margin: 2cm;
            }
            .letter-content {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div class="letter-content">${coverLetter}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000);
  };

  const exportCoverLetterWord = () => {
    if (!coverLetter) return;

    const nameText = cvState.name || (lang === "fr" ? "Votre Nom" : "Your Name");

    const letterHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Lettre_Motivation_${nameText.replace(/\s+/g, "_")}</title>
        <style>
          @page {
            size: A4;
            margin: 2.5cm;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1e293b;
            background-color: #ffffff;
          }
          p {
            margin-bottom: 12px;
          }
        </style>
      </head>
      <body>
        <div style="white-space: pre-wrap; line-height: 1.6; font-family: Arial, sans-serif; font-size: 11pt;">${coverLetter}</div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + letterHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lettre_Motivation_${nameText.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? "Téléchargement de la lettre Word démarré !" : "Cover Letter Word download started!");
  };

  // ─── COVER LETTER ACTIONS ───
  const generateCoverLetterText = async () => {
    setIsGeneratingCover(true);
    try {
      const res = await fetch("/api/ai/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cvState.name,
          jobTitle: cvState.jobTitle,
          skills: cvState.skills,
          cvSummary: cvState.summary,
          companyName: coverCompany,
          targetRole: coverRole,
          whyCompany: coverWhy,
          tone: coverTone,
          language: lang
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCoverLetter(data.text);
        showNotification("Lettre de motivation rédigée !");
      }
    } catch (e) {
      showNotification("Une erreur est survenue lors de la rédaction.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // ─── INTERVIEW ACTIONS ───
  const generateInterviewQuestions = async () => {
    if (!interviewRole.trim()) {
      showNotification("Saisissez un titre de poste.");
      return;
    }
    setIsGeneratingInterview(true);
    try {
      const res = await fetch("/api/ai/generate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: interviewRole,
          cvSummary: cvState.summary,
          skills: cvState.skills,
          language: lang
        })
      });
      if (res.ok) {
        const data = await res.json();
        setInterviewQs(data);
        showNotification("Entretien simulé généré !");
      }
    } catch (e) {
      showNotification("Impossible de générer des questions d'entretien.");
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  // ─── RECRUITER ACTIONS ───
  const addRecruiterCandidate = () => {
    const idx = recruiterCandidates.length + 1;
    const newCand: RecruiterCandidate = {
      id: `rcand-${Date.now()}-${idx}`,
      name: `Candidat #${idx}`,
      cvText: "",
      coverText: "",
      otherText: "",
      uniqueText: "",
      filesLoaded: { cv: false, cover: false, other: false, unique: false }
    };
    setRecruiterCandidates([...recruiterCandidates, newCand]);
  };

  const downloadCandidatesZip = async () => {
    if (recruiterCandidates.length === 0) {
      showNotification(
        lang === "fr" 
          ? "Aucun candidat disponible pour l'export." 
          : "No candidates available for export."
      );
      return;
    }

    const hasDocs = recruiterCandidates.some(c => c.cvText || c.coverText || c.otherText || c.uniqueText);
    if (!hasDocs) {
      showNotification(
        lang === "fr"
          ? "Aucun document (CV/Lettre) n'est chargé pour les candidats."
          : "No documents (CV/Cover letter) are loaded for the candidates."
      );
      return;
    }

    try {
      const zip = new JSZip();

      recruiterCandidates.forEach((cand, idx) => {
        const sanitizedName = cand.name.trim().replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/\s+/g, "_") || `Candidat_${idx + 1}`;
        
        if (cand.cvText || cand.coverText || cand.otherText || cand.uniqueText) {
          const candFolder = zip.folder(sanitizedName);
          if (candFolder) {
            if (cand.cvText) {
              candFolder.file("CV.txt", cand.cvText);
            }
            if (cand.coverText) {
              candFolder.file("Lettre_de_motivation.txt", cand.coverText);
            }
            if (cand.otherText) {
              candFolder.file("Autre_document.txt", cand.otherText);
            }
            if (cand.uniqueText) {
              candFolder.file("Document_Unique.txt", cand.uniqueText);
            }
            
            let meta = `Nom: ${cand.name}\n`;
            if (cand.score !== undefined) {
              meta += `Score de correspondance: ${cand.score}%\n`;
              meta += `Recommandation: ${cand.decision || "N/A"}\n`;
              if (cand.justification) {
                meta += `Justification: ${cand.justification}\n`;
              }
              if (cand.matchedKeywords && cand.matchedKeywords.length > 0) {
                meta += `Mots-clés validés: ${cand.matchedKeywords.join(", ")}\n`;
              }
              if (cand.missingKeywords && cand.missingKeywords.length > 0) {
                meta += `Mots-clés manquants: ${cand.missingKeywords.join(", ")}\n`;
              }
            }
            candFolder.file("Summary.txt", meta);
          }
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Candidats_Espace_Recruteur.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification(
        lang === "fr"
          ? "Téléchargement du ZIP démarré !"
          : "ZIP download started!"
      );
    } catch (error) {
      console.error(error);
      showNotification(
        lang === "fr"
          ? "Erreur lors de la génération du ZIP."
          : "Error generating the ZIP archive."
      );
    }
  };

  const getDocText = (cand: RecruiterCandidate, docType: "cv" | "cover" | "other" | "unique") => {
    if (docType === "cv") return cand.cvText || "";
    if (docType === "cover") return cand.coverText || "";
    if (docType === "unique") return cand.uniqueText || cand.otherText || cand.cvText || "";
    return cand.otherText || "";
  };

  const handleRecruiterCandidateDoc = async (candId: string, docType: "cv" | "cover" | "other" | "unique", file: File, append = false) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    try {
      let text = "";
      if (ext === "txt") text = await file.text();
      else if (ext === "pdf") text = await extractPdfText(file);
      else if (ext === "docx") text = await extractDocxText(file);

      if (!text.trim()) {
        showNotification(lang === "fr" ? "Aucun texte lisible dans ce fichier." : "No readable text found in this file.");
        return;
      }

      setRecruiterCandidates(prev => prev.map(c => {
        if (c.id === candId) {
          const files = { ...c.filesLoaded, [docType]: true };
          if (docType === "cv") {
            const newText = append && c.cvText ? `${c.cvText}\n\n--- DOCUMENT ADDITIONNEL (${file.name}) ---\n\n${text}` : text;
            return { ...c, cvText: newText, filesLoaded: files };
          }
          if (docType === "cover") {
            const newText = append && c.coverText ? `${c.coverText}\n\n--- DOCUMENT ADDITIONNEL (${file.name}) ---\n\n${text}` : text;
            return { ...c, coverText: newText, filesLoaded: files };
          }
          if (docType === "unique") {
            const newText = append && c.uniqueText ? `${c.uniqueText}\n\n--- DOCUMENT UNIQUE ADDITIONNEL (${file.name}) ---\n\n${text}` : text;
            return {
              ...c,
              uniqueText: newText,
              cvText: c.cvText || text,
              otherText: c.otherText || text,
              filesLoaded: { ...files, unique: true, cv: true, other: true }
            };
          }
          const newText = append && c.otherText ? `${c.otherText}\n\n--- DOCUMENT ADDITIONNEL: ${file.name} ---\n\n${text}` : text;
          return { ...c, otherText: newText, filesLoaded: files };
        }
        return c;
      }));

      // Automatically expand the inspector view for this candidate document
      setExpandedCandDocs(prev => ({ ...prev, [candId]: docType }));

      showNotification(
        lang === "fr"
          ? `Document "${file.name}" (${text.length} car.) chargé !`
          : `Document "${file.name}" (${text.length} chars) loaded!`
      );
    } catch (e) {
      showNotification(lang === "fr" ? "Erreur lors de la lecture du document." : "Error reading document.");
    }
  };

  const handleUploadSingleDocCandidate = async (file: File) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    try {
      let text = "";
      if (ext === "txt") text = await file.text();
      else if (ext === "pdf") text = await extractPdfText(file);
      else if (ext === "docx") text = await extractDocxText(file);

      if (!text.trim()) {
        showNotification(lang === "fr" ? "Aucun texte lisible extrait de ce Document Unique." : "No readable text found in this Single Document.");
        return;
      }

      const candName = file.name.replace(/\.[^/.]+$/, "").replace(/^Document_Unique_/i, "").replace(/[_-]/g, " ");
      const newCand: RecruiterCandidate = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        name: candName || `Candidat ${recruiterCandidates.length + 1}`,
        cvText: text,
        coverText: "",
        otherText: text,
        uniqueText: text,
        filesLoaded: {
          cv: true,
          cover: false,
          other: true,
          unique: true
        }
      };

      setRecruiterCandidates(prev => [...prev, newCand]);
      setExpandedCandDocs(prev => ({ ...prev, [newCand.id]: "unique" }));
      showNotification(
        lang === "fr"
          ? `Candidat "${newCand.name}" créé avec son Document Unique (${text.length} car.) !`
          : `Candidate "${newCand.name}" created with Single Document!`
      );
    } catch (err) {
      showNotification(lang === "fr" ? "Erreur lors de la lecture du Document Unique." : "Error reading Single Document.");
    }
  };

  const downloadCandidateSingleDoc = (cand: RecruiterCandidate) => {
    const fullText = [
      `==================================================`,
      `DOSSIER CANDIDAT UNIQUE : ${(cand.name || "Candidat").toUpperCase()}`,
      `Date d'exportation : ${new Date().toLocaleDateString("fr-FR")}`,
      `==================================================\n`,
      cand.cvText ? `--- CURRICULUM VITAE (CV) ---\n\n${cand.cvText}\n` : "",
      cand.coverText ? `--- LETTRE DE MOTIVATION ---\n\n${cand.coverText}\n` : "",
      cand.otherText ? `--- AUTRES DOCUMENTS & ANNEXES ---\n\n${cand.otherText}\n` : "",
      cand.uniqueText ? `--- DOCUMENT UNIQUE ---\n\n${cand.uniqueText}\n` : ""
    ].filter(Boolean).join("\n\n");

    if (!fullText.trim()) {
      showNotification(lang === "fr" ? "Aucun contenu disponible dans le dossier de ce candidat." : "No document content available for this candidate.");
      return;
    }

    const safeName = cand.name ? cand.name.replace(/\s+/g, "_") : "Candidat";
    const fileName = `Document_Unique_${safeName}.txt`;
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? `Téléchargement du Document Unique de ${cand.name} démarré !` : `Single Document download started!`);
  };

  const downloadCandidateDoc = (candName: string, docType: "cv" | "cover" | "other" | "unique", text: string) => {
    if (!text) return;
    const labelMap = { cv: "CV", cover: "Lettre_Motivation", other: "Autre_Document_Complet", unique: "Document_Unique" };
    const safeName = candName ? candName.replace(/\s+/g, "_") : "Candidat";
    const fileName = `${labelMap[docType]}_${safeName}.txt`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? `Téléchargement du document (${labelMap[docType]}) démarré !` : `Document download started!`);
  };

  const handleRecruiterJobFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingRecruiterJob(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase();
      let text = "";
      if (ext === "txt") {
        text = await file.text();
      } else if (ext === "pdf") {
        text = await extractPdfText(file);
      } else if (ext === "docx") {
        text = await extractDocxText(file);
      } else {
        showNotification(lang === "fr" ? "Format non supporté (PDF, DOCX, TXT)." : "Unsupported format (PDF, DOCX, TXT).");
        setIsUploadingRecruiterJob(false);
        return;
      }

      if (!text.trim()) {
        showNotification(lang === "fr" ? "Impossible d'extraire le texte de ce fichier." : "Unable to extract text from this file.");
        setIsUploadingRecruiterJob(false);
        return;
      }

      setRecruiterJobDesc(text);
      setRecruiterJobFile({
        name: file.name,
        size: file.size,
        charCount: text.length
      });
      showNotification(
        lang === "fr"
          ? `Offre d'emploi "${file.name}" chargée avec succès (${text.length} caractères) !`
          : `Job offer "${file.name}" loaded successfully (${text.length} characters)!`
      );
    } catch (err: any) {
      console.error(err);
      showNotification(lang === "fr" ? "Erreur lors de la lecture du fichier d'offre." : "Error reading job offer file.");
    } finally {
      setIsUploadingRecruiterJob(false);
    }
  };

  const handleScrapeRecruiterJobUrl = async () => {
    if (!recruiterJobUrlInput.trim()) {
      showNotification(lang === "fr" ? "Veuillez entrer une URL d'offre valide." : "Please enter a valid job offer URL.");
      return;
    }
    setIsScrapingRecruiterJobUrl(true);
    try {
      const res = await fetch("/api/scrape-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: recruiterJobUrlInput })
      });
      if (res.ok) {
        const data = await res.json();
        setRecruiterJobDesc(data.text);
        try {
          const parsedHost = new URL(recruiterJobUrlInput).hostname;
          setRecruiterJobFile({
            name: `Offre-${parsedHost}`,
            size: 0,
            charCount: data.text.length,
            isUrl: true
          });
        } catch {
          setRecruiterJobFile({
            name: "Offre-web.link",
            size: 0,
            charCount: data.text.length,
            isUrl: true
          });
        }
        showNotification(lang === "fr" ? "Offre d'emploi importée depuis l'URL !" : "Job offer imported from URL!");
      } else {
        showNotification(lang === "fr" ? "Impossible d'importer l'offre depuis cette URL." : "Failed to import job offer from URL.");
      }
    } catch (err) {
      showNotification(lang === "fr" ? "Erreur lors du chargement de l'offre par lien." : "Error loading job offer from link.");
    } finally {
      setIsScrapingRecruiterJobUrl(false);
    }
  };

  const downloadRecruiterJobOffer = () => {
    if (!recruiterJobDesc) return;
    const fileName = recruiterJobFile?.name ? `Offre_${recruiterJobFile.name.replace(/\.[^/.]+$/, "")}.txt` : `Offre_Emploi_${Date.now()}.txt`;
    const blob = new Blob([recruiterJobDesc], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? "Téléchargement de la fiche de poste démarré !" : "Job offer download started!");
  };

  const analyzeSingleCandidate = async (cand: RecruiterCandidate) => {
    if (!recruiterJobDesc.trim()) {
      showNotification(
        lang === "fr"
          ? "Veuillez d'abord charger ou saisir une offre d'emploi."
          : "Please load or enter a job description first."
      );
      return;
    }

    const hasContent = (cand.cvText || cand.coverText || cand.otherText || "").trim().length > 0;
    if (!hasContent) {
      showNotification(
        lang === "fr"
          ? "Veuillez charger au moins un document (CV, Lettre ou autre) pour ce candidat."
          : "Please upload at least one document for this candidate."
      );
      return;
    }

    setAnalyzingCandId(cand.id);
    try {
      const res = await fetch("/api/ai/rank-candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: recruiterJobDesc,
          language: lang,
          candidates: [{
            id: cand.id,
            name: cand.name,
            cvText: cand.cvText,
            coverText: cand.coverText,
            otherText: cand.otherText
          }]
        })
      });

      if (res.ok) {
        const results = await res.json();
        const ranked = results.rankings?.find((r: any) => String(r.id) === String(cand.id)) || results.rankings?.[0];
        if (ranked) {
          setRecruiterCandidates(prev => prev.map(c => {
            if (c.id === cand.id) {
              return {
                ...c,
                score: ranked.score,
                decision: ranked.decision,
                matchedKeywords: ranked.matchedKeywords,
                missingKeywords: ranked.missingKeywords,
                justification: ranked.justification,
                age: ranked.age,
                location: ranked.location,
                strengths: ranked.strengths,
                weaknesses: ranked.weaknesses,
                recruiterComments: ranked.recruiterComments
              };
            }
            return c;
          }));

          showNotification(
            lang === "fr"
              ? `Analyse de "${cand.name}" terminée : Score ${ranked.score}% (${ranked.decision}) !`
              : `Analysis for "${cand.name}" complete: Score ${ranked.score}% (${ranked.decision})!`
          );
        } else {
          showNotification(lang === "fr" ? "Impossible d'analyser ce candidat." : "Could not analyze candidate.");
        }
      } else {
        showNotification(lang === "fr" ? "Erreur lors de l'analyse du candidat par l'IA." : "Error during AI candidate analysis.");
      }
    } catch (err) {
      showNotification(lang === "fr" ? "Erreur réseau lors de l'analyse du candidat." : "Network error analyzing candidate.");
    } finally {
      setAnalyzingCandId(null);
    }
  };

  const runRecruiterEvaluation = async () => {
    if (!recruiterJobDesc.trim()) {
      showNotification("Veuillez d'abord renseigner l'offre d'emploi.");
      return;
    }
    if (recruiterCandidates.length === 0) {
      showNotification("Veuillez ajouter au moins un candidat.");
      return;
    }
    if (!recruiterCandidates.some(c => c.cvText)) {
      showNotification("Veuillez charger au moins un CV.");
      return;
    }

    setIsRecruiterAnalyzing(true);
    setRecruiterResults(null);

    try {
      const res = await fetch("/api/ai/rank-candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: recruiterJobDesc,
          language: lang,
          candidates: recruiterCandidates.map(c => ({
            id: c.id,
            name: c.name,
            cvText: c.cvText,
            coverText: c.coverText,
            otherText: c.otherText
          }))
        })
      });

      if (res.ok) {
        const results = await res.json();
        setRecruiterResults(results);

        // Inject computed rankings back to candidates list for display
        const updatedCandidates = recruiterCandidates.map(c => {
          const ranked = results.rankings?.find((r: any) => String(r.id) === String(c.id));
          if (ranked) {
            return {
              ...c,
              score: ranked.score,
              decision: ranked.decision,
              matchedKeywords: ranked.matchedKeywords,
              missingKeywords: ranked.missingKeywords,
              justification: ranked.justification,
              age: ranked.age,
              location: ranked.location,
              strengths: ranked.strengths,
              weaknesses: ranked.weaknesses,
              recruiterComments: ranked.recruiterComments
            };
          }
          return c;
        });

        setRecruiterCandidates(updatedCandidates);

        // Auto-save report to localStorage
        const evaluatedCands = [...updatedCandidates]
          .filter(c => c.score !== undefined)
          .sort((a, b) => (b.score || 0) - (a.score || 0));
        const topCand = evaluatedCands[0];
        const title = recruiterJobFile?.name || (recruiterJobDesc.trim() ? recruiterJobDesc.trim().split("\n")[0].slice(0, 45) : "Procès-Verbal de Recrutement");

        const newReport: SavedRecruiterReport = {
          id: `rec_report_${Date.now()}`,
          date: new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }),
          title,
          jobDescription: recruiterJobDesc,
          jobFile: recruiterJobFile,
          candidates: updatedCandidates,
          results,
          candidateCount: updatedCandidates.length,
          topCandidateName: topCand?.name,
          topCandidateScore: topCand?.score
        };

        setSavedRecruiterReports(prev => {
          const next = [newReport, ...prev];
          try {
            localStorage.setItem("recruiter_saved_reports_v1", JSON.stringify(next));
          } catch (err) {
            console.error("localStorage save error:", err);
          }
          return next;
        });

        showNotification(lang === "fr" ? "Candidats classés et session sauvegardée dans l'historique local !" : "Candidates ranked and session saved to local history!");
      }
    } catch (e) {
      showNotification("Erreur lors du classement par l'IA.");
    } finally {
      setIsRecruiterAnalyzing(false);
    }
  };

  const handleSaveCurrentRecruiterReport = (customTitle?: string) => {
    if (recruiterCandidates.length === 0) {
      showNotification(
        lang === "fr"
          ? "Aucun candidat à sauvegarder dans ce rapport."
          : "No candidate to save in this report."
      );
      return;
    }

    const evaluatedCands = [...recruiterCandidates]
      .filter(c => c.score !== undefined)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    const topCand = evaluatedCands[0];

    const title = customTitle || recruiterJobFile?.name || (recruiterJobDesc.trim() ? recruiterJobDesc.trim().split("\n")[0].slice(0, 45) : "Procès-Verbal de Recrutement");

    const newReport: SavedRecruiterReport = {
      id: `rec_report_${Date.now()}`,
      date: new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      title,
      jobDescription: recruiterJobDesc,
      jobFile: recruiterJobFile,
      candidates: recruiterCandidates,
      results: recruiterResults,
      candidateCount: recruiterCandidates.length,
      topCandidateName: topCand?.name,
      topCandidateScore: topCand?.score
    };

    const updated = [newReport, ...savedRecruiterReports.filter(r => r.id !== newReport.id)];
    setSavedRecruiterReports(updated);

    try {
      localStorage.setItem("recruiter_saved_reports_v1", JSON.stringify(updated));
      showNotification(
        lang === "fr"
          ? `Rapport "${title}" sauvegardé dans l'historique local !`
          : `Report "${title}" saved in local history!`
      );
    } catch (err) {
      showNotification(
        lang === "fr"
          ? "Erreur lors de la sauvegarde (espace local plein)."
          : "Failed to save locally (storage full)."
      );
    }
  };

  const handleLoadSavedRecruiterReport = (report: SavedRecruiterReport) => {
    setRecruiterJobDesc(report.jobDescription || "");
    setRecruiterJobFile(report.jobFile || null);
    setRecruiterCandidates(report.candidates || []);
    setRecruiterResults(report.results || null);
    setShowSavedReportsModal(false);
    showNotification(
      lang === "fr"
        ? `Session "${report.title}" (${report.date}) restaurée !`
        : `Session "${report.title}" loaded!`
    );
  };

  const handleDeleteSavedRecruiterReport = (reportId: string, title: string) => {
    const updated = savedRecruiterReports.filter(r => r.id !== reportId);
    setSavedRecruiterReports(updated);
    try {
      localStorage.setItem("recruiter_saved_reports_v1", JSON.stringify(updated));
      showNotification(
        lang === "fr"
          ? `Rapport "${title}" supprimé de l'historique.`
          : `Report "${title}" deleted from history.`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAllSavedReports = () => {
    if (confirm(lang === "fr" ? "Voulez-vous vraiment effacer TOUT l'historique des rapports sauvegardés ?" : "Clear ALL saved reports history?")) {
      setSavedRecruiterReports([]);
      try {
        localStorage.removeItem("recruiter_saved_reports_v1");
        showNotification(lang === "fr" ? "Historique réinitialisé." : "History cleared.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const downloadRecruiterReportDocx = () => {
    if (!recruiterResults) return;
    const overallSorted = [...recruiterCandidates]
      .filter(c => c.score !== undefined)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    const isFr = lang === "fr";

    const rowsHtml = overallSorted.map((c, i) => `
      <tr>
        <td style="border:1px solid #cbd5e1;padding:10px;text-align:center;font-weight:bold;background:#f8fafc;">#${i + 1}</td>
        <td style="border:1px solid #cbd5e1;padding:10px;font-weight:bold;color:#1e293b;">
          ${c.name || "Candidat"}
        </td>
        <td style="border:1px solid #cbd5e1;padding:10px;font-size:11px;color:#475569;">
          ${c.age || "N/A"}<br/>📍 ${c.location || "N/A"}
        </td>
        <td style="border:1px solid #cbd5e1;padding:10px;text-align:center;color:#4f46e5;font-weight:bold;font-size:13px;">${c.score}%</td>
        <td style="border:1px solid #cbd5e1;padding:10px;text-align:center;">
          <span style="padding:4px 10px;border-radius:12px;font-weight:bold;font-size:11px;${
            c.decision === "Entretien" ? "background-color:#dcfce7;color:#15803d;border:1px solid #86efac;" :
            c.decision === "À étudier" ? "background-color:#fef3c7;color:#b45309;border:1px solid #fde68a;" :
            "background-color:#ffe4e6;color:#be123c;border:1px solid #fecdd3;"
          }">${c.decision || "N/A"}</span>
        </td>
        <td style="border:1px solid #cbd5e1;padding:10px;font-size:11px;color:#15803d;background:#f0fdf4;">
          ${(c.strengths || c.matchedKeywords || []).map(s => `• ${s}`).join("<br/>") || "-"}
        </td>
        <td style="border:1px solid #cbd5e1;padding:10px;font-size:11px;color:#b45309;background:#fffbeb;">
          ${(c.weaknesses || c.missingKeywords || []).map(w => `• ${w}`).join("<br/>") || "-"}
        </td>
        <td style="border:1px solid #cbd5e1;padding:10px;font-size:11px;color:#334155;line-height:1.5;">
          ${c.recruiterComments ? `<div style="margin-bottom:6px;font-weight:500;">${c.recruiterComments}</div>` : ""}
          ${c.justification ? `<div style="font-size:10px;color:#64748b;font-style:italic;"><strong>Synthèse :</strong> ${c.justification}</div>` : ""}
        </td>
      </tr>
    `).join("");

    const candidateCardsHtml = overallSorted.map((c, i) => `
      <div style="margin-top:20px;padding:14px;border:1px solid #cbd5e1;border-radius:8px;background:#ffffff;">
        <h3 style="margin:0 0 8px 0;color:#1e3a8a;font-size:14px;">
          #${i + 1} — ${c.name} (${c.score}% Match ATS — ${c.decision})
        </h3>
        <p style="margin:0 0 8px 0;font-size:11px;color:#64748b;">
          <strong>Profil :</strong> ${c.age || "N/A"} | 📍 ${c.location || "N/A"}
        </p>
        <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:10px;margin-bottom:8px;font-size:11px;color:#92400e;">
          <strong>Commentaires RH & Recommandations d'Entretien :</strong><br/>
          ${c.recruiterComments || c.justification || "Aucun commentaire détaillé enregistré."}
        </div>
        ${c.justification ? `<p style="font-size:11px;color:#334155;margin:0;"><strong>Justification IA :</strong> ${c.justification}</p>` : ""}
      </div>
    `).join("");

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Rapport d'Analyse et Classement des Candidats</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; margin: 24px; color: #1e293b; line-height: 1.5; }
          h1 { color: #1e3a8a; font-size: 22px; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 12px; }
          h2 { color: #3730a3; font-size: 16px; margin-top: 24px; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
          th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 10px; text-align: left; color: #1e293b; font-weight: bold; }
          .report-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; font-size: 11px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>📊 ${isFr ? "Rapport d'Analyse & de Classement des Candidats" : "Candidate Analysis & Ranking Report"}</h1>
        <p><strong>${isFr ? "Date d'évaluation" : "Evaluation Date"} :</strong> ${new Date().toLocaleDateString(isFr ? "fr-FR" : "en-US")} à ${new Date().toLocaleTimeString(isFr ? "fr-FR" : "en-US")}</p>
        <p><strong>${isFr ? "Fiche de Poste" : "Job Position"} :</strong> ${recruiterJobFile?.name || (isFr ? "Poste analysé" : "Target Role")}</p>
        <p><strong>${isFr ? "Candidats analysés" : "Analyzed Candidates"} :</strong> ${overallSorted.length}</p>
        
        <h2>1. ${isFr ? "Tableau Comparatif des Candidats & Évaluations RH Détaillées" : "Comparative Candidate Table & Detailed HR Evaluations"}</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">${isFr ? "Rang" : "Rank"}</th>
              <th style="width: 15%;">${isFr ? "Nom du Candidat" : "Candidate Name"}</th>
              <th style="width: 12%;">${isFr ? "Âge / Lieu" : "Age / Location"}</th>
              <th style="width: 8%; text-align:center;">Score</th>
              <th style="width: 10%; text-align:center;">${isFr ? "Décision" : "Decision"}</th>
              <th style="width: 15%;">${isFr ? "Points Forts Clés" : "Key Strengths"}</th>
              <th style="width: 15%;">${isFr ? "Points de Vigilance" : "Vigilance Points"}</th>
              <th style="width: 20%;">${isFr ? "Commentaires RH Détaillés & Entretien" : "Detailed HR Comments & Interview Advice"}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <h2>2. ${isFr ? "Fiches Détaillées par Candidat" : "Detailed Candidate Profiles & Guidance"}</h2>
        ${candidateCardsHtml}

        <h2>3. ${isFr ? "Synthèse Globale & Recommandations d'Embauche IA" : "Global Synthesis & Strategic Hiring Guidance"}</h2>
        <div class="report-box">
          ${(recruiterResults.recruiterReport || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Classement_Candidats_Rapport_Word_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? "Rapport Word (.doc/.docx) avec tableau complet téléchargé !" : "Full Word report with table downloaded!");
  };

  const downloadRecruiterReportExcel = () => {
    if (!recruiterResults) return;
    const overallSorted = [...recruiterCandidates]
      .filter(c => c.score !== undefined)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    const isFr = lang === "fr";
    const headers = isFr
      ? ["Rang", "Nom du Candidat", "Score Match (%)", "Décision Recruteur", "Âge Estimé", "Localisation", "Commentaires RH Détaillés & Conseils d'Entretien", "Points Forts Clés", "Points de Vigilance", "Justification Synthétique"]
      : ["Rank", "Candidate Name", "Match Score (%)", "Recruiter Decision", "Estimated Age", "Location", "Detailed HR Comments & Interview Advice", "Key Strengths", "Vigilance Points", "Summary Justification"];

    const rows = overallSorted.map((c, idx) => [
      `#${idx + 1}`,
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${c.score || 0}%"`,
      `"${(c.decision || "").replace(/"/g, '""')}"`,
      `"${(c.age || "Non spécifié").replace(/"/g, '""')}"`,
      `"${(c.location || "Non spécifié").replace(/"/g, '""')}"`,
      `"${(c.recruiterComments || "").replace(/"/g, '""')}"`,
      `"${((c.strengths || c.matchedKeywords || []).join(", ")).replace(/"/g, '""')}"`,
      `"${((c.weaknesses || c.missingKeywords || []).join(", ")).replace(/"/g, '""')}"`,
      `"${(c.justification || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Classement_Candidats_Excel_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? "Tableau Excel (.csv) avec commentaires téléchargé !" : "Excel CSV table with comments downloaded!");
  };

  const downloadRecruiterReportPdf = () => {
    if (!recruiterResults) return;
    const overallSorted = [...recruiterCandidates]
      .filter(c => c.score !== undefined)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showNotification(lang === "fr" ? "Veuillez autoriser les fenêtres surgissantes pour l'impression PDF." : "Please allow popups to print PDF.");
      return;
    }

    const isFr = lang === "fr";

    const rowsHtml = overallSorted.map((c, i) => `
      <tr>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;font-weight:bold;background:#f8fafc;">#${i + 1}</td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-weight:bold;color:#1e293b;">${c.name}</td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-size:10px;color:#475569;">${c.age || "N/A"}<br/>📍 ${c.location || "N/A"}</td>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;color:#4f46e5;font-weight:bold;font-size:12px;">${c.score}%</td>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;">
          <span style="padding:3px 8px;border-radius:12px;font-weight:bold;font-size:10px;${
            c.decision === "Entretien" ? "background-color:#dcfce7;color:#15803d;border:1px solid #86efac;" :
            c.decision === "À étudier" ? "background-color:#fef3c7;color:#b45309;border:1px solid #fde68a;" :
            "background-color:#ffe4e6;color:#be123c;border:1px solid #fecdd3;"
          }">${c.decision || "N/A"}</span>
        </td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-size:10px;color:#15803d;background:#f0fdf4;">
          ${(c.strengths || c.matchedKeywords || []).map(s => `• ${s}`).join("<br/>") || "-"}
        </td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-size:10px;color:#b45309;background:#fffbeb;">
          ${(c.weaknesses || c.missingKeywords || []).map(w => `• ${w}`).join("<br/>") || "-"}
        </td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-size:10px;color:#334155;line-height:1.4;">
          ${c.recruiterComments ? `<div style="font-weight:500;margin-bottom:4px;">${c.recruiterComments}</div>` : ""}
          ${c.justification ? `<div style="font-size:9.5px;color:#64748b;font-style:italic;">${c.justification}</div>` : ""}
        </td>
      </tr>
    `).join("");

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport de Classement Candidats - PDF</title>
        <style>
          @page { size: landscape; margin: 12mm; }
          body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #0f172a; line-height: 1.4; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px; }
          h1 { margin: 0; color: #312e81; font-size: 20px; font-weight: 800; }
          .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 10px; }
          th { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-weight: bold; color: #334155; }
          .report-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 10px; white-space: pre-wrap; font-family: monospace; margin-top: 12px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; text-align: right;">
          <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer;">🖨️ ${isFr ? "Imprimer / Enregistrer en PDF (Format Paysage)" : "Print / Save to PDF (Landscape)"}</button>
        </div>
        <div class="header">
          <div>
            <h1>📊 ${isFr ? "Rapport d'Évaluation & Classement des Candidats" : "Candidate Evaluation & Ranking Report"}</h1>
            <div class="subtitle">${isFr ? "Généré le" : "Generated on"} ${new Date().toLocaleDateString(isFr ? "fr-FR" : "en-US")} à ${new Date().toLocaleTimeString(isFr ? "fr-FR" : "en-US")} • ${recruiterJobFile?.name || (isFr ? "Poste évalué" : "Target Role")}</div>
          </div>
          <div style="text-align: right; font-size: 12px; font-weight: bold; color: #4f46e5;">
            ${overallSorted.length} ${isFr ? "candidat(s) analysé(s)" : "analyzed candidate(s)"}
          </div>
        </div>

        <h3 style="font-size: 13px; color: #1e293b; margin-bottom: 6px;">1. ${isFr ? "Tableau comparatif des candidatures et commentaires RH" : "Comparative Candidate Table & HR Comments"}</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 4%;">${isFr ? "Rang" : "Rank"}</th>
              <th style="width: 14%;">${isFr ? "Candidat" : "Candidate"}</th>
              <th style="width: 12%;">${isFr ? "Âge / Lieu" : "Age / Location"}</th>
              <th style="width: 6%; text-align:center;">Score</th>
              <th style="width: 9%; text-align:center;">${isFr ? "Décision" : "Decision"}</th>
              <th style="width: 15%;">${isFr ? "Points Forts Clés" : "Key Strengths"}</th>
              <th style="width: 15%;">${isFr ? "Points de Vigilance" : "Vigilance Points"}</th>
              <th style="width: 25%;">${isFr ? "Commentaires RH & Entretien" : "HR Comments & Interview Advice"}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <h3 style="font-size: 13px; color: #1e293b; margin-top: 22px; margin-bottom: 6px;">2. ${isFr ? "Rapport d'Analyse Stratégique Globale IA" : "Global Strategic AI Analysis"}</h3>
        <div class="report-card">
          ${(recruiterResults.recruiterReport || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </div>

        <script>
          setTimeout(() => { window.print(); }, 500);
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
    showNotification(lang === "fr" ? "Aperçu Impression / PDF en tableau ouvert !" : "Table-formatted Print / PDF preview opened!");
  };

  const downloadRecruiterReport = () => {
    if (!recruiterResults) return;
    const overallSorted = [...recruiterCandidates]
      .filter(c => c.score !== undefined)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    const isFr = lang === "fr";
    const dateStr = new Date().toLocaleDateString(isFr ? "fr-FR" : "en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
    const jobTitle = recruiterJobFile?.name || (isFr ? "Offre d'emploi analysée" : "Target Job Position");

    const tableHeader = isFr ? `
## 1. 📊 Tableau Synthétique et Comparatif des Candidats
| Rang | Candidat | Score ATS | Décision | Profil (Âge / Lieu) | Points Forts Clés | Points de Vigilance | Commentaires RH Détaillés & Conseils d'Entretien |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :--- |` : `
## 1. 📊 Comparative Candidate Ranking Table
| Rank | Candidate | ATS Score | Decision | Profile (Age / Location) | Key Strengths | Vigilance Points | Detailed HR Comments & Interview Guidance |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :--- |`;

    const tableRows = overallSorted.map((c, i) => {
      const cleanComments = (c.recruiterComments || c.justification || "N/A").replace(/[\r\n]+/g, " ").replace(/\|/g, "/");
      const cleanStrengths = (c.strengths || c.matchedKeywords || []).slice(0, 4).join(", ").replace(/[\r\n]+/g, " ").replace(/\|/g, "/");
      const cleanWeaknesses = (c.weaknesses || c.missingKeywords || []).slice(0, 3).join(", ").replace(/[\r\n]+/g, " ").replace(/\|/g, "/");
      return `| **#${i + 1}** | **${c.name}** | **${c.score}%** | \`${c.decision || "N/A"}\` | ${c.age || "N/A"} - ${c.location || "N/A"} | ${cleanStrengths || "-"} | ${cleanWeaknesses || "-"} | ${cleanComments} |`;
    }).join("\n");

    const fullMarkdown = `
# 📊 ${isFr ? "Rapport d'Analyse et de Classement des Candidats" : "Candidate Analysis and Ranking Report"}
- **${isFr ? "Poste évalué" : "Target Role"} :** ${jobTitle}
- **${isFr ? "Date de génération" : "Date"} :** ${dateStr}
- **${isFr ? "Nombre de candidatures analysées" : "Number of candidates"} :** ${overallSorted.length}

${tableHeader}
${tableRows}

## 2. 📝 ${isFr ? "Fiches Détaillées par Candidat & Questions d'Entretien" : "Individual Candidate Profiles & Interview Questions"}
${overallSorted.map((c, i) => `
### Candidat #${i + 1} : ${c.name}
- **Score ATS :** ${c.score}% | **Décision :** ${c.decision}
- **Âge & Localisation :** ${c.age || "N/A"} | ${c.location || "N/A"}
- **Points Forts :** ${(c.strengths || c.matchedKeywords || []).join(", ") || "Aucun"}
- **Points de Vigilance :** ${(c.weaknesses || c.missingKeywords || []).join(", ") || "Aucun"}
- **Commentaires RH Détaillés :**
> ${c.recruiterComments || c.justification || "Aucun commentaire"}
`).join("\n")}

## 3. 🎯 ${isFr ? "Synthèse Globale & Recommandations Stratégiques de Recrutement" : "Global Strategic Executive Summary"}
${recruiterResults.recruiterReport || ""}
    `.trim();

    const blob = new Blob([fullMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rapport-recrutement-tableau-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(isFr ? "Rapport complet au format tableau (Markdown) téléchargé !" : "Complete table-formatted report (Markdown) downloaded!");
  };

  // ─── DEDICATED HR NOTES & COMMENTS EXPORTS (PDF, WORD, EXCEL) ───
  const downloadHrNotesDocx = () => {
    const candidatesToExport = recruiterCandidates.filter(c => c.name);
    if (candidatesToExport.length === 0) {
      showNotification(
        lang === "fr"
          ? "Aucun candidat avec des notes à exporter."
          : "No candidate with notes to export."
      );
      return;
    }

    const overallSorted = [...candidatesToExport].sort((a, b) => (b.score || 0) - (a.score || 0));
    const isFr = lang === "fr";

    const tableRowsHtml = overallSorted.map((c, i) => `
      <tr>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;font-weight:bold;background:#f8fafc;">#${i + 1}</td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-weight:bold;color:#1e293b;">${c.name}</td>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;font-weight:bold;color:#4f46e5;">${c.score ?? "N/A"}%</td>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;">
          <span style="padding:3px 8px;border-radius:12px;font-weight:bold;font-size:10px;${
            c.decision === "Entretien" ? "background:#dcfce7;color:#15803d;" :
            c.decision === "À étudier" ? "background:#fef3c7;color:#b45309;" : "background:#ffe4e6;color:#be123c;"
          }">${c.decision || "N/A"}</span>
        </td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-size:11px;color:#334155;">
          <strong>${c.recruiterComments || c.justification || "-"}</strong>
        </td>
      </tr>
    `).join("");

    const candidatesHtml = overallSorted.map((c, i) => `
      <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px;">
          <h2 style="margin: 0; font-size: 16px; color: #312e81;">
            Rang #${i + 1} — ${c.name}
          </h2>
          <span style="font-weight: bold; color: #4f46e5;">Score : ${c.score ?? "N/A"}% | Décision : ${c.decision || "N/A"}</span>
        </div>
        
        <p style="font-size: 11px; color: #64748b; margin-top: 0;">
          <strong>Âge :</strong> ${c.age || "N/A"} &nbsp;|&nbsp; <strong>Localisation :</strong> ${c.location || "N/A"}
        </p>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 12px; border-radius: 6px; margin-bottom: 10px;">
          <h3 style="margin: 0 0 6px 0; font-size: 13px; color: #92400e;">💬 Commentaires & Notes RH pour l'Entretien :</h3>
          <p style="margin: 0; font-size: 12px; color: #78350f; font-weight: 500;">
            ${c.recruiterComments || c.justification || "Aucun commentaire rédigé."}
          </p>
        </div>

        ${c.justification ? `
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
          <h4 style="margin: 0 0 4px 0; font-size: 12px; color: #1e40af;">💡 Synthèse & Justification IA :</h4>
          <p style="margin: 0; font-size: 11px; color: #1e3a8a;">${c.justification}</p>
        </div>
        ` : ""}

        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 8px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 8px;">
              <strong style="color: #15803d;">💪 Points Forts :</strong><br/>
              ${(c.strengths || c.matchedKeywords || []).map(s => `• ${s}`).join("<br/>") || "Aucun spécifié"}
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 8px;">
              <strong style="color: #b45309;">⚠️ Points de Vigilance :</strong><br/>
              ${(c.weaknesses || c.missingKeywords || []).map(w => `• ${w}`).join("<br/>") || "Aucun spécifié"}
            </td>
          </tr>
        </table>
      </div>
    `).join("");

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Notes et Commentaires RH - Candidats</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; margin: 24px; color: #1e293b; line-height: 1.5; }
          h1 { color: #312e81; font-size: 22px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
          h2 { color: #4338ca; font-size: 16px; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
          th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>📝 ${isFr ? "Notes & Commentaires RH - Évaluation des Candidats" : "HR Notes & Candidate Comments"}</h1>
        <p><strong>${isFr ? "Date d'export" : "Export Date"} :</strong> ${new Date().toLocaleDateString(isFr ? "fr-FR" : "en-US")} à ${new Date().toLocaleTimeString(isFr ? "fr-FR" : "en-US")}</p>
        <p><strong>${isFr ? "Fiche de Poste" : "Target Role"} :</strong> ${recruiterJobFile?.name || (isFr ? "Poste évalué" : "Analyzed Job")}</p>
        <p><strong>${isFr ? "Candidats évalués" : "Evaluated Candidates"} :</strong> ${overallSorted.length}</p>
        
        <h2>1. ${isFr ? "Tableau Synthétique des Notes & Commentaires RH" : "Summary Table of HR Notes & Comments"}</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 8%;">${isFr ? "Rang" : "Rank"}</th>
              <th style="width: 20%;">${isFr ? "Candidat" : "Candidate"}</th>
              <th style="width: 10%; text-align:center;">Score</th>
              <th style="width: 14%; text-align:center;">${isFr ? "Décision" : "Decision"}</th>
              <th style="width: 48%;">${isFr ? "Commentaires & Remarques RH" : "HR Notes & Remarks"}</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <h2>2. ${isFr ? "Détails Individuels par Candidat" : "Detailed Individual Profiles"}</h2>
        ${candidatesHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Notes_et_Commentaires_RH_Candidats_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? "Notes RH exportées au format Word (.docx) avec tableau !" : "HR Notes exported to Word (.docx) with table!");
  };

  const downloadHrNotesExcel = () => {
    const candidatesToExport = recruiterCandidates.filter(c => c.name);
    if (candidatesToExport.length === 0) {
      showNotification(
        lang === "fr"
          ? "Aucun candidat avec des notes à exporter."
          : "No candidate with notes to export."
      );
      return;
    }

    const overallSorted = [...candidatesToExport].sort((a, b) => (b.score || 0) - (a.score || 0));

    const headers = [
      "Rang",
      "Nom du Candidat",
      "Score Match (%)",
      "Décision Recruteur",
      "Âge Estimé",
      "Localisation",
      "Commentaires & Notes RH",
      "Synthèse / Justification IA",
      "Points Forts",
      "Points de Vigilance"
    ];

    const rows = overallSorted.map((c, idx) => [
      `#${idx + 1}`,
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${c.score || 0}%"`,
      `"${(c.decision || "").replace(/"/g, '""')}"`,
      `"${(c.age || "Non spécifié").replace(/"/g, '""')}"`,
      `"${(c.location || "Non spécifié").replace(/"/g, '""')}"`,
      `"${(c.recruiterComments || "").replace(/"/g, '""')}"`,
      `"${(c.justification || "").replace(/"/g, '""')}"`,
      `"${((c.strengths || c.matchedKeywords || []).join(", ")).replace(/"/g, '""')}"`,
      `"${((c.weaknesses || c.missingKeywords || []).join(", ")).replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Notes_et_Commentaires_RH_Candidats_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(lang === "fr" ? "Notes RH exportées au format Excel (.csv) !" : "HR Notes exported to Excel (.csv)!");
  };

  const downloadHrNotesPdf = () => {
    const candidatesToExport = recruiterCandidates.filter(c => c.name);
    if (candidatesToExport.length === 0) {
      showNotification(
        lang === "fr"
          ? "Aucun candidat avec des notes à exporter."
          : "No candidate with notes to export."
      );
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showNotification(lang === "fr" ? "Veuillez autoriser les fenêtres surgissantes pour l'impression PDF." : "Please allow popups to print PDF.");
      return;
    }

    const overallSorted = [...candidatesToExport].sort((a, b) => (b.score || 0) - (a.score || 0));
    const isFr = lang === "fr";

    const tableRowsHtml = overallSorted.map((c, i) => `
      <tr>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;font-weight:bold;background:#f8fafc;">#${i + 1}</td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-weight:bold;color:#1e293b;">${c.name}</td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-size:10px;color:#475569;">${c.age || "N/A"}<br/>📍 ${c.location || "N/A"}</td>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;font-weight:bold;color:#4f46e5;">${c.score ?? "N/A"}%</td>
        <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;">
          <span style="padding:3px 8px;border-radius:12px;font-weight:bold;font-size:9.5px;${
            c.decision === "Entretien" ? "background:#dcfce7;color:#15803d;" :
            c.decision === "À étudier" ? "background:#fef3c7;color:#b45309;" : "background:#ffe4e6;color:#be123c;"
          }">${c.decision || "N/A"}</span>
        </td>
        <td style="border:1px solid #cbd5e1;padding:8px;font-size:10px;color:#334155;line-height:1.4;">
          ${c.recruiterComments || c.justification || "-"}
        </td>
      </tr>
    `).join("");

    const candidatesHtml = overallSorted.map((c, i) => `
      <div class="card">
        <div class="card-header">
          <div style="font-size: 15px; font-weight: 800; color: #1e1b4b;">
            Rang #${i + 1} — ${c.name}
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span class="badge badge-score">${c.score ?? 0}% Match</span>
            <span class="badge ${
              c.decision === "Entretien" ? "badge-green" :
              c.decision === "À étudier" ? "badge-amber" : "badge-rose"
            }">${c.decision || "N/A"}</span>
          </div>
        </div>

        <div style="font-size: 11px; color: #64748b; margin-bottom: 12px;">
          ${c.age ? `🎂 ${c.age} &nbsp;&nbsp;` : ''}${c.location ? `📍 ${c.location}` : ''}
        </div>

        ${c.recruiterComments ? `
        <div class="comments-box">
          <div class="box-title">💬 Commentaires & Notes RH pour l'Entretien :</div>
          <div class="box-text">${c.recruiterComments}</div>
        </div>
        ` : ''}

        ${c.justification ? `
        <div class="justification-box">
          <div class="box-title" style="color: #1e40af;">💡 Synthèse & Justification IA :</div>
          <div class="box-text" style="color: #1e3a8a;">${c.justification}</div>
        </div>
        ` : ''}

        <div class="grid">
          <div class="grid-col strengths">
            <div class="box-title" style="color: #166534;">💪 Points Forts :</div>
            ${(c.strengths || c.matchedKeywords || []).map(s => `<div style="margin-top:2px;">• ${s}</div>`).join("") || "<em>Aucun spécifié</em>"}
          </div>
          <div class="grid-col weaknesses">
            <div class="box-title" style="color: #9a3412;">⚠️ Points de Vigilance :</div>
            ${(c.weaknesses || c.missingKeywords || []).map(w => `<div style="margin-top:2px;">• ${w}</div>`).join("") || "<em>Aucun spécifié</em>"}
          </div>
        </div>
      </div>
    `).join("");

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Notes et Commentaires RH - PDF</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 25px; color: #0f172a; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; }
          h1 { margin: 0; color: #312e81; font-size: 20px; font-weight: 800; }
          .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
          .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
          .badge { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 9999px; text-transform: uppercase; }
          .badge-score { background: #e0e7ff; color: #3730a3; }
          .badge-green { background: #dcfce7; color: #166534; }
          .badge-amber { background: #fef3c7; color: #92400e; }
          .badge-rose { background: #ffe4e6; color: #9f1239; }
          .comments-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
          .justification-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
          .box-title { font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
          .box-text { font-size: 12px; color: #334155; font-weight: 500; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; font-size: 11px; }
          .grid-col { padding: 10px; border-radius: 8px; }
          .strengths { background: #f0fdf4; border: 1px solid #bbf7d0; color: #14532d; }
          .weaknesses { background: #fff7ed; border: 1px solid #ffedd5; color: #7c2d12; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">🖨️ Imprimer / Enregistrer les Notes RH en PDF</button>
        </div>
        <div class="header">
          <div>
            <h1>📝 ${isFr ? "Notes & Commentaires RH des Candidats" : "HR Notes & Candidate Comments"}</h1>
            <div class="subtitle">${isFr ? "Évaluation RH générée le" : "HR evaluation generated on"} ${new Date().toLocaleDateString(isFr ? "fr-FR" : "en-US")} à ${new Date().toLocaleTimeString(isFr ? "fr-FR" : "en-US")}</div>
          </div>
          <div style="text-align: right; font-size: 12px; font-weight: bold; color: #4f46e5;">
            ${overallSorted.length} ${isFr ? "dossier(s) candidat(s)" : "candidate profile(s)"}
          </div>
        </div>

        <h2 style="font-size: 14px; color: #1e293b; margin-top: 15px; margin-bottom: 8px;">
          1. ${isFr ? "Tableau Synthétique des Évaluations & Commentaires" : "Summary Evaluation & Notes Table"}
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 10px;">
          <thead>
            <tr>
              <th style="background:#f8fafc;border:1px solid #cbd5e1;padding:8px;text-align:center;width:6%;">${isFr ? "Rang" : "Rank"}</th>
              <th style="background:#f8fafc;border:1px solid #cbd5e1;padding:8px;text-align:left;width:18%;">${isFr ? "Candidat" : "Candidate"}</th>
              <th style="background:#f8fafc;border:1px solid #cbd5e1;padding:8px;text-align:left;width:12%;">${isFr ? "Âge / Lieu" : "Age / Location"}</th>
              <th style="background:#f8fafc;border:1px solid #cbd5e1;padding:8px;text-align:center;width:8%;">Score</th>
              <th style="background:#f8fafc;border:1px solid #cbd5e1;padding:8px;text-align:center;width:12%;">${isFr ? "Décision" : "Decision"}</th>
              <th style="background:#f8fafc;border:1px solid #cbd5e1;padding:8px;text-align:left;width:44%;">${isFr ? "Commentaires & Remarques RH" : "HR Notes & Remarks"}</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <h2 style="font-size: 14px; color: #1e293b; margin-top: 20px; margin-bottom: 12px;">
          2. ${isFr ? "Fiches Individuelles & Recommandations d'Entretien" : "Individual Profiles & Interview Guidance"}
        </h2>
        ${candidatesHtml}
      </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
    showNotification(lang === "fr" ? "Aperçu Impression / PDF des Notes RH ouvert !" : "HR Notes PDF print preview opened!");
  };

  // ─── SALARY COMPUTATION ───
  const getEstimatedSalary = () => {
    const base: Record<string, number> = {
      tech: 42000,
      finance: 48000,
      marketing: 36000,
      health: 38000,
      education: 30000,
      industry: 38000
    };
    const cityMult: Record<string, number> = {
      paris: 1.15,
      lyon: 0.98,
      bordeaux: 0.95,
      marseille: 0.92,
      remote: 1.05
    };
    const experienceBonus = Math.min(salaryExp * 1800, 25000);
    const sectorBase = base[salarySector] || 35000;
    const multiplier = cityMult[salaryCity] || 1.0;

    const min = Math.round(((sectorBase + experienceBonus) * multiplier * 0.9) / 1000) * 1000;
    const max = Math.round(((sectorBase + experienceBonus) * multiplier * 1.1) / 1000) * 1000;
    const median = Math.round((min + max) / 2);

    return { min, max, median };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased transition-colors duration-200">
      {/* ─── TOAST NOTIFICATION ─── */}
      <AnimatePresence>
        {notif && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 shadow-xl px-5 py-3.5 rounded-xl flex items-center gap-3 text-sm font-semibold max-w-sm"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 animate-pulse" />
            <span>{notif}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER ─── */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-8 shrink-0 shadow-sm z-30 transition-colors duration-200">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-200">
              R
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">
                {t.appTitle}
              </span>
              <span className="hidden md:block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                {t.appSub}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {Object.entries(t.tabs).map(([key, label]: any) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  if (key === "interview" && !interviewRole) {
                    setInterviewRole(cvState.jobTitle);
                  }
                  if (key === "cover" && !coverRole) {
                    setCoverRole(cvState.jobTitle);
                  }
                  if (key === "salary" && !salaryRole) {
                    setSalaryRole(cvState.jobTitle);
                  }
                }}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150 ${
                  activeTab === key
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3.5 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.actions.ats}
            </span>
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full ${
                getAtsScore() >= 75
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : getAtsScore() >= 50
                  ? "bg-amber-50 text-amber-600 border border-amber-100"
                  : "bg-rose-50 text-rose-600 border border-rose-100"
              }`}
            >
              {getAtsScore()}%
            </span>
          </div>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex items-center gap-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl transition shadow-sm"
            title={theme === "dark" ? (lang === "fr" ? "Activer le mode clair" : "Activate light mode") : (lang === "fr" ? "Activer le mode sombre" : "Activate dark mode")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{lang === "fr" ? "Clair" : "Light"}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span className="hidden sm:inline">{lang === "fr" ? "Sombre" : "Dark"}</span>
              </>
            )}
          </button>

          {/* Interface Language Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowTranslateCvModal(false);
              }}
              className="flex items-center gap-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl transition shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.flag}{" "}
                {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.code.toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === "fr" ? "Langue de l'application" : "App Language"}
                  </div>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={`lang-opt-${l.code}`}
                      onClick={() => {
                        setLang(l.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left transition cursor-pointer ${
                        lang === l.code
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </span>
                      {lang === l.code && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Translate Entire CV Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTranslateCvModal(!showTranslateCvModal);
                setShowLangDropdown(false);
              }}
              disabled={isTranslatingCV}
              className="flex items-center gap-2 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 px-3 py-2 rounded-xl transition disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isTranslatingCV ? "animate-spin text-indigo-500" : "text-indigo-400"}`} />
              <span>
                {isTranslatingCV
                  ? (lang === "fr" ? "Traduction..." : "Translating...")
                  : (lang === "fr" ? "Traduire le CV" : "Translate CV")}
              </span>
              <ChevronDown className="w-3 h-3 text-indigo-400" />
            </button>

            {showTranslateCvModal && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTranslateCvModal(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === "fr" ? "Traduire tout le CV vers :" : "Translate entire CV to:"}
                  </div>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={`trans-opt-${l.code}`}
                      onClick={() => translateEntireCV(l.code)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{l.code}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => {
              if (window.confirm(lang === "fr" ? "Voulez-vous réinitialiser le CV avec les données d'exemple ?" : "Do you want to reset the CV to the sample data?")) {
                const defaults = lang === "fr" ? INITIAL_FR_CV : INITIAL_EN_CV;
                saveCVState(defaults);
                showNotification(lang === "fr" ? "CV réinitialisé avec succès !" : "CV successfully reset!");
              }
            }}
            className="flex items-center gap-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl transition shadow-sm"
            title={lang === "fr" ? "Réinitialiser le CV d'exemple" : "Reset CV sample data"}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
            <span>{lang === "fr" ? "Réinitialiser" : "Reset"}</span>
          </button>
        </div>
      </header>

      {/* Mobile navigation row */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 overflow-x-auto flex gap-1 scrollbar-none z-20">
        {Object.entries(t.tabs).map(([key, label]: any) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === key
                ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-slate-700"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── MAIN CONTAINER ─── */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* LEFT WORKSPACE / FORM PANEL */}
        <section className="w-full md:w-[48%] xl:w-[44%] border-r border-slate-200 bg-white flex flex-col overflow-y-auto z-10">
          <div className="p-6 md:p-8 flex-1">
            {/* TAB 1: EDITOR */}
            {activeTab === "editor" && (
              isSharedView ? (
                <div className="space-y-6">
                  {/* Shared View Recruiter Dashboard Banner */}
                  <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl border border-indigo-950 p-6 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-lg">
                        <Users className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <span className="inline-block bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2">
                          {lang === "fr" ? "Mode Recruteur (Lecture seule)" : "Recruiter Mode (Read-Only)"}
                        </span>
                        <h4 className="text-base font-black">
                          {cvState.name || (lang === "fr" ? "Profil partagé" : "Shared profile")}
                        </h4>
                        <p className="text-xs text-indigo-200 mt-1 leading-relaxed font-medium">
                          {lang === "fr" 
                            ? "Vous consultez la version interactive et optimisée de ce profil." 
                            : "You are viewing the interactive, optimized version of this profile."}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                          <button
                            onClick={importSharedCandidateToRecruiter}
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-900/30"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {lang === "fr" ? "Ajouter aux candidats" : "Add to candidates"}
                          </button>
                          
                          <button
                            onClick={exportCVWord}
                            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition border border-slate-700"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-400" />
                            {lang === "fr" ? "Exporter .DOC" : "Export .DOC"}
                          </button>

                          <button
                            onClick={exitSharedView}
                            className="inline-flex items-center gap-1.5 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white text-xs font-bold px-3 py-2.5 rounded-xl transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {lang === "fr" ? "Quitter" : "Exit"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      {lang === "fr" ? "Résumé du profil" : "Profile Summary"}
                    </h5>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {cvState.summary || (lang === "fr" ? "Aucun résumé renseigné." : "No summary provided.")}
                    </p>
                  </div>

                  {/* Contact Info card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      {lang === "fr" ? "Informations de contact" : "Contact Information"}
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">EMAIL</span>
                        <span className="font-semibold text-slate-700">{cvState.email || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">{lang === "fr" ? "TÉLÉPHONE" : "PHONE"}</span>
                        <span className="font-semibold text-slate-700">{cvState.phone || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">LOCALISATION</span>
                        <span className="font-semibold text-slate-700">{cvState.location || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">LINKEDIN</span>
                        <span className="font-semibold text-slate-700 truncate block max-w-full">{cvState.linkedin || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Tag Cloud */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      {lang === "fr" ? "Compétences clés" : "Key Skills"}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {cvState.skills.length > 0 ? (
                        cvState.skills.map((skill: any, index: number) => (
                          <span key={index} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">{lang === "fr" ? "Aucune compétence renseignée." : "No skills provided."}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* File parser banner */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {t.editor.bannerTitle}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {t.editor.bannerDesc}
                      </p>
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="mt-3.5 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-indigo-100 transition"
                      >
                        {t.editor.bannerBtn}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal identity section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t.editor.personalInfo}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t.editor.fullName}
                      </label>
                      <input
                        type="text"
                        value={cvState.name}
                        onChange={(e) => saveCVState({ ...cvState, name: e.target.value })}
                        className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3.5 py-2.5 text-xs font-medium transition outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t.editor.jobTitle}
                      </label>
                      <input
                        type="text"
                        value={cvState.jobTitle}
                        onChange={(e) => saveCVState({ ...cvState, jobTitle: e.target.value })}
                        className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3.5 py-2.5 text-xs font-medium transition outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Email
                      </label>
                      <input
                        type="email"
                        value={cvState.email}
                        onChange={(e) => saveCVState({ ...cvState, email: e.target.value })}
                        className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3.5 py-2.5 text-xs font-medium transition outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        value={cvState.phone}
                        onChange={(e) => saveCVState({ ...cvState, phone: e.target.value })}
                        className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3.5 py-2.5 text-xs font-medium transition outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t.editor.location}
                      </label>
                      <input
                        type="text"
                        value={cvState.location}
                        onChange={(e) => saveCVState({ ...cvState, location: e.target.value })}
                        className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3.5 py-2.5 text-xs font-medium transition outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t.editor.linkedin}
                      </label>
                      <input
                        type="text"
                        value={cvState.linkedin}
                        onChange={(e) => saveCVState({ ...cvState, linkedin: e.target.value })}
                        className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3.5 py-2.5 text-xs font-medium transition outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional summary & branding hook */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t.editor.summary}
                    </h3>
                    <button
                      onClick={triggerAiSummaryImprove}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.actions.improveWithAi}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={cvState.summary}
                    placeholder={t.editor.summaryPh}
                    onChange={(e) => saveCVState({ ...cvState, summary: e.target.value })}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-xs font-medium transition leading-relaxed outline-none"
                  />
                </div>

                {/* Dynamic experiences blocks */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {t.editor.experiences}
                    </h3>
                    <button
                      onClick={() => {
                        const newExp: Experience = {
                          id: `exp-${Date.now()}`,
                          role: "",
                          company: "",
                          start: "",
                          end: "",
                          bullets: ""
                        };
                        saveCVState({ ...cvState, experiences: [...cvState.experiences, newExp] });
                      }}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.actions.add}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cvState.experiences.map((exp, idx) => (
                      <div
                        key={exp.id}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5 relative"
                      >
                        <button
                          onClick={() => {
                            const filtered = cvState.experiences.filter(e => e.id !== exp.id);
                            saveCVState({ ...cvState, experiences: filtered });
                          }}
                          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.role}
                            </label>
                            <input
                              type="text"
                              value={exp.role}
                              placeholder="ex: Lead React Architect"
                              onChange={(e) => {
                                const updated = cvState.experiences.map(item =>
                                  item.id === exp.id ? { ...item, role: e.target.value } : item
                                );
                                saveCVState({ ...cvState, experiences: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.company}
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              placeholder="ex: Google France"
                              onChange={(e) => {
                                const updated = cvState.experiences.map(item =>
                                  item.id === exp.id ? { ...item, company: e.target.value } : item
                                );
                                saveCVState({ ...cvState, experiences: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.startDate}
                            </label>
                            <input
                              type="text"
                              value={exp.start}
                              placeholder="ex: Janv 2021"
                              onChange={(e) => {
                                const updated = cvState.experiences.map(item =>
                                  item.id === exp.id ? { ...item, start: e.target.value } : item
                                );
                                saveCVState({ ...cvState, experiences: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.endDate}
                            </label>
                            <input
                              type="text"
                              value={exp.end}
                              placeholder="ex: Présent"
                              onChange={(e) => {
                                const updated = cvState.experiences.map(item =>
                                  item.id === exp.id ? { ...item, end: e.target.value } : item
                                );
                                saveCVState({ ...cvState, experiences: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.bullets}
                            </label>
                            <button
                              onClick={() => triggerAiBulletsImprove(exp.id)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              {t.actions.improveWithAi}
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={exp.bullets}
                            placeholder={t.editor.bulletsPh}
                            onChange={(e) => {
                              const updated = cvState.experiences.map(item =>
                                item.id === exp.id ? { ...item, bullets: e.target.value } : item
                              );
                              saveCVState({ ...cvState, experiences: updated });
                            }}
                            className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs leading-relaxed outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic profile / Education */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {t.editor.education}
                    </h3>
                    <button
                      onClick={() => {
                        const newEdu: Education = {
                          id: `edu-${Date.now()}`,
                          degree: "",
                          school: "",
                          year: "",
                          grade: ""
                        };
                        saveCVState({ ...cvState, educations: [...cvState.educations, newEdu] });
                      }}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.actions.add}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cvState.educations.map((edu) => (
                      <div
                        key={edu.id}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 relative animate-fadeIn"
                      >
                        <button
                          onClick={() => {
                            const filtered = cvState.educations.filter(e => e.id !== edu.id);
                            saveCVState({ ...cvState, educations: filtered });
                          }}
                          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.degree}
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              placeholder="ex: Master Informatique"
                              onChange={(e) => {
                                const updated = cvState.educations.map(item =>
                                  item.id === edu.id ? { ...item, degree: e.target.value } : item
                                );
                                saveCVState({ ...cvState, educations: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.school}
                            </label>
                            <input
                              type="text"
                              value={edu.school}
                              placeholder="ex: Université Paris-Saclay"
                              onChange={(e) => {
                                const updated = cvState.educations.map(item =>
                                  item.id === edu.id ? { ...item, school: e.target.value } : item
                                );
                                saveCVState({ ...cvState, educations: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.year}
                            </label>
                            <input
                              type="text"
                              value={edu.year}
                              placeholder="ex: 2018 - 2020"
                              onChange={(e) => {
                                const updated = cvState.educations.map(item =>
                                  item.id === edu.id ? { ...item, year: e.target.value } : item
                                );
                                saveCVState({ ...cvState, educations: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.grade}
                            </label>
                            <input
                              type="text"
                              value={edu.grade}
                              placeholder="ex: Mention Bien"
                              onChange={(e) => {
                                const updated = cvState.educations.map(item =>
                                  item.id === edu.id ? { ...item, grade: e.target.value } : item
                                );
                                saveCVState({ ...cvState, educations: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {t.editor.skills}
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillIn}
                      placeholder={t.editor.skillsPh}
                      onChange={(e) => setSkillIn(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (skillIn.trim()) {
                            const arr = skillIn.split(",").map(x => x.trim()).filter(Boolean);
                            const updated = [...cvState.skills];
                            arr.forEach(s => {
                              if (!updated.includes(s)) updated.push(s);
                            });
                            saveCVState({ ...cvState, skills: updated });
                            setSkillIn("");
                          }
                        }
                      }}
                      className="flex-1 bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs font-medium transition outline-none"
                    />
                    <button
                      onClick={() => {
                        if (skillIn.trim()) {
                          const arr = skillIn.split(",").map(x => x.trim()).filter(Boolean);
                          const updated = [...cvState.skills];
                          arr.forEach(s => {
                            if (!updated.includes(s)) updated.push(s);
                          });
                          saveCVState({ ...cvState, skills: updated });
                          setSkillIn("");
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
                    >
                      {t.actions.add}
                    </button>
                  </div>

                  {/* Smart Suggestions Panel */}
                  {suggestedSkills.length > 0 && (
                    <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl p-3 space-y-2 animate-fadeIn transition-colors">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                        {lang === "fr" 
                          ? `💡 SUGGESTIONS POUR : ${cvState.jobTitle || "Votre profil"}`
                          : `💡 SUGGESTIONS FOR: ${cvState.jobTitle || "Your profile"}`}
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto scrollbar-none">
                        {suggestedSkills.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white text-slate-700 dark:text-slate-300 border border-indigo-100 dark:border-slate-700 hover:border-transparent dark:hover:border-transparent px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <span className="text-indigo-500 dark:text-indigo-400 group-hover:text-white font-bold">+</span>
                            <span>{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {cvState.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-slate-50 text-slate-700 border border-slate-200 rounded-lg pl-3 pr-2 py-1 text-xs font-semibold flex items-center gap-1.5 hover:border-indigo-300 hover:text-indigo-600 transition"
                      >
                        {skill}
                        <button
                          onClick={() => {
                            const filtered = cvState.skills.filter((_, idx) => idx !== sIdx);
                            saveCVState({ ...cvState, skills: filtered });
                          }}
                          className="text-slate-400 hover:text-rose-500 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {t.editor.languages}
                    </h3>
                    <button
                      onClick={() => {
                        const newLang: LanguageItem = {
                          id: `lang-${Date.now()}`,
                          name: "",
                          level: "Courant (C1/C2)"
                        };
                        saveCVState({ ...cvState, languages: [...cvState.languages, newLang] });
                      }}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.actions.add}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cvState.languages.map((lang) => (
                      <div key={lang.id} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={lang.name}
                          placeholder="Français, Anglais..."
                          onChange={(e) => {
                            const updated = cvState.languages.map(item =>
                              item.id === lang.id ? { ...item, name: e.target.value } : item
                            );
                            saveCVState({ ...cvState, languages: updated });
                          }}
                          className="flex-1 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                        />
                        <select
                          value={lang.level}
                          onChange={(e) => {
                            const updated = cvState.languages.map(item =>
                              item.id === lang.id ? { ...item, level: e.target.value } : item
                            );
                            saveCVState({ ...cvState, languages: updated });
                          }}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none"
                        >
                          <option value="Langue maternelle">Maternelle</option>
                          <option value="Bilingue">Bilingue</option>
                          <option value="Courant (C1/C2)">Courant (C1/C2)</option>
                          <option value="Avancé (B2)">Avancé (B2)</option>
                          <option value="Intermédiaire (B1)">Intermédiaire</option>
                          <option value="Débutant (A1/A2)">Débutant</option>
                        </select>
                        <button
                          onClick={() => {
                            const filtered = cvState.languages.filter(l => l.id !== lang.id);
                            saveCVState({ ...cvState, languages: filtered });
                          }}
                          className="text-slate-400 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {t.editor.projects}
                    </h3>
                    <button
                      onClick={() => {
                        const newProj: Project = {
                          id: `proj-${Date.now()}`,
                          name: "",
                          url: "",
                          desc: ""
                        };
                        saveCVState({ ...cvState, projects: [...cvState.projects, newProj] });
                      }}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.actions.add}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cvState.projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 relative"
                      >
                        <button
                          onClick={() => {
                            const filtered = cvState.projects.filter(p => p.id !== proj.id);
                            saveCVState({ ...cvState, projects: filtered });
                          }}
                          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.projectName}
                            </label>
                            <input
                              type="text"
                              value={proj.name}
                              placeholder="ex: Portfolio AI"
                              onChange={(e) => {
                                const updated = cvState.projects.map(item =>
                                  item.id === proj.id ? { ...item, name: e.target.value } : item
                                );
                                saveCVState({ ...cvState, projects: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">
                              {t.editor.projectUrl}
                            </label>
                            <input
                              type="text"
                              value={proj.url}
                              placeholder="github.com/..."
                              onChange={(e) => {
                                const updated = cvState.projects.map(item =>
                                  item.id === proj.id ? { ...item, url: e.target.value } : item
                                );
                                saveCVState({ ...cvState, projects: updated });
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={proj.desc}
                            placeholder="Application web innovante développée avec..."
                            onChange={(e) => {
                              const updated = cvState.projects.map(item =>
                                item.id === proj.id ? { ...item, desc: e.target.value } : item
                              );
                              saveCVState({ ...cvState, projects: updated });
                            }}
                            className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="space-y-4 font-sans">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {t.editor.certifications}
                    </h3>
                    <button
                      onClick={() => {
                        const newCert: Certification = {
                          id: `cert-${Date.now()}`,
                          name: "",
                          issuer: "",
                          year: ""
                        };
                        saveCVState({ ...cvState, certifications: [...cvState.certifications, newCert] });
                      }}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.actions.add}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cvState.certifications.map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-3 gap-3 relative"
                      >
                        <button
                          onClick={() => {
                            const filtered = cvState.certifications.filter(item => item.id !== c.id);
                            saveCVState({ ...cvState, certifications: filtered });
                          }}
                          className="absolute -top-1 -right-1 p-2 text-slate-400 hover:text-rose-500 transition"
                        >
                          ×
                        </button>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">
                            {t.editor.certName}
                          </label>
                          <input
                            type="text"
                            value={c.name}
                            placeholder="AWS, GCP..."
                            onChange={(e) => {
                              const updated = cvState.certifications.map(item =>
                                item.id === c.id ? { ...item, name: e.target.value } : item
                              );
                              saveCVState({ ...cvState, certifications: updated });
                            }}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">
                            {t.editor.certIssuer}
                          </label>
                          <input
                            type="text"
                            value={c.issuer}
                            placeholder="Amazon..."
                            onChange={(e) => {
                              const updated = cvState.certifications.map(item =>
                                item.id === c.id ? { ...item, issuer: e.target.value } : item
                              );
                              saveCVState({ ...cvState, certifications: updated });
                            }}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">
                            Année
                          </label>
                          <input
                            type="text"
                            value={c.year}
                            placeholder="2024"
                            onChange={(e) => {
                              const updated = cvState.certifications.map(item =>
                                item.id === c.id ? { ...item, year: e.target.value } : item
                              );
                              saveCVState({ ...cvState, certifications: updated });
                            }}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* References Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t.editor.references}
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <input
                        id="show-references-checkbox"
                        type="checkbox"
                        checked={!!cvState.showReferences}
                        onChange={(e) => saveCVState({ ...cvState, showReferences: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="show-references-checkbox" className="text-xs font-semibold text-slate-700">
                        {t.editor.referencesLabel}
                      </label>
                    </div>
                    {cvState.showReferences && (
                      <div className="flex flex-col gap-1.5">
                        <input
                          type="text"
                          value={cvState.references || ""}
                          placeholder={t.editor.referencesPh}
                          onChange={(e) => saveCVState({ ...cvState, references: e.target.value })}
                          className="bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs font-semibold"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )
            )}

            {/* TAB 2: JOB MATCH ANALYZER */}
            {activeTab === "analyzer" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {t.analyzer.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {t.analyzer.desc}
                  </p>
                </div>

                {/* Section d'importation par lien */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-indigo-500" />
                    {lang === "fr" ? "Ajouter l'offre d'emploi via un lien" : "Add job offer via link"}
                  </label>
                  <p className="text-[11px] text-slate-400">
                    {lang === "fr" 
                      ? "Collez l'adresse d'une offre d'emploi en ligne pour l'analyser et l'extraire instantanément avec l'IA."
                      : "Paste the URL of an online job posting to extract and analyze it instantly with AI."}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={jobDescUrl}
                      onChange={(e) => setJobDescUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs font-semibold outline-none transition"
                    />
                    <button
                      onClick={scrapeJobDescription}
                      disabled={isScrapingJob || !jobDescUrl.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0"
                    >
                      {isScrapingJob ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{lang === "fr" ? "Charger" : "Load"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <textarea
                    rows={8}
                    value={jobDescText}
                    onChange={(e) => setJobDescText(e.target.value)}
                    placeholder={t.analyzer.ph}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl p-4 text-xs font-medium transition leading-relaxed outline-none resize-none"
                  />
                </div>

                <button
                  onClick={analyzeJobDescription}
                  disabled={isAnalyzingJob}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-100 transition flex items-center justify-center gap-2"
                >
                  {isAnalyzingJob ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t.actions.loading}
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      {t.analyzer.btn}
                    </>
                  )}
                </button>

                {/* Banner de génération automatique en cours */}
                {(isGeneratingCover || isGeneratingInterview) && (
                  <div className="bg-indigo-50/50 border border-indigo-100/80 rounded-2xl p-4 flex items-start gap-3.5 animate-pulse">
                    <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
                        {lang === "fr" ? "Production automatique en cours" : "Auto-generation in progress"}
                      </h4>
                      <p className="text-[11px] text-indigo-600 font-medium leading-relaxed">
                        {lang === "fr"
                          ? "L'IA produit actuellement votre lettre de motivation personnalisée et vos questions d'entretien d'embauche en s'appuyant sur le CV et l'offre d'emploi !"
                          : "AI is currently producing your personalized cover letter and job interview questions based on your CV and the offer!"}
                      </p>
                      <div className="flex gap-4 mt-2">
                        {isGeneratingCover && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-500">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            {lang === "fr" ? "Lettre de Motivation..." : "Cover Letter..."}
                          </span>
                        )}
                        {isGeneratingInterview && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-500">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            {lang === "fr" ? "Questions d'Entretien..." : "Interview Prep..."}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {jobAnalysis ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 border-t border-slate-100 pt-6"
                    >
                      {/* Overall matching score dial bar */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {t.analyzer.matchScore}
                          </h4>
                          <span className="text-4xl font-black text-indigo-600 mt-1 block">
                            {jobAnalysis.matchScore}%
                          </span>
                        </div>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden shrink-0">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${jobAnalysis.matchScore}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Validated keywords */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {t.analyzer.foundKw} ({jobAnalysis.foundKeywords.length})
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {jobAnalysis.foundKeywords.map((kw, idx) => (
                            <span
                              key={idx}
                              className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg px-2.5 py-1 text-xs font-bold"
                            >
                              ✓ {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing keywords */}
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {t.analyzer.missingKw} ({jobAnalysis.missingKeywords.length})
                          </h4>
                          {jobAnalysis.missingKeywords.length > 0 && (
                            <button
                              onClick={autoAddKeywordsToCV}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                            >
                              {t.analyzer.autoAdd}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {jobAnalysis.missingKeywords.map((kw, idx) => (
                            <span
                              key={idx}
                              className="bg-rose-50 text-rose-600 border border-rose-100 rounded-lg px-2.5 py-1 text-xs font-bold"
                            >
                              ✗ {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations details */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {t.analyzer.recs}
                        </h4>
                        <ul className="space-y-2">
                          {jobAnalysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex gap-2 text-xs text-slate-600 leading-relaxed font-medium">
                              <span className="text-indigo-600 font-extrabold shrink-0">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    !isAnalyzingJob && (
                      <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 font-medium">
                        {t.analyzer.noResults}
                      </div>
                    )
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB 3: COVER LETTER */}
            {activeTab === "cover" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {t.cover.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Rédigez une candidature sur-mesure d'exception qui s'adapte à votre profil actuel en un clic.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {t.cover.company}
                    </label>
                    <input
                      type="text"
                      value={coverCompany}
                      onChange={(e) => setCoverCompany(e.target.value)}
                      placeholder="ex: Google"
                      className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {t.cover.role}
                    </label>
                    <input
                      type="text"
                      value={coverRole}
                      onChange={(e) => setCoverRole(e.target.value)}
                      placeholder="ex: Développeur React"
                      className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {t.cover.why}
                  </label>
                  <textarea
                    rows={3}
                    value={coverWhy}
                    onChange={(e) => setCoverWhy(e.target.value)}
                    placeholder={t.cover.whyPh}
                    className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3 text-xs outline-none transition leading-relaxed resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {t.cover.tone}
                  </label>
                  <select
                    value={coverTone}
                    onChange={(e: any) => setCoverTone(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                  >
                    <option value="professional">{t.cover.tones.professional}</option>
                    <option value="dynamic">{t.cover.tones.dynamic}</option>
                    <option value="creative">{t.cover.tones.creative}</option>
                    <option value="concise">{t.cover.tones.concise}</option>
                  </select>
                </div>

                <motion.button
                  animate={isGeneratingCover ? {
                    scale: [1, 1.015, 1],
                    opacity: [1, 0.8, 1]
                  } : {}}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  onClick={generateCoverLetterText}
                  disabled={isGeneratingCover}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition flex items-center justify-center gap-2"
                >
                  {isGeneratingCover ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t.actions.generating}
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      {t.cover.btn}
                    </>
                  )}
                </motion.button>

                {coverLetter && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                        Résultat
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(coverLetter);
                            showNotification(t.actions.copied);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
                        >
                          <Clipboard className="w-3.5 h-3.5" />
                          {t.cover.copy}
                        </button>
                        <span className="text-slate-200">|</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={exportCoverLetterPDF}
                            className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-rose-600 hover:border-rose-200 transition uppercase tracking-wider"
                            title={lang === "fr" ? "Télécharger en PDF" : "Download as PDF"}
                          >
                            <FileText className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={exportCoverLetterWord}
                            className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-blue-600 hover:border-blue-200 transition uppercase tracking-wider"
                            title={lang === "fr" ? "Télécharger en Word (.doc)" : "Download as Word (.doc)"}
                          >
                            <File className="w-3 h-3" />
                            <span>Word</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div id="cover-letter-container" className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs text-slate-700 leading-relaxed font-serif whitespace-pre-wrap shadow-inner h-96 overflow-y-auto">
                      {coverLetter}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* TAB 4: INTERVIEW PREP */}
            {activeTab === "interview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {t.interview.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {t.interview.desc}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {t.interview.role}
                  </label>
                  <input
                    type="text"
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    placeholder="ex: Développeur Senior React"
                    className="bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition"
                  />
                </div>

                <button
                  onClick={generateInterviewQuestions}
                  disabled={isGeneratingInterview}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isGeneratingInterview ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t.actions.generating}
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4" />
                      {t.interview.btn}
                    </>
                  )}
                </button>

                <div className="space-y-4">
                  {interviewQs.map((q, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2.5"
                    >
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          q.type === "technical"
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            : q.type === "behavioral"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {q.type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">
                        {q.question}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        <strong className="text-indigo-600">{t.interview.tip}</strong> {q.tip}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: SALARY ESTIMATOR */}
            {activeTab === "salary" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {t.salary.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Comparez les tendances salariales du marché actuel selon votre spécialisation, localisation et niveau de séniorité.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {t.salary.role}
                    </label>
                    <input
                      type="text"
                      value={salaryRole}
                      onChange={(e) => setSalaryRole(e.target.value)}
                      placeholder="ex: Architecte Logiciel"
                      className="bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {t.salary.exp}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={salaryExp}
                      onChange={(e) => setSalaryExp(Number(e.target.value))}
                      className="bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {t.salary.city}
                    </label>
                    <select
                      value={salaryCity}
                      onChange={(e) => setSalaryCity(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value="paris">Paris, FR</option>
                      <option value="lyon">Lyon, FR</option>
                      <option value="bordeaux">Bordeaux, FR</option>
                      <option value="marseille">Marseille, FR</option>
                      <option value="remote">Télétravail (Remote)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {t.salary.sector}
                    </label>
                    <select
                      value={salarySector}
                      onChange={(e) => setSalarySector(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value="tech">{t.salary.sectors.tech}</option>
                      <option value="finance">{t.salary.sectors.finance}</option>
                      <option value="marketing">{t.salary.sectors.marketing}</option>
                      <option value="health">{t.salary.sectors.health}</option>
                      <option value="education">{t.salary.sectors.education}</option>
                      <option value="industry">{t.salary.sectors.industry}</option>
                    </select>
                  </div>
                </div>

                {/* Live salary display */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block mb-1">
                      {t.salary.estimate}
                    </span>
                    <h2 className="text-2xl font-black text-indigo-200">
                      {getEstimatedSalary().min.toLocaleString()} € – {getEstimatedSalary().max.toLocaleString()} €
                    </h2>
                  </div>
                  <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">{t.salary.median} :</span>
                    <span className="font-extrabold text-emerald-400 text-sm">
                      {getEstimatedSalary().median.toLocaleString()} €
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t.salary.factors}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Expérience (+{salaryExp} ans)</span>
                      <span className="text-indigo-600 font-bold">+{ (salaryExp * 1800).toLocaleString() } € / an</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Secteur ({salarySector})</span>
                      <span className="text-indigo-600 font-bold">Standard</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Zone géographique ({salaryCity})</span>
                      <span className="text-indigo-600 font-bold">
                        {salaryCity === "paris" ? "+15%" : salaryCity === "remote" ? "+5%" : "-5 à -8%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: RECRUITER SPACE */}
            {activeTab === "recruiter" && (
              <div className="space-y-6">
                {/* Header card banner */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden flex flex-wrap items-center justify-between gap-3">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="space-y-1 max-w-xl">
                    <h3 className="text-base font-extrabold text-indigo-100 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-400" />
                      {t.recruiter.title}
                    </h3>
                    <p className="text-xs text-indigo-200 mt-1 leading-relaxed font-medium">
                      {t.recruiter.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowSavedReportsModal(true)}
                    className="inline-flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-100 text-xs font-extrabold px-3.5 py-2 rounded-xl border border-indigo-400/30 transition cursor-pointer shadow-xs active:scale-95 shrink-0"
                  >
                    <History className="w-4 h-4 text-indigo-300" />
                    <span>{lang === "fr" ? "Historique des Rapports" : "Reports History"} ({savedRecruiterReports.length})</span>
                  </button>
                </div>

                {/* Steps indicators */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-extrabold uppercase tracking-wide">
                  <div className={`p-2.5 rounded-lg border ${recruiterJobDesc ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                    {t.recruiter.steps.one}
                  </div>
                  <div className={`p-2.5 rounded-lg border ${recruiterCandidates.length > 0 ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                    {t.recruiter.steps.two}
                  </div>
                  <div className={`p-2.5 rounded-lg border ${recruiterResults ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                    {t.recruiter.steps.three}
                  </div>
                </div>

                {/* Job description upload & link section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      {t.recruiter.steps.one}
                    </h4>
                    {recruiterJobDesc.trim().length > 0 && (
                      <button
                        onClick={downloadRecruiterJobOffer}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800"
                        title={lang === "fr" ? "Télécharger la fiche de poste" : "Download job offer file"}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === "fr" ? "Télécharger l'offre" : "Download offer"}</span>
                      </button>
                    )}
                  </div>

                  {/* Drag and Drop / File upload zone or Loaded State */}
                  {!recruiterJobDesc.trim() ? (
                    <div className="space-y-3">
                      {/* Drag & Drop Upload Zone */}
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingJobFile(true);
                        }}
                        onDragLeave={() => setIsDraggingJobFile(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingJobFile(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleRecruiterJobFileUpload(file);
                        }}
                        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2.5 ${
                          isDraggingJobFile
                            ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 scale-[1.01]"
                            : "border-indigo-200 hover:border-indigo-400 bg-gradient-to-b from-indigo-50/30 via-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900"
                        }`}
                      >
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleRecruiterJobFileUpload(f);
                          }}
                        />
                        {isUploadingRecruiterJob ? (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                            <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                              {lang === "fr" ? "Lecture et extraction de la fiche de poste..." : "Reading and extracting job description..."}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {lang === "fr" 
                                  ? "Glissez-déposez ou cliquez pour importer votre offre d'emploi" 
                                  : "Drag & drop or click to upload job description file"}
                              </p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                {lang === "fr"
                                  ? "Formats acceptés : PDF, Word (.docx) ou Fichier Texte (.txt)"
                                  : "Supported formats: PDF, Word (.docx) or Text (.txt)"}
                              </p>
                            </div>
                          </>
                        )}
                      </label>

                      {/* URL Import Bar Alternative */}
                      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                          {lang === "fr" ? "Ou téléchargez l'offre depuis un lien web" : "Or load job offer from web link"}
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={recruiterJobUrlInput}
                            onChange={(e) => setRecruiterJobUrlInput(e.target.value)}
                            placeholder="https://linkedIn.com/jobs/... ou https://..."
                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                          />
                          <button
                            onClick={handleScrapeRecruiterJobUrl}
                            disabled={isScrapingRecruiterJobUrl || !recruiterJobUrlInput.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0"
                          >
                            {isScrapingRecruiterJobUrl ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            <span>{lang === "fr" ? "Télécharger" : "Fetch"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Manual paste fallback drawer toggle */}
                      <div className="text-center">
                        <button
                          onClick={() => setRecruiterJobDesc(" ")}
                          className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2 transition cursor-pointer"
                        >
                          {lang === "fr" ? "Saisir ou coller le texte manuellement" : "Enter or paste text manually"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Loaded Job Offer Summary Card */
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-3 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 dark:border-emerald-800/30 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                              {recruiterJobFile?.name || (lang === "fr" ? "Fiche de poste téléversée" : "Job offer loaded")}
                            </span>
                            <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400 font-semibold block mt-0.5">
                              {recruiterJobFile?.size ? `${Math.round(recruiterJobFile.size / 1024)} KB • ` : ""}
                              {recruiterJobDesc.trim().split(/\s+/).length} {lang === "fr" ? "mots extraits" : "words extracted"} ({recruiterJobDesc.length} {lang === "fr" ? "caractères" : "chars"})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowRecruiterJobPreview(!showRecruiterJobPreview)}
                            className="bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>
                              {showRecruiterJobPreview 
                                ? (lang === "fr" ? "Masquer l'éditeur" : "Hide editor")
                                : (lang === "fr" ? "Voir / Éditer" : "View / Edit")}
                            </span>
                          </button>

                          <button
                            onClick={downloadRecruiterJobOffer}
                            className="bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                            title={lang === "fr" ? "Télécharger l'offre en fichier texte" : "Download offer as text file"}
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{lang === "fr" ? "Télécharger" : "Download"}</span>
                          </button>

                          <label className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs">
                            <input
                              type="file"
                              accept=".pdf,.docx,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleRecruiterJobFileUpload(f);
                              }}
                            />
                            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lang === "fr" ? "Remplacer" : "Replace"}</span>
                          </label>

                          <button
                            onClick={() => {
                              setRecruiterJobDesc("");
                              setRecruiterJobFile(null);
                              setShowRecruiterJobPreview(false);
                            }}
                            className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition p-1.5 rounded-lg cursor-pointer"
                            title={lang === "fr" ? "Supprimer l'offre" : "Remove job offer"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expandable preview / editor if recruiter wants to inspect or edit */}
                      {showRecruiterJobPreview ? (
                        <div className="space-y-2 pt-1 animate-fadeIn">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                            {lang === "fr" ? "Contenu extrait de la fiche de poste :" : "Extracted job description text:"}
                          </label>
                          <textarea
                            rows={6}
                            value={recruiterJobDesc}
                            onChange={(e) => {
                              setRecruiterJobDesc(e.target.value);
                              if (recruiterJobFile) {
                                setRecruiterJobFile({
                                  ...recruiterJobFile,
                                  charCount: e.target.value.length
                                });
                              }
                            }}
                            className="w-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs font-medium leading-relaxed outline-none focus:ring-2 focus:ring-emerald-300"
                          />
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic px-1">
                          "{recruiterJobDesc.trim().slice(0, 180)}..."
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Candidates adding block */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      {t.recruiter.steps.two}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 transition cursor-pointer shadow-xs">
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadSingleDocCandidate(f);
                          }}
                        />
                        <Plus className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === "fr" ? "🎯 Document Unique (Nouveau)" : "🎯 Single Document (New)"}</span>
                      </label>

                      <button
                        onClick={addRecruiterCandidate}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition"
                      >
                        <Plus className="w-4 h-4" />
                        {t.recruiter.addCandidate}
                      </button>
                    </div>
                  </div>

                  {recruiterCandidates.length > 0 && (
                    <div className="flex justify-between items-center bg-slate-100/50 p-2 rounded-xl border border-slate-200/60 text-xs font-medium gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRecruiterShowFavoritesOnly(!recruiterShowFavoritesOnly)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                            recruiterShowFavoritesOnly 
                              ? "bg-amber-100 text-amber-800 border border-amber-200" 
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${recruiterShowFavoritesOnly ? "fill-amber-400 text-amber-500" : "text-slate-400"}`} />
                          <span>{t.recruiter.favoritesOnly}</span>
                        </button>

                        <button
                          onClick={downloadCandidatesZip}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-all border border-transparent"
                          title={t.recruiter.downloadZipTooltip}
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{t.recruiter.downloadZip}</span>
                        </button>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1 shrink-0">
                        {recruiterCandidates.filter(c => c.isFavorite).length} ★ / {recruiterCandidates.length} cand.
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {recruiterCandidates.filter(cand => !recruiterShowFavoritesOnly || cand.isFavorite).length === 0 && recruiterShowFavoritesOnly && (
                      <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-medium">
                        {lang === "fr" ? "Aucun candidat marqué en favori." : "No candidates marked as favorite."}
                      </div>
                    )}

                    {recruiterCandidates
                      .filter(cand => !recruiterShowFavoritesOnly || cand.isFavorite)
                      .map((cand) => (
                        <div
                          key={cand.id}
                          className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5 relative"
                        >
                          <button
                            onClick={() => {
                              setRecruiterCandidates(prev => prev.filter(c => c.id !== cand.id));
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 font-bold"
                          >
                            ×
                          </button>

                          <button
                            onClick={() => {
                              setRecruiterCandidates(prev => prev.map(c => 
                                c.id === cand.id ? { ...c, isFavorite: !c.isFavorite } : c
                              ));
                            }}
                            className="absolute top-4 right-10 text-slate-400 hover:text-amber-500 transition-colors"
                            title={t.recruiter.toggleFavorite}
                          >
                            <Star className={`w-4 h-4 ${cand.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                          </button>

                          <div className="flex flex-wrap items-center justify-between gap-2 pr-16 border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                            <div className="flex gap-2.5 items-center flex-1 min-w-[160px]">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                                {cand.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={cand.name}
                                  onChange={(e) => {
                                    setRecruiterCandidates(prev => prev.map(item =>
                                      item.id === cand.id ? { ...item, name: e.target.value } : item
                                    ));
                                  }}
                                  className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 font-bold text-xs text-slate-800 dark:text-slate-200 outline-none w-full py-0.5"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => analyzeSingleCandidate(cand)}
                              disabled={analyzingCandId === cand.id}
                              className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl transition shadow-2xs ${
                                cand.score !== undefined
                                  ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95"
                              }`}
                              title={lang === "fr" ? "Lancer une analyse rapide de compatibilité avec l'offre d'emploi" : "Analyze candidate fit with the job offer"}
                            >
                              {analyzingCandId === cand.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                                  <span>{lang === "fr" ? "Analyse..." : "Analyzing..."}</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
                                  <span>{cand.score !== undefined ? (lang === "fr" ? "Ré-analyser" : "Re-analyze") : (lang === "fr" ? "Analyser le candidat" : "Analyze candidate")}</span>
                                </>
                              )}
                            </button>
                          </div>

                        {/* Candidate Document Chips & Interactive Inspector */}
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                            {/* CV Chip */}
                            <div className="flex items-center">
                              <label className={`cursor-pointer border-y border-l rounded-l-xl px-2.5 py-1.5 flex items-center gap-1 transition ${
                                cand.cvText?.trim() 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" 
                                  : "bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                              }`}>
                                <input
                                  type="file"
                                  accept=".pdf,.docx,.txt"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleRecruiterCandidateDoc(cand.id, "cv", f);
                                  }}
                                />
                                <span>📄 CV {cand.cvText?.trim() ? "✓" : "+"}</span>
                              </label>
                              <button
                                onClick={() => {
                                  setExpandedCandDocs(prev => ({ ...prev, [cand.id]: prev[cand.id] === "cv" ? null : "cv" }));
                                }}
                                className={`border px-2 py-1.5 rounded-r-xl transition text-[10px] ${
                                  expandedCandDocs[cand.id] === "cv"
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                }`}
                                title={lang === "fr" ? "Voir/Éditer le CV complet" : "View/Edit full CV"}
                              >
                                {expandedCandDocs[cand.id] === "cv" ? "▲" : "👁️"}
                              </button>
                            </div>

                            {/* Lettre Chip */}
                            <div className="flex items-center">
                              <label className={`cursor-pointer border-y border-l rounded-l-xl px-2.5 py-1.5 flex items-center gap-1 transition ${
                                cand.coverText?.trim() 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" 
                                  : "bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                              }`}>
                                <input
                                  type="file"
                                  accept=".pdf,.docx,.txt"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleRecruiterCandidateDoc(cand.id, "cover", f);
                                  }}
                                />
                                <span>📝 Lettre {cand.coverText?.trim() ? "✓" : "+"}</span>
                              </label>
                              <button
                                onClick={() => {
                                  setExpandedCandDocs(prev => ({ ...prev, [cand.id]: prev[cand.id] === "cover" ? null : "cover" }));
                                }}
                                className={`border px-2 py-1.5 rounded-r-xl transition text-[10px] ${
                                  expandedCandDocs[cand.id] === "cover"
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                }`}
                                title={lang === "fr" ? "Voir/Éditer la lettre complète" : "View/Edit full cover letter"}
                              >
                                {expandedCandDocs[cand.id] === "cover" ? "▲" : "👁️"}
                              </button>
                            </div>

                            {/* Autre Document Chip */}
                            <div className="flex items-center">
                              <label className={`cursor-pointer border-y border-l rounded-l-xl px-2.5 py-1.5 flex items-center gap-1 transition ${
                                cand.otherText?.trim() 
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800 font-extrabold" 
                                  : "bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                              }`}>
                                <input
                                  type="file"
                                  accept=".pdf,.docx,.txt"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleRecruiterCandidateDoc(cand.id, "other", f);
                                  }}
                                />
                                <span>📎 Autre doc {cand.otherText?.trim() ? "✓" : "+"}</span>
                              </label>
                              <button
                                onClick={() => {
                                  setExpandedCandDocs(prev => ({ ...prev, [cand.id]: prev[cand.id] === "other" ? null : "other" }));
                                }}
                                className={`border px-2 py-1.5 rounded-r-xl transition text-[10px] font-bold ${
                                  expandedCandDocs[cand.id] === "other"
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                }`}
                                title={lang === "fr" ? "Ouvrir l'inspecteur de document complémentaire (Portfolio, Certificats...)" : "Open additional document inspector"}
                              >
                                {expandedCandDocs[cand.id] === "other" ? "▲" : "👁️"}
                              </button>
                            </div>

                            {/* Document Unique Chip */}
                            <div className="flex items-center">
                              <label className={`cursor-pointer border-y border-l rounded-l-xl px-2.5 py-1.5 flex items-center gap-1 transition ${
                                (cand.uniqueText?.trim() || cand.filesLoaded?.unique) 
                                  ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700 font-black shadow-xs" 
                                  : "bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-bold"
                              }`}>
                                <input
                                  type="file"
                                  accept=".pdf,.docx,.txt"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleRecruiterCandidateDoc(cand.id, "unique", f);
                                  }}
                                />
                                <span>🎯 Document Unique {(cand.uniqueText?.trim() || cand.filesLoaded?.unique) ? "✓" : "+"}</span>
                              </label>
                              <button
                                onClick={() => {
                                  setExpandedCandDocs(prev => ({ ...prev, [cand.id]: prev[cand.id] === "unique" ? null : "unique" }));
                                }}
                                className={`border px-2 py-1.5 rounded-r-xl transition text-[10px] font-bold ${
                                  expandedCandDocs[cand.id] === "unique"
                                    ? "bg-amber-600 text-white border-amber-600"
                                    : "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200 dark:bg-amber-900/60 dark:border-amber-700 dark:text-amber-200"
                                }`}
                                title={lang === "fr" ? "Voir/Éditer le Document Unique (CV + Lettre + Annexes)" : "View/Edit candidate Single Document"}
                              >
                                {expandedCandDocs[cand.id] === "unique" ? "▲" : "👁️"}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Document Inspector Panel */}
                          {expandedCandDocs[cand.id] && (
                            <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-xs transition-all animate-fadeIn">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                                    {expandedCandDocs[cand.id] === "cv" ? "📄" : expandedCandDocs[cand.id] === "cover" ? "📝" : expandedCandDocs[cand.id] === "unique" ? "🎯" : "📎"}
                                  </span>
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                      {expandedCandDocs[cand.id] === "cv"
                                        ? (lang === "fr" ? "Curriculum Vitae (CV)" : "Full Resume / CV")
                                        : expandedCandDocs[cand.id] === "cover"
                                        ? (lang === "fr" ? "Lettre de motivation" : "Full Cover Letter")
                                        : expandedCandDocs[cand.id] === "unique"
                                        ? (lang === "fr" ? "Document Unique de Candidature (CV + Lettre + Annexes)" : "Candidate Single Document (CV + Cover + Attachments)")
                                        : (lang === "fr" ? "Autre Document Complet (Portfolio, Recommandation, Certificat...)" : "Full Additional Document (Portfolio, References, Certificates...)")}
                                    </h5>
                                    <span className="text-[10px] text-slate-400 font-semibold block">
                                      {getDocText(cand, expandedCandDocs[cand.id]!).trim().length > 0
                                        ? `${getDocText(cand, expandedCandDocs[cand.id]!).trim().split(/\s+/).length} ${lang === "fr" ? "mots" : "words"} • ${getDocText(cand, expandedCandDocs[cand.id]!).length} ${lang === "fr" ? "caractères" : "chars"}`
                                        : (lang === "fr" ? "Aucun document actuellement chargé." : "No document loaded yet.")}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <button
                                    onClick={() => downloadCandidateSingleDoc(cand)}
                                    className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                                    title={lang === "fr" ? "Télécharger TOUT le dossier candidat en un seul Document Unique" : "Download ENTIRE candidate files as a Single Document"}
                                  >
                                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>{lang === "fr" ? "🎯 Document Unique" : "🎯 Single Document"}</span>
                                  </button>

                                  {getDocText(cand, expandedCandDocs[cand.id]!).trim().length > 0 && (
                                    <button
                                      onClick={() => downloadCandidateDoc(cand.name, expandedCandDocs[cand.id]!, getDocText(cand, expandedCandDocs[cand.id]!))}
                                      className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                                      title={lang === "fr" ? "Télécharger le document actif au format texte" : "Download active document as text"}
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>{lang === "fr" ? "Télécharger doc" : "Download doc"}</span>
                                    </button>
                                  )}

                                  <label className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer">
                                    <input
                                      type="file"
                                      accept=".pdf,.docx,.txt"
                                      className="hidden"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleRecruiterCandidateDoc(cand.id, expandedCandDocs[cand.id]!, f, true);
                                      }}
                                    />
                                    <Plus className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>
                                      {getDocText(cand, expandedCandDocs[cand.id]!).trim().length > 0 
                                        ? (lang === "fr" ? "+ En ajouter un autre" : "+ Append doc") 
                                        : (lang === "fr" ? "Importer document" : "Upload document")}
                                    </span>
                                  </label>

                                  {getDocText(cand, expandedCandDocs[cand.id]!).trim().length > 0 && (
                                    <button
                                      onClick={() => {
                                        setRecruiterCandidates(prev => prev.map(c => {
                                          if (c.id === cand.id) {
                                            const docType = expandedCandDocs[cand.id]!;
                                            const files = { ...c.filesLoaded, [docType]: false };
                                            if (docType === "cv") return { ...c, cvText: "", filesLoaded: files };
                                            if (docType === "cover") return { ...c, coverText: "", filesLoaded: files };
                                            if (docType === "unique") return { ...c, uniqueText: "", filesLoaded: files };
                                            return { ...c, otherText: "", filesLoaded: files };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="text-slate-400 hover:text-rose-500 text-[11px] font-bold p-1 rounded transition"
                                      title={lang === "fr" ? "Effacer ce document" : "Clear this document"}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <button
                                    onClick={() => setExpandedCandDocs(prev => ({ ...prev, [cand.id]: null }))}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xs px-1.5"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              {getDocText(cand, expandedCandDocs[cand.id]!).trim().length === 0 ? (
                                <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-400 rounded-xl p-4 text-center block cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
                                  <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    className="hidden"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleRecruiterCandidateDoc(cand.id, expandedCandDocs[cand.id]!, f);
                                    }}
                                  />
                                  <UploadCloud className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                                    {lang === "fr" ? "Glissez-déposez ou cliquez pour charger ce document" : "Drag & drop or click to upload document"}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                    {lang === "fr" ? "Formats pris en charge : PDF, Word (.docx) ou Texte (.txt)" : "Supported: PDF, Word (.docx), TXT"}
                                  </span>
                                </label>
                              ) : (
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <span>{lang === "fr" ? "Contenu extrait du document :" : "Extracted document content:"}</span>
                                    <span>{lang === "fr" ? "Éditable directement" : "Editable"}</span>
                                  </div>
                                  <textarea
                                    rows={7}
                                    value={getDocText(cand, expandedCandDocs[cand.id]!)}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setRecruiterCandidates(prev => prev.map(c => {
                                        if (c.id === cand.id) {
                                          const docType = expandedCandDocs[cand.id]!;
                                          const files = { ...c.filesLoaded, [docType]: val.trim().length > 0 };
                                          if (docType === "cv") return { ...c, cvText: val, filesLoaded: files };
                                          if (docType === "cover") return { ...c, coverText: val, filesLoaded: files };
                                          if (docType === "unique") return { ...c, uniqueText: val, cvText: c.cvText || val, otherText: c.otherText || val, filesLoaded: files };
                                          return { ...c, otherText: val, filesLoaded: files };
                                        }
                                        return c;
                                      }));
                                    }}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono leading-relaxed outline-none focus:ring-2 focus:ring-indigo-400"
                                    placeholder={lang === "fr" ? "Collez ou visualisez ici l'intégralité du document..." : "Paste or view the full document text here..."}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Candidate result preview when computed */}
                        {cand.score !== undefined && (
                          <div className="border-t border-slate-200/60 dark:border-slate-800 pt-3 space-y-3 animate-fadeIn">
                            {/* Score, Decision, Age, Location */}
                            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Score Match :</span>
                                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{cand.score}%</span>
                                </div>
                                {cand.age && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                    🎂 {cand.age}
                                  </span>
                                )}
                                {cand.location && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                    📍 {cand.location}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                cand.decision === "Entretien" ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800" :
                                cand.decision === "À étudier" ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800" :
                                "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                              }`}>
                                {cand.decision}
                              </span>
                            </div>

                            {/* Justification */}
                            {cand.justification && (
                              <p className="text-[11px] text-slate-700 dark:text-slate-200 font-medium bg-indigo-50/50 dark:bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 leading-snug">
                                💡 <strong>Avis IA :</strong> {cand.justification}
                              </p>
                            )}

                            {/* Points Forts & Points Faibles */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                              {/* Strengths */}
                              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                                <span className="font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                                  💪 Points Forts :
                                </span>
                                <div className="space-y-0.5 text-emerald-900 dark:text-emerald-200 font-medium">
                                  {(cand.strengths || cand.matchedKeywords || []).slice(0, 4).map((s, idx) => (
                                    <div key={idx} className="flex items-start gap-1">
                                      <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">✓</span>
                                      <span>{s}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Weaknesses */}
                              <div className="bg-rose-50/60 dark:bg-rose-950/20 p-2 rounded-xl border border-rose-200/60 dark:border-rose-900/40 space-y-1">
                                <span className="font-extrabold text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
                                  ⚠️ Axes de Vigilance :
                                </span>
                                <div className="space-y-0.5 text-rose-900 dark:text-rose-200 font-medium">
                                  {(cand.weaknesses || cand.missingKeywords || []).slice(0, 3).map((w, idx) => (
                                    <div key={idx} className="flex items-start gap-1">
                                      <span className="text-rose-600 dark:text-rose-400 shrink-0 font-bold">✗</span>
                                      <span>{w}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Recruiter Comments */}
                            {cand.recruiterComments && (
                              <div className="bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                                <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-300 block">
                                  💬 Commentaires & Recommandations Recruteur :
                                </span>
                                <p className="leading-snug font-medium">
                                  {cand.recruiterComments}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recruiter Evaluation Run */}
                <motion.button
                  animate={isRecruiterAnalyzing ? {
                    scale: [1, 1.015, 1],
                    opacity: [1, 0.8, 1]
                  } : {}}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  onClick={runRecruiterEvaluation}
                  disabled={isRecruiterAnalyzing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isRecruiterAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Evaluation IA en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {t.recruiter.btn}
                    </>
                  )}
                </motion.button>

                {/* Final Rankings Leaderboard */}
                <AnimatePresence>
                  {recruiterResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 border-t border-slate-100 pt-6"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            {t.recruiter.leaderboard}
                          </h3>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {lang === "fr" ? "Téléchargez les résultats du classement dans le format souhaité :" : "Download ranking results in your preferred format:"}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                          {/* Save to Local Storage */}
                          <button
                            onClick={() => handleSaveCurrentRecruiterReport()}
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                            title={lang === "fr" ? "Sauvegarder la session de recrutement dans l'historique local" : "Save recruitment session to local history"}
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === "fr" ? "Sauvegarder" : "Save"}</span>
                          </button>

                          {/* Dedicated HR Notes & Comments Export Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setShowHrNotesExportMenu(!showHrNotesExportMenu)}
                              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95 border border-amber-400"
                              title={lang === "fr" ? "Exporter uniquement les notes et commentaires RH de tous les candidats au format PDF, Word ou Excel" : "Export HR notes and comments only for all candidates in PDF, Word, or Excel"}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{lang === "fr" ? "📝 Exporter Notes RH" : "📝 Export HR Notes"}</span>
                              <ChevronDown className="w-3 h-3 text-amber-100" />
                            </button>

                            {showHrNotesExportMenu && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setShowHrNotesExportMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-fadeIn">
                                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/60 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{lang === "fr" ? "Notes & Commentaires RH Uniquement" : "HR Notes & Comments Only"}</span>
                                  </div>

                                  <button
                                    onClick={() => {
                                      downloadHrNotesPdf();
                                      setShowHrNotesExportMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-300 transition text-left cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <div>
                                      <div className="font-bold">{lang === "fr" ? "Format PDF (Notes RH)" : "PDF Format (HR Notes)"}</div>
                                      <div className="text-[10px] text-slate-400 font-normal">{lang === "fr" ? "Mise en page PDF imprimable dédiée" : "Dedicated printable PDF layout"}</div>
                                    </div>
                                  </button>

                                  <button
                                    onClick={() => {
                                      downloadHrNotesDocx();
                                      setShowHrNotesExportMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-300 transition text-left cursor-pointer"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <div>
                                      <div className="font-bold">{lang === "fr" ? "Format Word (.docx / Notes RH)" : "Word Format (.docx / HR Notes)"}</div>
                                      <div className="text-[10px] text-slate-400 font-normal">{lang === "fr" ? "Document Word rééditable" : "Editable Word document"}</div>
                                    </div>
                                  </button>

                                  <button
                                    onClick={() => {
                                      downloadHrNotesExcel();
                                      setShowHrNotesExportMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-300 transition text-left cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <div>
                                      <div className="font-bold">{lang === "fr" ? "Format Excel (.csv / Notes RH)" : "Excel Format (.csv / HR Notes)"}</div>
                                      <div className="text-[10px] text-slate-400 font-normal">{lang === "fr" ? "Tableau filtrable par colonnes" : "Column-based spreadsheet"}</div>
                                    </div>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

                          <span className="text-[10px] font-extrabold uppercase text-slate-400 hidden lg:inline">
                            {lang === "fr" ? "Rapport Complet :" : "Full Report:"}
                          </span>

                          {/* Word Export Full Report */}
                          <button
                            onClick={downloadRecruiterReportDocx}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                            title={lang === "fr" ? "Exporter le rapport complet en document Word (.docx)" : "Export full report to Word (.docx)"}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Word</span>
                          </button>

                          {/* Excel Export Full Report */}
                          <button
                            onClick={downloadRecruiterReportExcel}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                            title={lang === "fr" ? "Exporter le tableau complet de classement en Excel (.csv)" : "Export full candidate table to Excel (.csv)"}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Excel</span>
                          </button>

                          {/* PDF Export Full Report */}
                          <button
                            onClick={downloadRecruiterReportPdf}
                            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                            title={lang === "fr" ? "Imprimer le rapport complet ou enregistrer au format PDF" : "Print full report or save as PDF"}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>

                          {/* Markdown Export */}
                          <button
                            onClick={downloadRecruiterReport}
                            className="inline-flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                            title={lang === "fr" ? "Exporter le rapport au format Markdown (.md)" : "Export full report to Markdown (.md)"}
                          >
                            <File className="w-3.5 h-3.5" />
                            <span>.md</span>
                          </button>
                        </div>
                      </div>

                      {/* Display sorted candidate leaderboard cards with filtering toolbar */}
                      <div className="space-y-4">
                        {(() => {
                          const overallSorted = [...recruiterCandidates]
                            .filter(c => c.score !== undefined)
                            .sort((a, b) => (b.score || 0) - (a.score || 0));
                          
                          const filteredSorted = overallSorted.filter(c => {
                            const matchesFavorites = !recruiterShowFavoritesOnly || c.isFavorite;
                            const matchesMinScore = (c.score || 0) >= recruiterMinScoreFilter;
                            return matchesFavorites && matchesMinScore;
                          });

                          return (
                            <>
                              {/* Filter Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                <div className="flex flex-wrap items-center gap-3">
                                  {/* Score ATS Dropdown Filter */}
                                  <div className="flex items-center gap-2">
                                    <Filter className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                      {lang === "fr" ? "Score ATS min :" : "Min ATS Score:"}
                                    </span>
                                    <select
                                      value={recruiterMinScoreFilter}
                                      onChange={(e) => setRecruiterMinScoreFilter(Number(e.target.value))}
                                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer shadow-2xs"
                                    >
                                      <option value={0}>{lang === "fr" ? "Tous les scores (0%+)" : "All scores (0%+)"}</option>
                                      <option value={50}>Score &gt; 50%</option>
                                      <option value={60}>Score &gt; 60%</option>
                                      <option value={70}>Score &gt; 70%</option>
                                      <option value={80}>Score &gt; 80%</option>
                                      <option value={90}>Score &gt; 90%</option>
                                    </select>
                                  </div>

                                  {/* Favorites Toggle */}
                                  <button
                                    onClick={() => setRecruiterShowFavoritesOnly(!recruiterShowFavoritesOnly)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                      recruiterShowFavoritesOnly 
                                        ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800 shadow-2xs" 
                                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    }`}
                                  >
                                    <Star className={`w-3.5 h-3.5 ${recruiterShowFavoritesOnly ? "fill-amber-400 text-amber-500" : "text-slate-400"}`} />
                                    <span>{t.recruiter.favoritesOnly}</span>
                                  </button>
                                </div>

                                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                  <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                                    {filteredSorted.length} / {overallSorted.length} {lang === "fr" ? "candidat(s)" : "candidate(s)"}
                                  </span>
                                </div>
                              </div>

                              {/* Candidate cards list or empty state */}
                              {filteredSorted.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 dark:text-slate-400 font-medium space-y-1">
                                  <p className="font-bold">
                                    {lang === "fr" ? "Aucun candidat ne correspond aux filtres." : "No candidate matches the current filters."}
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    {lang === "fr" 
                                      ? `Score minimum : ${recruiterMinScoreFilter}% ${recruiterShowFavoritesOnly ? "• Uniquement favoris" : ""}`
                                      : `Minimum score: ${recruiterMinScoreFilter}% ${recruiterShowFavoritesOnly ? "• Favorites only" : ""}`}
                                  </p>
                                </div>
                              ) : (
                                filteredSorted.map((cand) => {
                                  const overallIdx = overallSorted.findIndex(c => c.id === cand.id);
                                  return (
                                    <div key={cand.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 shadow-xs relative hover:border-indigo-300 dark:hover:border-indigo-700 transition">
                                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                                        overallIdx === 0 ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-xs" :
                                        overallIdx === 1 ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700" :
                                        overallIdx === 2 ? "bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700" :
                                        "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                                      }`}>
                                        #{overallIdx + 1}
                                      </div>

                                      <div className="flex-1 space-y-3">
                                        {/* Header info */}
                                        <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <h5 className="font-black text-sm text-slate-800 dark:text-slate-100">{cand.name}</h5>
                                              <button
                                                onClick={() => {
                                                  setRecruiterCandidates(prev => prev.map(c => 
                                                    c.id === cand.id ? { ...c, isFavorite: !c.isFavorite } : c
                                                  ));
                                                }}
                                                className="text-slate-400 hover:text-amber-500 transition-colors"
                                                title={t.recruiter.toggleFavorite}
                                              >
                                                <Star className={`w-4 h-4 ${cand.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                                              </button>
                                            </div>

                                            {/* Age and Location badges */}
                                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                              {cand.age && (
                                                <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                  🎂 {cand.age}
                                                </span>
                                              )}
                                              {cand.location && (
                                                <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                  📍 {cand.location}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <div className="text-right">
                                              <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Score Match</span>
                                              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{cand.score}%</span>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                              cand.decision === "Entretien" ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800" :
                                              cand.decision === "À étudier" ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800" :
                                              "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                                            }`}>
                                              {cand.decision}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Justification summary */}
                                        {cand.justification && (
                                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-medium bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            💡 <strong>Synthèse IA :</strong> {cand.justification}
                                          </p>
                                        )}

                                        {/* Points Forts & Points Faibles */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                                          {/* Strengths */}
                                          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                                            <span className="font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                                              💪 Points Forts :
                                            </span>
                                            <div className="space-y-0.5 text-emerald-900 dark:text-emerald-200 font-medium">
                                              {(cand.strengths || cand.matchedKeywords || []).slice(0, 4).map((s, idx) => (
                                                <div key={idx} className="flex items-start gap-1">
                                                  <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">✓</span>
                                                  <span>{s}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Weaknesses */}
                                          <div className="bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded-xl border border-rose-100 dark:border-rose-900/40 space-y-1">
                                            <span className="font-extrabold text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
                                              ⚠️ Points de Vigilance :
                                            </span>
                                            <div className="space-y-0.5 text-rose-900 dark:text-rose-200 font-medium">
                                              {(cand.weaknesses || cand.missingKeywords || []).slice(0, 3).map((w, idx) => (
                                                <div key={idx} className="flex items-start gap-1">
                                                  <span className="text-rose-600 dark:text-rose-400 shrink-0 font-bold">✗</span>
                                                  <span>{w}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Recruiter Comments */}
                                        {cand.recruiterComments && (
                                          <div className="bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                                            <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-300 block">
                                              💬 Commentaires & Conseils pour l'Entretien :
                                            </span>
                                            <p className="leading-snug font-medium">
                                              {cand.recruiterComments}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </>
                          );
                        })()}
                      </div>

                      {/* Global recruitment report in Markdown */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 h-80 overflow-y-auto">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Rapport IA de Synthèse Recruteur
                        </h4>
                        <div className="text-[11px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap font-mono">
                          {recruiterResults.recruiterReport}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT PREVIEW PANEL (Desktop layout) */}
        <section className="hidden md:flex flex-1 bg-slate-100/50 flex-col overflow-y-auto p-6 md:p-8 justify-start items-center">
          <div className="w-full max-w-[210mm] flex flex-col items-center gap-6">
            <div className="flex flex-wrap gap-2.5 justify-center items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Modèle de CV :
              </span>
              <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                {(["classic", "modern", "creative", "executive"] as const).map((tpl) => (
                  <button
                    key={tpl}
                    onClick={() => setTemplate(tpl)}
                    className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all ${
                      template === tpl
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tpl === "classic" ? "📋 Classique" : tpl === "modern" ? "🎨 Moderne" : tpl === "creative" ? "✨ Créatif" : "👔 Exécutif"}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={exportCVPDF}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold text-[10px] uppercase px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
                  title={lang === "fr" ? "Télécharger le CV au format PDF" : "Download CV as PDF"}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={exportCVWord}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 font-bold text-[10px] uppercase px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
                  title={lang === "fr" ? "Télécharger le CV au format Word (.doc)" : "Download CV as Word (.doc)"}
                >
                  <File className="w-3.5 h-3.5" />
                  <span>Word</span>
                </button>
                <button
                  onClick={generateShareLink}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 font-bold text-[10px] uppercase px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
                  title={t.recruiter.shareBtnTooltip}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{t.recruiter.shareBtn}</span>
                </button>
              </div>
            </div>

            <div id="cv-preview-container" className="w-full">
              <CVPreview state={cvState} template={template} lang={lang} />
            </div>
          </div>
        </section>
      </main>

      {/* ─── MODAL IMPORT CV ─── */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImportModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setShowImportModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ×
              </button>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-800">
                  {t.modal.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {t.modal.sub}
                </p>
              </div>

              {/* Drag & drop file selection zone */}
              <label className="border-2 border-dashed border-indigo-100 bg-indigo-50/10 hover:bg-indigo-50/25 cursor-pointer rounded-2xl p-8 flex flex-col items-center justify-center text-center transition">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  {t.modal.drop}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  {t.modal.dropSub}
                </p>
              </label>

              {/* Loader progress */}
              {isParsing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-indigo-600">
                    <span>{t.modal.progress}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-2/3 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}

              {/* Parse Extracted Result Options Grid */}
              {parsedData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold px-3 py-2 rounded-xl">
                    {t.modal.extracted}
                  </div>

                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    {t.modal.options}
                  </h4>

                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      onClick={() => applyImport("fill")}
                      className="text-left bg-slate-50 border border-slate-200 hover:border-indigo-500 rounded-xl p-3.5 transition"
                    >
                      <strong className="text-xs text-slate-800 block">{t.modal.fill}</strong>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">{t.modal.fillDesc}</span>
                    </button>
                    <button
                      onClick={() => applyImport("summary")}
                      className="text-left bg-slate-50 border border-slate-200 hover:border-indigo-500 rounded-xl p-3.5 transition"
                    >
                      <strong className="text-xs text-slate-800 block">{t.modal.summary}</strong>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">{t.modal.summaryDesc}</span>
                    </button>
                    <button
                      onClick={() => applyImport("bullets")}
                      className="text-left bg-slate-50 border border-slate-200 hover:border-indigo-500 rounded-xl p-3.5 transition"
                    >
                      <strong className="text-xs text-slate-800 block">{t.modal.bullets}</strong>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">{t.modal.bulletsDesc}</span>
                    </button>
                    <button
                      onClick={() => applyImport("full")}
                      className="text-left bg-indigo-50 border border-indigo-200 hover:border-indigo-500 rounded-xl p-3.5 transition"
                    >
                      <strong className="text-xs text-indigo-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {t.modal.full}
                      </strong>
                      <span className="text-[10px] text-indigo-600/70 font-medium mt-0.5 block">{t.modal.fullDesc}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL HISTORIQUE DES RAPPORTS DE RECRUTEMENT (localStorage) ─── */}
      <AnimatePresence>
        {showSavedReportsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-indigo-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      {lang === "fr" ? "Historique des Rapports de Recrutement" : "Saved Recruitment Reports History"}
                    </h3>
                    <p className="text-xs text-indigo-200/80 font-medium">
                      {lang === "fr"
                        ? `${savedRecruiterReports.length} procès-verbal(aux) conservé(s) localement`
                        : `${savedRecruiterReports.length} report(s) saved locally`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSavedReportsModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                {savedRecruiterReports.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={savedReportSearchQuery}
                          onChange={(e) => setSavedReportSearchQuery(e.target.value)}
                          placeholder={lang === "fr" ? "Rechercher par poste, date ou candidat..." : "Search by job, date or candidate..."}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        onClick={handleClearAllSavedReports}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-2 rounded-xl transition border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === "fr" ? "Tout effacer" : "Clear All"}</span>
                      </button>
                    </div>

                    {/* List of saved reports */}
                    <div className="space-y-3 pt-1">
                      {savedRecruiterReports
                        .filter(r => {
                          if (!savedReportSearchQuery.trim()) return true;
                          const q = savedReportSearchQuery.toLowerCase();
                          const matchTitle = r.title.toLowerCase().includes(q);
                          const matchDate = r.date.toLowerCase().includes(q);
                          const matchCand = r.candidates.some(c => c.name.toLowerCase().includes(q));
                          return matchTitle || matchDate || matchCand;
                        })
                        .map((report) => (
                          <div
                            key={report.id}
                            className="bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 transition-all space-y-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="space-y-1 max-w-[70%]">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {report.date}
                                  </span>
                                  {report.jobFile && (
                                    <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                      {report.jobFile.name}
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
                                  {report.title}
                                </h4>

                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                                  "{report.jobDescription.trim().slice(0, 110)}..."
                                </p>
                              </div>

                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl shadow-2xs">
                                  👥 {report.candidateCount} {lang === "fr" ? "candidat(s)" : "candidate(s)"}
                                </span>
                                {report.topCandidateName && (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg">
                                    🏆 Top: {report.topCandidateName} ({report.topCandidateScore}%)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Candidate chips */}
                            <div className="flex items-center gap-1.5 flex-wrap border-t border-slate-200/50 dark:border-slate-700/50 pt-2 text-[11px]">
                              <span className="font-bold text-slate-400">Candidats :</span>
                              {report.candidates.slice(0, 5).map(c => (
                                <span
                                  key={c.id}
                                  className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium"
                                >
                                  {c.name} {c.score !== undefined ? `(${c.score}%)` : ""}
                                </span>
                              ))}
                              {report.candidates.length > 5 && (
                                <span className="text-slate-400 font-bold">+{report.candidates.length - 5}</span>
                              )}
                            </div>

                            {/* Actions bar */}
                            <div className="flex items-center justify-end gap-2 border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
                              <button
                                onClick={() => handleLoadSavedRecruiterReport(report)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <FolderOpen className="w-3.5 h-3.5" />
                                <span>{lang === "fr" ? "Restaurer la Session" : "Load Session"}</span>
                              </button>

                              <button
                                onClick={() => handleDeleteSavedRecruiterReport(report.id, report.title)}
                                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                title={lang === "fr" ? "Supprimer" : "Delete"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {lang === "fr" ? "Aucun rapport sauvegardé" : "No saved reports"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
                      {lang === "fr"
                        ? "Chaque fois que vous effectuez une analyse de classement dans l'Espace Recruteur, le rapport est automatiquement enregistré ici dans localStorage."
                        : "Whenever you run a ranking analysis in the Recruiter Space, the report is automatically saved here in localStorage."}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  💡 {lang === "fr" ? "Sauvegarde locale automatique dans votre navigateur" : "Automatic local save in your browser"}
                </span>
                <button
                  onClick={() => setShowSavedReportsModal(false)}
                  className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold px-4 py-1.5 rounded-xl transition cursor-pointer"
                >
                  {lang === "fr" ? "Fermer" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-6 md:px-8 text-[10px] text-slate-400 font-semibold z-30 shrink-0">
        <div className="flex gap-4">
          <span>{t.appTitle} Matchmaker v2.4</span>
          <span>© 2026 Google AI Studio</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-600">Assistance</a>
          <a href="#" className="hover:text-slate-600">Confidentialité</a>
        </div>
      </footer>
    </div>
  );
}
