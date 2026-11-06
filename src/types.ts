export type SupportedLanguage = 
  | "fr" | "en" | "de" | "es" | "zh" | "ar" 
  | "it" | "pt" | "nl" | "pl" | "ja" | "ko" | "ru" | "hi" | "tr";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

export interface Experience {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  bullets: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
  grade: string;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  desc: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface CandidateCVState {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: LanguageItem[];
  references?: string;
  showReferences?: boolean;
}

export interface JobAnalysisResult {
  matchScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface CoverLetterParams {
  companyName: string;
  targetRole: string;
  whyCompany: string;
  tone: "professional" | "dynamic" | "creative" | "concise";
}

export interface InterviewQuestion {
  question: string;
  type: "behavioral" | "technical" | "motivation";
  tip: string;
}

export interface RecruiterCandidate {
  id: string;
  name: string;
  cvText: string;
  coverText: string;
  otherText: string;
  uniqueText?: string;
  score?: number;
  decision?: "Entretien" | "À étudier" | "Non retenu";
  matchedKeywords?: string[];
  missingKeywords?: string[];
  justification?: string;
  age?: string;
  location?: string;
  strengths?: string[];
  weaknesses?: string[];
  recruiterComments?: string;
  isFavorite?: boolean;
  filesLoaded: {
    cv: boolean;
    cover: boolean;
    other: boolean;
    unique?: boolean;
  };
}

export interface RecruiterRankingResult {
  rankings: {
    id: number | string;
    score: number;
    decision: "Entretien" | "À étudier" | "Non retenu";
    matchedKeywords: string[];
    missingKeywords: string[];
    justification: string;
    age?: string;
    location?: string;
    strengths?: string[];
    weaknesses?: string[];
    recruiterComments?: string;
  }[];
  recruiterReport: string;
}

export interface SavedRecruiterReport {
  id: string;
  date: string;
  title: string;
  jobDescription: string;
  jobFile?: { name: string; size: number; charCount: number; isUrl?: boolean } | null;
  candidates: RecruiterCandidate[];
  results: RecruiterRankingResult | null;
  candidateCount: number;
  topCandidateName?: string;
  topCandidateScore?: number;
}
