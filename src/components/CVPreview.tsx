import React from "react";
import { CandidateCVState } from "../types";

const LABELS = {
  fr: {
    name: "Votre Nom",
    title: "Titre du Poste",
    profile: "Profil Professionnel",
    experience: "Expériences Professionnelles",
    education: "Formation",
    skills: "Compétences",
    languages: "Langues",
    projects: "Projets & Portfolio",
    certifications: "Certifications",
    recentProjects: "Projets récents",
    personalProjects: "Projets personnels",
    professionalTrack: "Parcours professionnel",
    academicTrack: "Formations & Études",
    executiveProfile: "PROFIL EXÉCUTIF",
    careerTrack: "PARCOURS DE CARRIÈRE",
    academicPath: "FORMATION & PARCOURS ACADÉMIQUE",
    keySkills: "COMPÉTENCES CLÉS",
    foreignLanguages: "LANGUES ÉTRANGÈRES",
    professionalCerts: "CERTIFICATIONS PROFESSIONNELLES",
    contact: "Contact",
    references: "Références"
  },
  en: {
    name: "Your Name",
    title: "Job Title",
    profile: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    projects: "Projects & Portfolio",
    certifications: "Certifications",
    recentProjects: "Recent Projects",
    personalProjects: "Personal Projects",
    professionalTrack: "Professional Track",
    academicTrack: "Education & Credentials",
    executiveProfile: "EXECUTIVE SUMMARY",
    careerTrack: "CAREER HISTORY",
    academicPath: "EDUCATION & CREDENTIALS",
    keySkills: "CORE SKILLS",
    foreignLanguages: "LANGUAGES",
    professionalCerts: "PROFESSIONAL CERTIFICATIONS",
    contact: "Contact",
    references: "References"
  }
};

interface CVPreviewProps {
  state: CandidateCVState;
  template: "classic" | "modern" | "creative" | "executive";
  lang?: "fr" | "en";
}

