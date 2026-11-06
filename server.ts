import express from "express";
import path from "path";
import dns from "dns/promises";
import net from "net";
import dotenv from "dotenv";
import { generateText, generateJSON, S, isAiConfigured, AiUnavailableError, AiRefusalError, CLAUDE_MODEL } from "./server/ai";
import { requireAccess, accessStatus, validatePass, PassError } from "./server/access";

dotenv.config({ path: [".env.local", ".env"] });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.set("trust proxy", 1); // derrière Render / un proxy : req.ip = vraie IP du visiteur
app.disable("x-powered-by");
app.use(express.json({ limit: "4mb" }));

// En-têtes de sécurité de base
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

// ─── LANGUES ───
const LANGUAGE_NAMES: Record<string, string> = {
  fr: "French", en: "English", de: "German", es: "Spanish", it: "Italian", pt: "Portuguese",
  nl: "Dutch", pl: "Polish", zh: "Simplified Chinese", ja: "Japanese", ko: "Korean",
  ar: "Arabic", ru: "Russian", hi: "Hindi", tr: "Turkish",
};
function getLanguageName(code: string = "fr"): string {
  return LANGUAGE_NAMES[code] || LANGUAGE_NAMES[String(code).toLowerCase()] || "French";
}

// Limite la taille des textes envoyés à l'IA (coût maîtrisé, pas de troncature silencieuse : on refuse).
const MAX_CHARS = 60_000;
function text(v: unknown, label: string, required = false): string {
  const s = typeof v === "string" ? v : v == null ? "" : String(v);
  if (required && !s.trim()) throw new HttpError(400, `${label} est requis.`);
  if (s.length > MAX_CHARS) throw new HttpError(413, `${label} est trop long (${s.length} caractères, maximum ${MAX_CHARS}).`);
  return s;
}
function list(v: unknown): string {
  return Array.isArray(v) ? v.map(String).join(", ") : "";
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Enveloppe chaque route IA : contrôle d'accès, gestion d'erreurs claire.
type Handler = (req: express.Request) => Promise<unknown>;
function aiRoute(handler: Handler) {
  return [
    requireAccess(),
    async (req: express.Request, res: express.Response) => {
      try {
        res.json(await handler(req));
      } catch (error: any) {
        if (error instanceof HttpError) {
          res.status(error.status).json({ error: error.message });
          return;
        }
        if (error instanceof AiRefusalError) {
          res.status(422).json({ error: error.message });
          return;
        }
        if (error instanceof AiUnavailableError) {
          res.status(503).json({ error: "Le service IA n'est pas configuré. Contactez l'administrateur." });
          return;
        }
        console.error("[ai] erreur:", error?.status || "", error?.message);
        const status = error?.status === 429 ? 503 : 502;
        res.status(status).json({ error: "Le service IA est momentanément indisponible. Réessayez dans un instant." });
      }
    },
  ];
}

// ─── SCHÉMAS ───
const experienceSchema = (withId: boolean) =>
  S.obj({
    ...(withId ? { id: S.str() } : {}),
    role: S.str("Intitulé du poste"),
    company: S.str("Nom de l'entreprise"),
    start: S.str("Date de début, ex : Janvier 2021"),
    end: S.str("Date de fin, ex : Présent ou Décembre 2023"),
    bullets: S.str("Réalisations, une par ligne, chacune commençant par '• '"),
  });
const educationSchema = (withId: boolean) =>
  S.obj({ ...(withId ? { id: S.str() } : {}), degree: S.str(), school: S.str(), year: S.str(), grade: S.str() });
const projectSchema = (withId: boolean) =>
  S.obj({ ...(withId ? { id: S.str() } : {}), name: S.str(), url: S.str(), desc: S.str() });
const certSchema = (withId: boolean) =>
  S.obj({ ...(withId ? { id: S.str() } : {}), name: S.str(), issuer: S.str(), year: S.str() });
const langSchema = (withId: boolean) =>
  S.obj({ ...(withId ? { id: S.str() } : {}), name: S.str(), level: S.str() });

const cvSchema = (withId: boolean) =>
  S.obj({
    name: S.str("Prénom et nom"),
    jobTitle: S.str("Intitulé du poste recherché ou profil actuel"),
    email: S.str(),
    phone: S.str(),
    location: S.str("Ville et pays"),
    linkedin: S.str("Lien LinkedIn ou portfolio"),
    summary: S.str("Résumé professionnel"),
    skills: S.arr(S.str()),
    experiences: S.arr(experienceSchema(withId)),
    educations: S.arr(educationSchema(withId)),
    projects: S.arr(projectSchema(withId)),
    certifications: S.arr(certSchema(withId)),
    languages: S.arr(langSchema(withId)),
  });

// Règle d'honnêteté appliquée à toutes les rédactions
const HONESTY =
  "Never invent facts, employers, degrees, dates, figures, tools or skills. Only use information given by the candidate, and do not overstate their level (no \"expert\" unless they said so). " +
  "When a number would strengthen a sentence but none was given, insert a placeholder in square brackets such as [X %] or [nombre] so the candidate fills in the real value.";

// ─── ACCÈS / PASS ───
app.get("/api/access/status", (req, res) => {
  res.json({ ...accessStatus(req), aiReady: isAiConfigured() });
});

app.post("/api/access/activate", async (req, res) => {
  try {
    const info = await validatePass(req.body?.key, req.header("x-device-id") || undefined);
    res.json({ ok: true, pass: { maskedKey: info.maskedKey, productName: info.productName, customerName: info.customerName, expiresAt: info.expiresAt } });
  } catch (e: any) {
    res.status(e instanceof PassError ? e.status : 500).json({ error: e.message || "Activation impossible." });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, model: CLAUDE_MODEL, aiReady: isAiConfigured() }));

// ─── RÉCUPÉRATION D'UNE OFFRE D'EMPLOI PAR URL ───
async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new HttpError(400, "Lien invalide.");
  }
  if (!["http:", "https:"].includes(url.protocol)) throw new HttpError(400, "Seuls les liens http(s) sont acceptés.");
  const host = url.hostname;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) throw new HttpError(400, "Lien non autorisé.");
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) throw new HttpError(400, "Site introuvable.");
  for (const { address } of addrs) {
    if (isPrivateIp(address)) throw new HttpError(400, "Lien non autorisé.");
  }
  return url;
}
function isPrivateIp(ip: string): boolean {
  if (net.isIPv6(ip)) {
    const l = ip.toLowerCase();
    if (l.startsWith("::ffff:")) return isPrivateIp(l.slice(7));
    return l === "::1" || l === "::" || l.startsWith("fc") || l.startsWith("fd") || l.startsWith("fe80");
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

app.post(
  "/api/scrape-job",
  ...aiRoute(async (req) => {
    const url = await assertPublicUrl(text(req.body?.url, "L'URL", true));
    const lang = getLanguageName(req.body?.language);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    let html: string;
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ResumeAIPro/1.0)", Accept: "text/html" },
      });
      if (response.status >= 300 && response.status < 400) throw new HttpError(400, "Ce lien redirige ailleurs. Copiez directement le texte de l'offre.");
      if (!response.ok) throw new HttpError(400, `Impossible de lire la page (code ${response.status}). Copiez le texte de l'offre.`);
      html = (await response.text()).slice(0, 2_000_000);
    } catch (e: any) {
      if (e instanceof HttpError) throw e;
      throw new HttpError(400, "Impossible de récupérer cette page. Copiez le texte de l'offre à la place.");
    } finally {
      clearTimeout(timer);
    }
    const cleanText = html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 30_000);
    if (cleanText.length < 200) throw new HttpError(400, "La page ne contient pas assez de texte (site protégé ?). Copiez le texte de l'offre.");

    const out = await generateText({
      system: "You are an expert recruiter. You extract job postings from raw web page text, clearly and faithfully.",
      prompt: `Below is the raw text of a web page containing a job posting. Extract the official job description and rewrite it in a clean structure: job title, company, location, main duties, requirements/skills, benefits/conditions (if present), application deadline (if present). Do not add anything that is not in the page. Write in ${lang}.\n\n<page>\n${cleanText}\n</page>`,
      maxTokens: 4000,
    });
    return { text: out };
  }),
);

// 1. Import d'un CV texte → données structurées
app.post(
  "/api/ai/parse-resume",
  ...aiRoute(async (req) => {
    const cv = text(req.body?.text, "Le texte du CV", true);
    return generateJSON(
      {
        system: "You are an ATS resume parser. Extract the resume data exactly as written. Leave a field as an empty string or empty array when the information is missing. Never invent data.",
        prompt: `Extract all structured information from this resume. Keep the original language and meaning. Put each achievement of an experience on its own line starting with '• '.\n\n<resume>\n${cv}\n</resume>`,
        maxTokens: 8000,
      },
      cvSchema(false),
    );
  }),
);

// 2. Résumé professionnel
app.post(
  "/api/ai/improve-summary",
  ...aiRoute(async (req) => {
    const { jobTitle, skills, summary, language = "fr" } = req.body || {};
    const lang = getLanguageName(language);
    const out = await generateText({
      system: `You are an expert in professional branding and resumes. ${HONESTY}`,
      prompt: `Write an impactful, modern, ATS-friendly professional summary in ${lang}.
Job title: ${text(jobTitle, "Le poste") || "not specified"}
Key skills: ${list(skills) || "not specified"}
Candidate's current text (may be empty): ${text(summary, "Le résumé")}

Write one fluid paragraph of 3 to 4 sentences, results-oriented, without heavy pronouns. Return only the paragraph.`,
      maxTokens: 1500,
    });
    return { text: out };
  }),
);