export const CVPreview: React.FC<CVPreviewProps> = ({ state, template, lang = "fr" }) => {
  const t = LABELS[lang];

  const {
    name,
    jobTitle,
    email,
    phone,
    location,
    linkedin,
    summary,
    skills,
    experiences,
    educations,
    projects,
    certifications,
    languages,
    references,
    showReferences,
  } = state;

  const formatBullets = (bulletsText: string) => {
    if (!bulletsText) return null;
    const lines = bulletsText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    return (
      <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[11px] text-gray-700 leading-relaxed font-sans">
        {lines.map((line, idx) => (
          <li key={idx}>
            {line.replace(/^[•\-\*\s]+/, "")}
          </li>
        ))}
      </ul>
    );
  };

  // ─── TEMPLATE 1: CLASSIC ───
  if (template === "classic") {
    return (
      <div className="bg-white text-gray-900 p-8 md:p-12 w-full max-w-[210mm] min-h-[297mm] shadow-lg rounded-sm font-serif">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">
            {name || t.name}
          </h1>
          <p className="text-sm font-semibold text-gray-600 mt-1 uppercase tracking-wider">
            {jobTitle || t.title}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-600">
            {email && <span className="flex items-center">✉ {email}</span>}
            {phone && <span className="flex items-center">📞 {phone}</span>}
            {location && <span className="flex items-center">📍 {location}</span>}
            {linkedin && <span className="flex items-center">🔗 {linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-gray-800">
              {t.profile}
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed font-sans">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && experiences.some((e) => e.role) && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-800">
              {t.experience}
            </h2>
            <div className="space-y-4">
              {experiences
                .filter((e) => e.role)
                .map((e) => (
                  <div key={e.id} className="text-xs">
                    <div className="flex justify-between items-start font-sans">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">
                          {e.role}
                        </span>{" "}
                        <span className="text-gray-600 italic">
                          | {e.company}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {e.start} {e.end ? `— ${e.end}` : ""}
                      </span>
                    </div>
                    {formatBullets(e.bullets)}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && educations.some((edu) => edu.degree) && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-800">
              {t.education}
            </h2>
            <div className="space-y-3">
              {educations
                .filter((edu) => edu.degree)
                .map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between items-start font-sans">
                      <div>
                        <span className="font-bold text-gray-900">
                          {edu.degree}
                        </span>
                        <span className="text-gray-600"> — {edu.school}</span>
                        {edu.grade && (
                          <span className="text-gray-500 text-[11px] italic">
                            {" "}
                            ({edu.grade})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {edu.year}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Skills & Languages split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-gray-800">
                {t.skills}
              </h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-800 rounded px-2 py-0.5 text-[10px] font-sans font-medium border border-gray-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && languages.some((l) => l.name) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-gray-800">
                {t.languages}
              </h2>
              <div className="space-y-1 mt-2">
                {languages
                  .filter((l) => l.name)
                  .map((l) => (
                    <div
                      key={l.id}
                      className="flex justify-between text-xs text-gray-700 font-sans border-b border-dotted border-gray-200 pb-0.5"
                    >
                      <span className="font-medium">{l.name}</span>
                      <span className="text-gray-500 text-[11px]">{l.level}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && projects.some((p) => p.name) && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-800">
              {t.projects}
            </h2>
            <div className="space-y-3 text-xs">
              {projects
                .filter((p) => p.name)
                .map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between items-center font-sans">
                      <span className="font-bold text-gray-900">{p.name}</span>
                      {p.url && (
                        <span className="text-[10px] text-indigo-600 font-mono">
                          {p.url}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-[11px] mt-0.5 leading-relaxed font-sans">
                      {p.desc}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && certifications.some((c) => c.name) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-800">
              {t.certifications}
            </h2>
            <div className="space-y-2 text-xs">
              {certifications
                .filter((c) => c.name)
                .map((c) => (
                  <div key={c.id} className="flex justify-between font-sans">
                    <div>
                      <span className="font-bold text-gray-900">{c.name}</span>
                      <span className="text-gray-500"> — {c.issuer}</span>
                    </div>
                    <span className="text-gray-400 font-medium">{c.year}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* References */}
        {showReferences && references && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-gray-800">
              {t.references}
            </h2>
            <p className="text-xs text-gray-700 font-sans mt-2 italic">
              {references}
            </p>
          </div>
        )}
      </div>
    );
  }

  // ─── TEMPLATE 2: MODERN ───
  if (template === "modern") {
    return (
      <div className="bg-white text-gray-800 w-full max-w-[210mm] min-h-[297mm] shadow-lg rounded-sm flex flex-col md:flex-row font-sans overflow-hidden">
        {/* Left Column (Sidebar) */}
        <div className="w-full md:w-[35%] bg-slate-800 text-white p-8 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight leading-tight uppercase">
              {name || t.name}
            </h1>
            <p className="text-xs font-bold text-teal-400 tracking-wider mt-1 uppercase">
              {jobTitle || t.title}
            </p>
          </div>

          {/* Contacts */}
          <div className="space-y-3 mb-8">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">
              {t.contact}
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              {email && <div className="truncate">✉ {email}</div>}
              {phone && <div>📞 {phone}</div>}
              {location && <div>📍 {location}</div>}
              {linkedin && <div className="truncate">🔗 {linkedin}</div>}
            </div>
          </div>

          {/* Skills with pseudo indicator */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-3">
                {t.skills}
              </h3>
              <div className="space-y-2">
                {skills.map((s, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between text-slate-200 mb-1">
                      <span>{s}</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-400 h-full rounded-full"
                        style={{ width: `${80 - (idx % 4) * 8}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && languages.some((l) => l.name) && (
            <div>
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 mb-3">
                {t.languages}
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                {languages
                  .filter((l) => l.name)
                  .map((l) => (
                    <div key={l.id} className="flex justify-between border-b border-slate-700 pb-1">
                      <span>{l.name}</span>
                      <span className="text-teal-400 font-semibold">{l.level.split(" ")[0]}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Body) */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
          <div>
            {/* Profil Summary */}
            {summary && (
              <div className="mb-6">
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-2 mb-3">
                  {t.profile.split(" ")[0]}
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && experiences.some((e) => e.role) && (
              <div className="mb-6">
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-2 mb-4">
                  {t.experience.split(" ")[0]}
                </h2>
                <div className="space-y-4">
                  {experiences
                    .filter((e) => e.role)
                    .map((e) => (
                      <div key={e.id} className="border-l border-slate-200 pl-3 ml-1">
                        <div className="font-bold text-slate-800 text-sm">
                          {e.role}
                        </div>
                        <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                          {e.company} | {e.start} {e.end ? `— ${e.end}` : ""}
                        </div>
                        {formatBullets(e.bullets)}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && educations.some((edu) => edu.degree) && (
              <div className="mb-6">
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-2 mb-4">
                  {t.education}
                </h2>
                <div className="space-y-3">
                  {educations
                    .filter((edu) => edu.degree)
                    .map((edu) => (
                      <div key={edu.id} className="text-xs">
                        <div className="font-bold text-slate-800">
                          {edu.degree}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {edu.school} | {edu.year} {edu.grade ? `(${edu.grade})` : ""}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && projects.some((p) => p.name) && (
              <div className="mb-6">
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-2 mb-3">
                  {t.recentProjects}
                </h2>
                <div className="space-y-3 text-xs">
                  {projects
                    .filter((p) => p.name)
                    .map((p) => (
                      <div key={p.id} className="bg-slate-50 p-2.5 rounded border border-slate-100">
                        <div className="font-bold text-slate-800 flex justify-between">
                          <span>{p.name}</span>
                          {p.url && <span className="text-[10px] text-indigo-500">{p.url}</span>}
                        </div>
                        <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && certifications.some((c) => c.name) && (
              <div>
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-2 mb-3">
                  {t.certifications}
                </h2>
                <div className="space-y-2 text-xs">
                  {certifications
                    .filter((c) => c.name)
                    .map((c) => (
                      <div key={c.id} className="flex justify-between bg-slate-50 p-2 rounded">
                        <span className="font-bold text-slate-800">{c.name}</span>
                        <span className="text-gray-500 text-[11px]">{c.issuer} | {c.year}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* References */}
            {showReferences && references && (
              <div className="mt-6">
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-2 mb-3">
                  {t.references}
                </h2>
                <p className="text-xs text-gray-600 font-sans mt-2 italic bg-slate-50 p-2.5 rounded border border-slate-100">
                  {references}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── TEMPLATE 3: CREATIVE ───
  if (template === "creative") {
    return (
      <div className="bg-white text-gray-800 w-full max-w-[210mm] min-h-[297mm] shadow-lg rounded-sm font-sans overflow-hidden">
        {/* Banner with modern colorful gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-8 md:p-10 text-white">
          <h1 className="text-3xl font-black tracking-tight">{name || t.name}</h1>
          <p className="text-sm font-bold text-teal-200 mt-1 uppercase tracking-wider">
            {jobTitle || t.title}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-xs text-white/90">
            {email && <span>✉ {email}</span>}
            {phone && <span>📞 {phone}</span>}
            {location && <span>📍 {location}</span>}
            {linkedin && <span>🔗 {linkedin}</span>}
          </div>
        </div>

        {/* Two column split */}
        <div className="flex flex-col md:flex-row">
          {/* Main Body */}
          <div className="flex-1 p-8 space-y-6">
            {/* Profil Summary */}
            {summary && (
              <div>
                <h2 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
                  {t.profile}
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && experiences.some((e) => e.role) && (
              <div>
                <h2 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
                  {t.professionalTrack}
                </h2>
                <div className="space-y-4">
                  {experiences
                    .filter((e) => e.role)
                    .map((e) => (
                      <div key={e.id} className="relative group pl-1">
                        <div className="font-bold text-gray-900 text-sm">
                          {e.role}
                        </div>
                        <div className="text-[11px] text-purple-600 font-bold mt-0.5">
                          {e.company} | {e.start} {e.end ? `— ${e.end}` : ""}
                        </div>
                        {formatBullets(e.bullets)}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && educations.some((edu) => edu.degree) && (
              <div>
                <h2 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
                  {t.academicTrack}
                </h2>
                <div className="space-y-3">
                  {educations
                    .filter((edu) => edu.degree)
                    .map((edu) => (
                      <div key={edu.id} className="text-xs">
                        <div className="font-bold text-gray-900">
                          {edu.degree}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {edu.school} | {edu.year} {edu.grade ? `(${edu.grade})` : ""}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && projects.some((p) => p.name) && (
              <div>
                <h2 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
                  {t.personalProjects}
                </h2>
                <div className="space-y-3 text-xs">
                  {projects
                    .filter((p) => p.name)
                    .map((p) => (
                      <div key={p.id}>
                        <div className="font-bold text-gray-900 flex justify-between">
                          <span>{p.name}</span>
                          {p.url && <span className="text-[10px] text-indigo-600">{p.url}</span>}
                        </div>
                        <p className="text-gray-500 text-[11px] mt-0.5">
                          {p.desc}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (Soft color backdrop) */}
          <div className="w-full md:w-[220px] bg-slate-50 p-8 border-l border-slate-100 space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">
                  {t.skills}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 text-indigo-700 rounded px-2 py-0.5 text-[10px] font-semibold border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && languages.some((l) => l.name) && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">
                  {t.languages}
                </h3>
                <div className="space-y-2 text-xs text-gray-700">
                  {languages
                    .filter((l) => l.name)
                    .map((l) => (
                      <div key={l.id} className="flex justify-between border-b border-gray-100 pb-0.5">
                        <span className="font-medium">{l.name}</span>
                        <span className="text-teal-500 font-bold">{l.level.split(" ")[0]}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && certifications.some((c) => c.name) && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">
                  {t.certifications}
                </h3>
                <div className="space-y-3">
                  {certifications
                    .filter((c) => c.name)
                    .map((c) => (
                      <div key={c.id} className="text-xs text-gray-700">
                        <div className="font-bold text-gray-900">{c.name}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {c.issuer} | {c.year}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* References */}
            {showReferences && references && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">
                  {t.references}
                </h3>
                <p className="text-xs text-gray-600 font-sans italic leading-relaxed">
                  {references}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── TEMPLATE 4: EXECUTIVE ───
  return (
    <div className="bg-white text-gray-900 p-12 w-full max-w-[210mm] min-h-[297mm] shadow-lg rounded-sm font-serif">
      {/* Centered Elite Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
          {name || t.name}
        </h1>
        <p className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase mt-2">
          {jobTitle || t.title}
        </p>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-4 text-[11px] text-gray-600 font-sans border-t border-b border-gray-200 py-2.5 max-w-xl mx-auto">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {location && <span>{location}</span>}
          {linkedin && <span>{linkedin}</span>}
        </div>
      </div>

      {/* Profil Executive */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-gray-900 mb-2 flex items-center gap-4">
            {t.executiveProfile}
            <span className="flex-1 h-[1px] bg-gray-300"></span>
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed font-sans italic">
            "{summary}"
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && experiences.some((e) => e.role) && (
        <div className="mb-6">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-gray-900 mb-3 flex items-center gap-4">
            {t.careerTrack}
            <span className="flex-1 h-[1px] bg-gray-300"></span>
          </h2>
          <div className="space-y-4">
            {experiences
              .filter((e) => e.role)
              .map((e) => (
                <div key={e.id} className="flex gap-4">
                  <div className="w-[85px] text-[10px] text-gray-500 font-sans font-bold text-right pt-0.5 shrink-0 uppercase tracking-wider">
                    {e.start}
                    <br />
                    {e.end}
                  </div>
                  <div className="flex-1 border-l border-gray-300 pl-4 pb-1">
                    <div className="font-bold text-gray-900 text-xs">
                      {e.role}
                    </div>
                    <div className="text-[11px] text-gray-600 italic font-sans mt-0.5">
                      {e.company}
                    </div>
                    {formatBullets(e.bullets)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && educations.some((edu) => edu.degree) && (
        <div className="mb-6">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-gray-900 mb-3 flex items-center gap-4">
            {t.academicPath}
            <span className="flex-1 h-[1px] bg-gray-300"></span>
          </h2>
          <div className="space-y-3">
            {educations
              .filter((edu) => edu.degree)
              .map((edu) => (
                <div key={edu.id} className="flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">
                      {edu.degree}
                    </span>
                    <span className="text-gray-600 italic"> — {edu.school}</span>
                    {edu.grade && (
                      <span className="text-gray-500 text-[11px] block mt-0.5 font-sans">
                        {lang === "fr" ? "Mention" : "Grade"}: {edu.grade}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-bold font-sans">
                    {edu.year}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Competences keys */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-gray-900 mb-3 flex items-center gap-4">
            {t.keySkills}
            <span className="flex-1 h-[1px] bg-gray-300"></span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="border border-gray-800 text-gray-900 rounded-none px-3 py-1 text-[10px] font-bold font-sans tracking-wider uppercase"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && languages.some((l) => l.name) && (
        <div className="mb-6">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-gray-900 mb-3 flex items-center gap-4">
            {t.foreignLanguages}
            <span className="flex-1 h-[1px] bg-gray-300"></span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {languages
              .filter((l) => l.name)
              .map((l) => (
                <div
                  key={l.id}
                  className="flex justify-between text-xs text-gray-700 font-sans border-b border-gray-200 pb-1"
                >
                  <span className="font-bold text-gray-800">{l.name}</span>
                  <span className="text-gray-500">{l.level}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && certifications.some((c) => c.name) && (
        <div>
          <h2 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-gray-900 mb-3 flex items-center gap-4">
            {t.professionalCerts}
            <span className="flex-1 h-[1px] bg-gray-300"></span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {certifications
              .filter((c) => c.name)
              .map((c) => (
                <span
                  key={c.id}
                  className="border border-gray-400 text-gray-700 px-3 py-1 text-[10px] font-bold font-sans tracking-wide"
                >
                  {c.name} ({c.issuer} • {c.year})
                </span>
              ))}
          </div>
        </div>
      )}

      {/* References */}
      {showReferences && references && (
        <div className="mt-6">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-gray-900 mb-3 flex items-center gap-4">
            {t.references}
            <span className="flex-1 h-[1px] bg-gray-300"></span>
          </h2>
          <p className="text-xs text-gray-700 font-sans mt-2 italic leading-relaxed">
            {references}
          </p>
        </div>
      )}
    </div>
  );
};