// 3. Puces d'expérience
app.post(
  "/api/ai/improve-bullets",
  ...aiRoute(async (req) => {
    const { role, company, bullets, language = "fr" } = req.body || {};
    const lang = getLanguageName(language);
    const out = await generateText({
      system: `You are an elite recruitment consultant who writes high-impact resume bullet points. ${HONESTY}`,
      prompt: `Rewrite the achievement bullet points below for the role "${text(role, "Le poste")}" at "${text(company, "L'entreprise") || "the company"}", in ${lang}.
<bullets>
${text(bullets, "Les réalisations") || "(no bullets given: write 3 typical duties for this role, without figures, using [X] placeholders where a result should go)"}
</bullets>

Rules:
- Start each bullet with a strong action verb.
- Make each bullet result-oriented and concrete.
- Keep every real figure the candidate gave; never invent new ones (use placeholders like [X %]).
- Return only the bullets, one per line, each starting with '• '.`,
      maxTokens: 2000,
    });
    return { text: out };
  }),
);

// 4. Analyse CV / offre
app.post(
  "/api/ai/analyze-job",
  ...aiRoute(async (req) => {
    const cvText = text(req.body?.cvText, "Le CV", true);
    const jobDescription = text(req.body?.jobDescription, "L'offre d'emploi", true);
    const lang = getLanguageName(req.body?.language);
    return generateJSON(
      {
        system: "You are an advanced ATS and senior recruiter. Compare resumes with job postings objectively.",
        prompt: `Compare this resume with the job posting. Write all text in ${lang}.
<resume>
${cvText}
</resume>
<job_posting>
${jobDescription}
</job_posting>

Return:
- matchScore: overall fit from 0 to 100, based on required skills and experience;
- foundKeywords: key skills/keywords from the posting present in the resume;
- missingKeywords: key skills/keywords from the posting absent from the resume;
- recommendations: 3 to 5 concrete changes to the resume to pass ATS filters (only suggest adding skills the candidate may really have).`,
        maxTokens: 3000,
      },
      S.obj({
        matchScore: S.int("0 à 100"),
        foundKeywords: S.arr(S.str()),
        missingKeywords: S.arr(S.str()),
        recommendations: S.arr(S.str()),
      }),
    );
  }),
);

// 5. Lettre de motivation
app.post(
  "/api/ai/generate-cover",
  ...aiRoute(async (req) => {
    const { name, jobTitle, skills, companyName, targetRole, whyCompany, tone, cvSummary, language = "fr", jobDescription } = req.body || {};
    const lang = getLanguageName(language);
    const toneGuide: Record<string, string> = {
      professional: "formal and structured, respecting classic conventions",
      dynamic: "energetic, focused on challenges and fast learning",
      creative: "original and narrative, showing personality",
      concise: "short and direct, but impactful",
    };
    const jd = text(jobDescription, "L'offre d'emploi");
    const out = await generateText({
      system: `You are an expert career coach who writes cover letters that get interviews. ${HONESTY}`,
      prompt: `Write a personalized cover letter in ${lang}.
Target role: ${text(targetRole, "Le poste") || text(jobTitle, "Le poste") || "the advertised position"}
Company: ${text(companyName, "L'entreprise") || "[Nom de l'entreprise]"}
Why this company (from the candidate): ${text(whyCompany, "La motivation") || "not specified"}
Tone: ${toneGuide[tone] || toneGuide.professional}

Candidate:
Name: ${text(name, "Le nom") || "[Votre nom]"}
Profile: ${text(cvSummary, "Le profil") || "not specified"}
Key skills: ${list(skills) || "not specified"}
${jd ? `\nTailor the letter to this job posting:\n<job_posting>\n${jd}\n</job_posting>` : ""}

Structure: header with placeholders for contact details, subject line, catchy introduction about the company, the candidate's value for this need, proposal to meet, polite closing. About 300 words. Return only the letter text.`,
      maxTokens: 3000,
    });
    return { text: out };
  }),
);

// 6. Préparation d'entretien
app.post(
  "/api/ai/generate-interview",
  ...aiRoute(async (req) => {
    const { targetRole, cvSummary, skills, language = "fr", jobDescription } = req.body || {};
    const lang = getLanguageName(language);
    const jd = text(jobDescription, "L'offre d'emploi");
    const result = await generateJSON<{ questions: unknown[] }>(
      {
        system: "You are an interview coach and former senior recruiter.",
        prompt: `Prepare personalized interview questions for the role "${text(targetRole, "Le poste") || "the position"}". Write everything in ${lang}.
Candidate skills: ${list(skills) || "not specified"}
Profile: ${text(cvSummary, "Le profil") || "not specified"}
${jd ? `Job posting:\n<job_posting>\n${jd}\n</job_posting>` : ""}

Generate exactly 8 questions: 3 of type "behavioral", 3 of type "technical" (specific to the role), 2 of type "motivation".
For each, give an expert tip on how to answer well (STAR method, examples to give, pitfalls to avoid).`,
        maxTokens: 5000,
      },
      S.obj({
        questions: S.arr(
          S.obj({
            question: S.str(),
            type: { type: "string", enum: ["behavioral", "technical", "motivation"] },
            tip: S.str(),
          }),
        ),
      }),
    );
    return result.questions;
  }),
);

// 7. Espace recruteur : classement de candidats
app.post(
  "/api/ai/rank-candidates",
  ...aiRoute(async (req) => {
    const { jobDescription, candidates, language = "fr" } = req.body || {};
    const jd = text(jobDescription, "L'offre d'emploi", true);
    if (!Array.isArray(candidates) || candidates.length === 0) throw new HttpError(400, "Ajoutez au moins un candidat.");
    if (candidates.length > 25) throw new HttpError(400, "Maximum 25 candidats par analyse.");
    const lang = getLanguageName(language);
    const dossier = candidates
      .map(
        (c: any, i: number) => `<candidate index="${i + 1}" id="${String(c.id ?? i)}">
Name: ${String(c.name || "").slice(0, 200)}
CV: ${String(c.cvText || c.uniqueText || "Not provided").slice(0, 20000)}
Cover letter: ${String(c.coverText || "Not provided").slice(0, 8000)}
Other documents: ${String(c.otherText || "Not provided").slice(0, 8000)}
</candidate>`,
      )
      .join("\n");
    const decisions =
      lang === "French" ? '"Entretien", "À étudier" or "Non retenu"' : lang === "English" ? '"Interview", "Review" or "Decline"' : `the ${lang} equivalent of "Interview", "Review" or "Decline"`;

    return generateJSON(
      {
        system: `You are a senior talent acquisition partner. You evaluate candidates objectively, only on job-related criteria. Never use or guess protected characteristics (age, gender, origin, religion, health, family situation) to score anyone. Write everything in ${lang}.`,
        prompt: `Evaluate and rank these candidates for the job below, from most to least qualified.

<job_posting>
${jd}
</job_posting>

${dossier}

For each candidate return:
- id: the exact id given;
- score: job match from 0 to 100;
- decision: ${decisions};
- age: only if explicitly stated in the documents, otherwise an empty string (do not estimate);
- location: place of residence or mobility if stated, otherwise empty;
- matchedKeywords, missingKeywords;
- strengths (3 to 5), weaknesses (2 to 4 points to verify);
- justification: 2-sentence summary of the fit;
- recruiterComments: 4 to 6 sentences on technical fit, soft skills, 2 or 3 tailored interview questions to ask, and risks to check.

Then recruiterReport: a Markdown HR report with a comparison table (rank, candidate, score, decision, location, key strengths, points to verify, comments), a summary for the hiring committee, and next steps.`,
        maxTokens: 16000,
        effort: "medium",
      },
      S.obj({
        rankings: S.arr(
          S.obj({
            id: S.str(),
            score: S.int(),
            decision: S.str(),
            age: S.str(),
            location: S.str(),
            matchedKeywords: S.arr(S.str()),
            missingKeywords: S.arr(S.str()),
            strengths: S.arr(S.str()),
            weaknesses: S.arr(S.str()),
            justification: S.str(),
            recruiterComments: S.str(),
          }),
        ),
        recruiterReport: S.str(),
      }),
    );
  }),
);

// 8. Traduction du CV
app.post(
  "/api/ai/translate-cv",
  ...aiRoute(async (req) => {
    const { cvState, targetLanguage } = req.body || {};
    if (!cvState || typeof cvState !== "object") throw new HttpError(400, "Le CV est requis.");
    const json = JSON.stringify(cvState);
    if (json.length > MAX_CHARS) throw new HttpError(413, "Le CV est trop long pour être traduit en une fois.");
    const lang = getLanguageName(targetLanguage);
    const translated = await generateJSON<any>(
      {
        system: `You are a professional resume translator for international recruitment. Translate into ${lang} while keeping the exact JSON structure.`,
        prompt: `Translate this resume JSON into ${lang}, fluently and professionally.
Keep unchanged: ids, emails, phone numbers, links, personal names, company names ("company") and school names ("school").
Translate: job titles, summary, achievements ("bullets"), degrees, grades, project descriptions, certification names when they are generic, language names and levels.

<cv_json>
${json}
</cv_json>`,
        maxTokens: 16000,
      },
      S.obj({ ...cvSchema(true).properties, references: S.str() }),
    );
    // On garde les champs d'affichage qui ne se traduisent pas
    return { ...translated, showReferences: cvState.showReferences ?? false };
  }),
);

// Route API inconnue → 404 JSON (et non la page HTML)
app.use("/api", (_req, res) => res.status(404).json({ error: "Route inconnue." }));

// ─── VITE / FICHIERS STATIQUES ───
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "1h", index: false }));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ResumeAI Pro : http://localhost:${PORT} (modèle ${CLAUDE_MODEL}, IA ${isAiConfigured() ? "prête" : "NON configurée"})`);
  });
}

startServer();
