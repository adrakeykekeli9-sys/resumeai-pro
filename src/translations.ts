import { SupportedLanguage } from "./types";

export interface TranslationSchema {
  appTitle: string;
  appSub: string;
  tabs: {
    editor: string;
    analyzer: string;
    cover: string;
    interview: string;
    salary: string;
    recruiter: string;
  };
  actions: {
    save: string;
    export: string;
    ats: string;
    add: string;
    remove: string;
    improveWithAi: string;
    generating: string;
    copied: string;
    loading: string;
  };
  editor: {
    bannerTitle: string;
    bannerDesc: string;
    bannerBtn: string;
    personalInfo: string;
    fullName: string;
    jobTitle: string;
    location: string;
    linkedin: string;
    summary: string;
    summaryPh: string;
    experiences: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    bullets: string;
    bulletsPh: string;
    education: string;
    degree: string;
    school: string;
    year: string;
    grade: string;
    skills: string;
    skillsPh: string;
    languages: string;
    languageName: string;
    languageLevel: string;
    projects: string;
    projectName: string;
    projectUrl: string;
    projectDesc: string;
    certifications: string;
    certName: string;
    certIssuer: string;
    references: string;
    referencesLabel: string;
    referencesPh: string;
  };
  analyzer: {
    desc: string;
    label: string;
    ph: string;
    btn: string;
    matchScore: string;
    foundKw: string;
    missingKw: string;
    recs: string;
    autoAdd: string;
    noResults: string;
  };
  cover: {
    title: string;
    company: string;
    role: string;
    why: string;
    whyPh: string;
    tone: string;
    tones: {
      professional: string;
      dynamic: string;
      creative: string;
      concise: string;
    };
    btn: string;
    copy: string;
  };
  interview: {
    title: string;
    desc: string;
    role: string;
    btn: string;
    tip: string;
  };
  salary: {
    title: string;
    role: string;
    exp: string;
    city: string;
    sector: string;
    sectors: {
      tech: string;
      finance: string;
      marketing: string;
      health: string;
      education: string;
      industry: string;
    };
    estimate: string;
    median: string;
    factors: string;
  };
  recruiter: {
    title: string;
    desc: string;
    steps: {
      one: string;
      two: string;
      three: string;
    };
    jobUpload: string;
    addCandidate: string;
    candName: string;
    docs: string;
    btn: string;
    leaderboard: string;
    exportReport: string;
    matchedKw: string;
    missingKw: string;
    decision: string;
    decisions: {
      yes: string;
      maybe: string;
      no: string;
    };
    favoritesOnly: string;
    toggleFavorite: string;
    downloadZip: string;
    downloadZipTooltip: string;
    shareBtn: string;
    shareBtnTooltip: string;
  };
  modal: {
    title: string;
    sub: string;
    drop: string;
    dropSub: string;
    progress: string;
    extracted: string;
    options: string;
    fill: string;
    fillDesc: string;
    summary: string;
    summaryDesc: string;
    bullets: string;
    bulletsDesc: string;
    full: string;
    fullDesc: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationSchema> = {
  fr: {
    appTitle: "ResumeAI Pro",
    appSub: "Plateforme IA pour Étudiants & Recruteurs",
    tabs: {
      editor: "✏️ Éditeur CV",
      analyzer: "🔍 Analyseur d'Offre",
      cover: "📄 Lettre de Motivation",
      interview: "🎯 Préparation Entretien",
      salary: "💰 Estimation de Salaire",
      recruiter: "👔 Espace Recruteur"
    },
    actions: {
      save: "Sauvegarder",
      export: "Exporter en PDF",
      ats: "Score ATS",
      add: "Ajouter",
      remove: "Supprimer",
      improveWithAi: "Améliorer avec l'IA",
      generating: "Génération en cours...",
      copied: "Copié dans le presse-papiers !",
      loading: "Analyse en cours..."
    },
    editor: {
      bannerTitle: "Vous avez déjà un CV ?",
      bannerDesc: "Importez un fichier (PDF, DOCX, TXT). Notre IA va extraire vos informations pour pré-remplir le formulaire et vous suggérer des optimisations de haut niveau.",
      bannerBtn: "Importer mon CV",
      personalInfo: "Informations Personnelles",
      fullName: "Prénom & Nom",
      jobTitle: "Titre du Poste",
      location: "Ville / Pays",
      linkedin: "LinkedIn / Portfolio",
      summary: "Résumé Professionnel d'Accroche",
      summaryPh: "Développeur passionné doté d'une solide maîtrise de React...",
      experiences: "Expériences Professionnelles",
      role: "Intitulé du Poste",
      company: "Entreprise",
      startDate: "Date de début",
      endDate: "Date de fin (ou Présent)",
      bullets: "Missions & Réalisations (une par ligne)",
      bulletsPh: "• Développé une API REST servant 50k requêtes/jour\n• Réduit le temps de chargement de 40%...",
      education: "Formation & Diplômes",
      degree: "Diplôme / Filière",
      school: "Établissement / École",
      year: "Année d'obtention",
      grade: "Mention / Note (ex: Très Bien)",
      skills: "Compétences clés",
      skillsPh: "React, Python, Agile...",
      languages: "Langues",
      languageName: "Langue",
      languageLevel: "Niveau",
      projects: "Projets & Portfolio",
      projectName: "Nom du Projet",
      projectUrl: "Lien (GitHub / Démo)",
      projectDesc: "Description succincte du projet...",
      certifications: "Certifications",
      certName: "Nom de la Certification",
      certIssuer: "Organisme émetteur",
      references: "Références",
      referencesLabel: "Inclure la mention sur le CV",
      referencesPh: "Références sur demande"
    },
    analyzer: {
      desc: "Collez une offre d'emploi pour évaluer la correspondance avec votre CV. Découvrez les mots-clés manquants indispensables et obtenez un plan d'action immédiat pour passer les filtres ATS.",
      label: "Description du Poste",
      ph: "Collez ici la description complète du poste...",
      btn: "Analyser la compatibilité",
      matchScore: "Correspondance ATS globale",
      foundKw: "Mots-clés validés dans votre CV",
      missingKw: "Mots-clés manquants identifiés",
      recs: "Recommandations concrètes d'optimisation",
      autoAdd: "Intégrer les mots-clés manquants",
      noResults: "Veuillez coller une offre et lancer l'analyse."
    },
    cover: {
      title: "Lettre de Motivation IA",
      company: "Nom de l'entreprise",
      role: "Poste ciblé",
      why: "Pourquoi cette entreprise ? (votre motivation)",
      whyPh: "J'admire particulièrement votre engagement pour l'open-source...",
      tone: "Ton de la rédaction",
      tones: {
        professional: "Professionnel & Formel",
        dynamic: "Dynamique & Enthousiaste",
        creative: "Créatif & Original",
        concise: "Concis & Direct"
      },
      btn: "Générer la Lettre",
      copy: "Copier la lettre"
    },
    interview: {
      title: "Préparation d'Entretien IA",
      desc: "Obtenez une simulation de questions d'entretien d'embauche sur-mesure basées sur votre profil actuel et le poste ciblé.",
      role: "Poste visé",
      btn: "Générer les Questions d'Entretien",
      tip: "Conseil de réponse :"
    },
    salary: {
      title: "Estimation Salariale Estimée",
      role: "Intitulé du poste recherché",
      exp: "Années d'expérience",
      city: "Ville de travail",
      sector: "Secteur d'activité",
      sectors: {
        tech: "Technologies & Informatique",
        finance: "Finance, Banque & Assurance",
        marketing: "Marketing, Communication & Vente",
        health: "Santé & Pharma",
        education: "Éducation & Recherche",
        industry: "Industrie & Ingénierie"
      },
      estimate: "Fourchette de salaire estimée",
      median: "Médiane brute annuelle",
      factors: "Facteurs d'influence clés"
    },
    recruiter: {
      title: "Espace Recrutement Intelligent",
      desc: "Uploadez une offre de poste et les CV des candidats (PDF/DOCX/TXT). Notre intelligence artificielle classe les profils par pertinence ATS, résume leurs forces et justifie les décisions.",
      steps: {
        one: "1. Offre d'emploi",
        two: "2. Candidats",
        three: "3. Résultats & Classement"
      },
      jobUpload: "Cliquez ou glissez l'offre ici (PDF, DOCX, TXT)",
      addCandidate: "Ajouter un candidat",
      candName: "Nom du candidat",
      docs: "Documents à charger :",
      btn: "Classer et Évaluer les Candidats",
      leaderboard: "Classement Final des Talents",
      exportReport: "Exporter le Rapport RH en TXT",
      matchedKw: "Mots-clés validés",
      missingKw: "Mots-clés manquants",
      decision: "Recommandation :",
      decisions: {
        yes: "Entretien",
        maybe: "À étudier",
        no: "Non retenu"
      },
      favoritesOnly: "Favoris uniquement",
      toggleFavorite: "Marquer comme favori",
      downloadZip: "Télécharger ZIP",
      downloadZipTooltip: "Télécharger un fichier ZIP contenant tous les documents des candidats",
      shareBtn: "Partager le CV",
      shareBtnTooltip: "Générer un lien de partage unique et sécurisé (lecture seule)"
    },
    modal: {
      title: "Importer votre CV existant",
      sub: "Glissez ou sélectionnez un fichier. Notre parseur IA intelligent va décoder le texte pour alimenter votre CV interactif.",
      drop: "Glissez-déposez votre CV ici",
      dropSub: "Prend en charge les formats PDF, DOCX et TXT",
      progress: "Décodage et extraction des données par l'IA...",
      extracted: "Données extraites avec succès !",
      options: "Que souhaitez-vous faire ?",
      fill: "Importer les données brutes",
      fillDesc: "Remplir tous les champs du formulaire avec les valeurs trouvées.",
      summary: "Améliorer le profil d'accroche",
      summaryDesc: "Générer une accroche ultra-professionnelle et dynamique.",
      bullets: "Booster les expériences professionnelles",
      bulletsDesc: "Reformuler et enrichir toutes vos descriptions avec des KPI.",
      full: "Optimisation complète par l'IA (Recommandé)",
      fullDesc: "Importer, réécrire l'accroche et optimiser les puces d'expérience en un clic."
    }
  },

  en: {
    appTitle: "ResumeAI Pro",
    appSub: "AI Platform for Students & Recruiters",
    tabs: {
      editor: "✏️ CV Editor",
      analyzer: "🔍 Job Matcher",
      cover: "📄 Cover Letter",
      interview: "🎯 Interview Prep",
      salary: "💰 Salary Estimate",
      recruiter: "👔 Recruiter Space"
    },
    actions: {
      save: "Save",
      export: "Export to PDF",
      ats: "ATS Score",
      add: "Add",
      remove: "Delete",
      improveWithAi: "Improve with AI",
      generating: "Generating...",
      copied: "Copied to clipboard!",
      loading: "Analyzing..."
    },
    editor: {
      bannerTitle: "Already have a CV?",
      bannerDesc: "Import any file (PDF, DOCX, TXT). Our AI will extract all information to pre-fill the form and suggest premium improvements.",
      bannerBtn: "Import my CV",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      jobTitle: "Job Title",
      location: "City / Country",
      linkedin: "LinkedIn / Portfolio",
      summary: "Professional Summary",
      summaryPh: "Passionate developer with strong React skills...",
      experiences: "Work Experience",
      role: "Job Title",
      company: "Company",
      startDate: "Start Date",
      endDate: "End Date (or Present)",
      bullets: "Key Accomplishments (one per line)",
      bulletsPh: "• Designed and deployed a REST API serving 50k requests/day\n• Reduced loading times by 40%...",
      education: "Education & Credentials",
      degree: "Degree / Program",
      school: "Institution / School",
      year: "Graduation Year",
      grade: "Grade / Distinction (e.g. Magna Cum Laude)",
      skills: "Core Skills",
      skillsPh: "React, Python, Agile...",
      languages: "Languages",
      languageName: "Language",
      languageLevel: "Proficiency",
      projects: "Projects & Portfolio",
      projectName: "Project Name",
      projectUrl: "Link (GitHub / Demo)",
      projectDesc: "Short project summary...",
      certifications: "Certifications",
      certName: "Certification Name",
      certIssuer: "Issuing Organization",
      references: "References",
      referencesLabel: "Include on CV",
      referencesPh: "References available upon request"
    },
    analyzer: {
      desc: "Paste a job description to evaluate matching score with your resume. Discover crucial missing keywords and get a concrete action plan to pass ATS filters.",
      label: "Job Description",
      ph: "Paste the full job description here...",
      btn: "Analyze ATS Match",
      matchScore: "Overall ATS Match Score",
      foundKw: "Validated keywords in your resume",
      missingKw: "Critical missing keywords",
      recs: "Actionable Optimization Advice",
      autoAdd: "Integrate missing keywords",
      noResults: "Please paste a job description and start the analysis."
    },
    cover: {
      title: "AI Cover Letter",
      company: "Company Name",
      role: "Target Job",
      why: "Why this company? (your motivation)",
      whyPh: "I particularly admire your commitment to open-source software...",
      tone: "Writing Tone",
      tones: {
        professional: "Professional & Formal",
        dynamic: "Dynamic & Enthusiastic",
        creative: "Creative & Storytelling",
        concise: "Concise & Direct"
      },
      btn: "Generate Letter",
      copy: "Copy Letter"
    },
    interview: {
      title: "AI Interview Simulation",
      desc: "Get simulated, highly custom job interview questions based on your profile and target job role.",
      role: "Target Job Role",
      btn: "Generate Interview Questions",
      tip: "Response Strategy:"
    },
    salary: {
      title: "Estimated Market Value",
      role: "Job Title",
      exp: "Years of Experience",
      city: "Job Location",
      sector: "Industry Sector",
      sectors: {
        tech: "Technology & Computing",
        finance: "Banking, Finance & Insurance",
        marketing: "Marketing, PR & Sales",
        health: "Healthcare & Biotech",
        education: "Education & Science",
        industry: "Manufacturing & Engineering"
      },
      estimate: "Estimated Annual Salary Range",
      median: "Market Median Salary",
      factors: "Key Market Drivers"
    },
    recruiter: {
      title: "Smart Recruiter Command",
      desc: "Upload a job offer and applicant resumes (PDF/DOCX/TXT). Our AI instantly ranks profiles by ATS match score, evaluates skills, and suggests selection decisions.",
      steps: {
        one: "1. Job Description",
        two: "2. Candidates",
        three: "3. Results & Leaderboard"
      },
      jobUpload: "Click or drag the job offer here (PDF, DOCX, TXT)",
      addCandidate: "Add applicant",
      candName: "Applicant Name",
      docs: "Load documents:",
      btn: "Rank and Assess Applicants",
      leaderboard: "Final Applicant Leaderboard",
      exportReport: "Export HR Report to TXT",
      matchedKw: "Matched Skills",
      missingKw: "Missing Skills",
      decision: "Recommendation:",
      decisions: {
        yes: "Interview",
        maybe: "Review",
        no: "Decline"
      },
      favoritesOnly: "Favorites only",
      toggleFavorite: "Mark as favorite",
      downloadZip: "Download ZIP",
      downloadZipTooltip: "Download a ZIP archive containing all candidates' documents",
      shareBtn: "Share CV",
      shareBtnTooltip: "Generate a unique, secure shareable link (read-only mode)"
    },
    modal: {
      title: "Import Existing Resume",
      sub: "Drop or select your file. Our intelligent AI parser will extract your background to build your interactive profile.",
      drop: "Drop your CV file here",
      dropSub: "Supports PDF, DOCX, and TXT files",
      progress: "AI parsing and content extraction in progress...",
      extracted: "Resume processed successfully!",
      options: "Select AI action",
      fill: "Import exact data",
      fillDesc: "Pre-fill standard input fields with extracted values.",
      summary: "Optimize professional summary",
      summaryDesc: "Draft a dynamic and modern branding description.",
      bullets: "Boost experience accomplishments",
      bulletsDesc: "Rewrite description bullets with real-world impact metrics.",
      full: "Full AI Professional Upgrade (Recommended)",
      fullDesc: "Import data, upgrade the summary, and optimize all accomplishments at once."
    }
  },

  de: {
    appTitle: "ResumeAI Pro",
    appSub: "KI-Plattform für Bewerber & Recruiter",
    tabs: {
      editor: "✏️ CV-Editor",
      analyzer: "🔍 Stellen-Analyse",
      cover: "📄 Anschreiben",
      interview: "🎯 Gesprächsvorbereitung",
      salary: "💰 Gehaltsschätzung",
      recruiter: "👔 Recruiter-Bereich"
    },
    actions: {
      save: "Speichern",
      export: "Als PDF exportieren",
      ats: "ATS-Score",
      add: "Hinzufügen",
      remove: "Löschen",
      improveWithAi: "Mit KI optimieren",
      generating: "Wird generiert...",
      copied: "In die Zwischenablage kopiert!",
      loading: "Wird analysiert..."
    },
    editor: {
      bannerTitle: "Haben Sie bereits einen Lebenslauf?",
      bannerDesc: "Laden Sie Ihre Datei hoch (PDF, DOCX, TXT). Unsere KI extrahiert Ihre Daten und schlägt Optimierungen vor.",
      bannerBtn: "CV importieren",
      personalInfo: "Persönliche Angaben",
      fullName: "Vor- & Nachname",
      jobTitle: "Berufsbezeichnung",
      location: "Stadt / Land",
      linkedin: "LinkedIn / Portfolio",
      summary: "Profilzusammenfassung",
      summaryPh: "Engagierter Entwickler mit fundierten Kenntnissen in...",
      experiences: "Berufserfahrung",
      role: "Position",
      company: "Unternehmen",
      startDate: "Startdatum",
      endDate: "Enddatum (oder heute)",
      bullets: "Erfolge & Aufgaben (eine pro Zeile)",
      bulletsPh: "• Skalierbare REST-API entwickelt\n• Ladezeiten um 40% verringert...",
      education: "Ausbildung & Abschlüsse",
      degree: "Abschluss / Fachrichtung",
      school: "Hochschule / Schule",
      year: "Abschlussjahr",
      grade: "Note / Prädikat",
      skills: "Kernkompetenzen",
      skillsPh: "React, Python, Agile...",
      languages: "Sprachen",
      languageName: "Sprache",
      languageLevel: "Niveau",
      projects: "Projekte & Portfolio",
      projectName: "Projektname",
      projectUrl: "Link (GitHub / Demo)",
      projectDesc: "Kurzbeschreibung...",
      certifications: "Zertifikate",
      certName: "Name des Zertifikats",
      certIssuer: "Aussteller",
      references: "Referenzen",
      referencesLabel: "Im Lebenslauf erwähnen",
      referencesPh: "Referenzen auf Anfrage"
    },
    analyzer: {
      desc: "Fügen Sie eine Stellenanzeige ein, um die Übereinstimmung mit Ihrem Lebenslauf zu prüfen.",
      label: "Stellenbeschreibung",
      ph: "Stellenbeschreibung hier einfügen...",
      btn: "Kompatibilität analysieren",
      matchScore: "ATS-Match-Score",
      foundKw: "Gefundene Schlüsselwörter",
      missingKw: "Fehlende Schlüsselwörter",
      recs: "Optimierungsempfehlungen",
      autoAdd: "Fehlende Keywords hinzufügen",
      noResults: "Bitte fügen Sie eine Stellenanzeige ein."
    },
    cover: {
      title: "KI-Anschreiben",
      company: "Unternehmen",
      role: "Zielposition",
      why: "Warum dieses Unternehmen?",
      whyPh: "Ich schätze besonders Ihre Innovationskraft...",
      tone: "Schreibstil",
      tones: {
        professional: "Professionell & Formell",
        dynamic: "Dynamisch & Begeisternd",
        creative: "Kreativ & Storytelling",
        concise: "Prägnant & Direkt"
      },
      btn: "Anschreiben erstellen",
      copy: "Anschreiben kopieren"
    },
    interview: {
      title: "KI-Vorstellungsgespräch",
      desc: "Erhalten Sie individuelle Simulationsfragen basierend auf Ihrem Profil.",
      role: "Zielposition",
      btn: "Fragen generieren",
      tip: "Antwort-Tipp:"
    },
    salary: {
      title: "Gehaltsschätzung",
      role: "Berufsbezeichnung",
      exp: "Berufserfahrung (Jahre)",
      city: "Arbeitsort",
      sector: "Branche",
      sectors: {
        tech: "Technologie & IT",
        finance: "Finanzen & Versicherungen",
        marketing: "Marketing & Vertrieb",
        health: "Gesundheit & Pharma",
        education: "Bildung & Wissenschaft",
        industry: "Industrie & Ingenieurwesen"
      },
      estimate: "Geschätzte Gehaltsspanne",
      median: "Brutto-Median",
      factors: "Marktfaktoren"
    },
    recruiter: {
      title: "Intelligenter Recruiter-Bereich",
      desc: "Laden Sie Stellenanzeigen und Bewerber-CVs hoch. Die KI vergleicht, bewertet und rankt die Profile.",
      steps: {
        one: "1. Stellenbeschreibung",
        two: "2. Bewerber",
        three: "3. Ergebnisse & Ranking"
      },
      jobUpload: "Stellenanzeige hochladen (PDF, DOCX, TXT)",
      addCandidate: "Bewerber hinzufügen",
      candName: "Name des Bewerbers",
      docs: "Dokumente:",
      btn: "Bewerber analysieren & ranken",
      leaderboard: "Bewerber-Ranking",
      exportReport: "Bericht exportieren",
      matchedKw: "Passende Fähigkeiten",
      missingKw: "Fehlende Fähigkeiten",
      decision: "Empfehlung:",
      decisions: {
        yes: "Interview",
        maybe: "Prüfen",
        no: "Absagen"
      },
      favoritesOnly: "Nur Favoriten",
      toggleFavorite: "Als Favorit markieren",
      downloadZip: "ZIP herunterladen",
      downloadZipTooltip: "Alle Dokumente als ZIP exportieren",
      shareBtn: "CV teilen",
      shareBtnTooltip: "Sicheren Freigabe-Link generieren"
    },
    modal: {
      title: "Bestehenden Lebenslauf importieren",
      sub: "Laden Sie Ihren Lebenslauf hoch. Unsere KI extrahiert alle relevanten Abschnitte.",
      drop: "Datei hier ablegen",
      dropSub: "PDF, DOCX und TXT unterstützt",
      progress: "KI-Analyse läuft...",
      extracted: "Erfolgreich extrahiert!",
      options: "Gewünschte Aktion wählen",
      fill: "Daten übernehmen",
      fillDesc: "Formularfelder mit Werten ausfüllen.",
      summary: "Profil optimieren",
      summaryDesc: "Überzeugende Zusammenfassung verfassen.",
      bullets: "Erfolge ausarbeiten",
      bulletsDesc: "Erfahrungspunkte mit Kennzahlen schärfen.",
      full: "Komplett-Optimierung (Empfohlen)",
      fullDesc: "Alle Angaben importieren und mit KI aufwerten."
    }
  },

  es: {
    appTitle: "ResumeAI Pro",
    appSub: "Plataforma IA para Candidatos y Reclutadores",
    tabs: {
      editor: "✏️ Editor de CV",
      analyzer: "🔍 Analizador de Ofertas",
      cover: "📄 Carta de Presentación",
      interview: "🎯 Preparación de Entrevista",
      salary: "💰 Estimación Salarial",
      recruiter: "👔 Espacio Reclutador"
    },
    actions: {
      save: "Guardar",
      export: "Exportar a PDF",
      ats: "Puntuación ATS",
      add: "Añadir",
      remove: "Eliminar",
      improveWithAi: "Mejorar con IA",
      generating: "Generando...",
      copied: "¡Copiado al portapapeles!",
      loading: "Analizando..."
    },
    editor: {
      bannerTitle: "¿Ya tienes un CV?",
      bannerDesc: "Importa un archivo (PDF, DOCX, TXT). Nuestra IA extraerá tus datos y sugerirá mejoras clave.",
      bannerBtn: "Importar mi CV",
      personalInfo: "Información Personal",
      fullName: "Nombre y Apellidos",
      jobTitle: "Título Profesional",
      location: "Ciudad / País",
      linkedin: "LinkedIn / Portafolio",
      summary: "Resumen Profesional",
      summaryPh: "Desarrollador apasionado con experiencia sólida...",
      experiences: "Experiencia Laboral",
      role: "Puesto / Cargo",
      company: "Empresa",
      startDate: "Fecha de inicio",
      endDate: "Fecha de fin (o actual)",
      bullets: "Logros y Responsabilidades (uno por línea)",
      bulletsPh: "• Diseñé e implementé API REST escalable\n• Reduje tiempos de carga en un 40%...",
      education: "Educación y Títulos",
      degree: "Título / Carrera",
      school: "Institución / Universidad",
      year: "Año de graduación",
      grade: "Calificación / Mención",
      skills: "Habilidades Clave",
      skillsPh: "React, Python, Agile...",
      languages: "Idiomas",
      languageName: "Idioma",
      languageLevel: "Nivel",
      projects: "Proyectos y Portafolio",
      projectName: "Nombre del Proyecto",
      projectUrl: "Enlace (GitHub / Demo)",
      projectDesc: "Descripción corta...",
      certifications: "Certificaciones",
      certName: "Nombre de Certificación",
      certIssuer: "Emisor",
      references: "Referencias",
      referencesLabel: "Incluir en el CV",
      referencesPh: "Referencias disponibles a petición"
    },
    analyzer: {
      desc: "Pega una oferta de empleo para evaluar la compatibilidad con tu CV.",
      label: "Descripción del Puesto",
      ph: "Pega la descripción completa aquí...",
      btn: "Analizar Compatibilidad",
      matchScore: "Coincidencia ATS Global",
      foundKw: "Palabras clave encontradas",
      missingKw: "Palabras clave faltantes",
      recs: "Recomendaciones de optimización",
      autoAdd: "Añadir palabras clave faltantes",
      noResults: "Por favor pega una oferta de empleo."
    },
    cover: {
      title: "Carta de Presentación IA",
      company: "Nombre de la Empresa",
      role: "Puesto deseado",
      why: "¿Por qué esta empresa?",
      whyPh: "Admiro su visión tecnológica...",
      tone: "Tono de redacción",
      tones: {
        professional: "Profesional y Formal",
        dynamic: "Dinámico y Entusiasta",
        creative: "Creativo y Narrativo",
        concise: "Conciso y Directo"
      },
      btn: "Generar Carta",
      copy: "Copiar Carta"
    },
    interview: {
      title: "Preparación de Entrevistas IA",
      desc: "Obtén preguntas simuladas y consejos estratégicos según tu perfil.",
      role: "Puesto objetivo",
      btn: "Generar Preguntas",
      tip: "Estrategia de respuesta:"
    },
    salary: {
      title: "Estimación Salarial de Mercado",
      role: "Puesto de trabajo",
      exp: "Años de experiencia",
      city: "Ciudad",
      sector: "Sector industrial",
      sectors: {
        tech: "Tecnología e Informática",
        finance: "Finanzas y Banca",
        marketing: "Marketing y Ventas",
        health: "Salud y Farmacéutica",
        education: "Educación e Investigación",
        industry: "Industria e Ingeniería"
      },
      estimate: "Rango Salarial Estimado",
      median: "Mediana Salarial Anual",
      factors: "Factores Clave de Mercado"
    },
    recruiter: {
      title: "Panel Inteligente de Reclutamiento",
      desc: "Sube una oferta y los CVs de los candidatos. La IA evalúa la compatibilidad ATS y fundamenta decisiones.",
      steps: {
        one: "1. Oferta de empleo",
        two: "2. Candidatos",
        three: "3. Resultados y Clasificación"
      },
      jobUpload: "Subir oferta de empleo (PDF, DOCX, TXT)",
      addCandidate: "Añadir candidato",
      candName: "Nombre del candidato",
      docs: "Documentos cargados:",
      btn: "Evaluar y Clasificar Candidatos",
      leaderboard: "Clasificación Final de Talentos",
      exportReport: "Exportar Informe",
      matchedKw: "Habilidades Coincidentes",
      missingKw: "Habilidades Faltantes",
      decision: "Decisión Recomendada:",
      decisions: {
        yes: "Entrevista",
        maybe: "Revisar",
        no: "Descartar"
      },
      favoritesOnly: "Solo favoritos",
      toggleFavorite: "Marcar como favorito",
      downloadZip: "Descargar ZIP",
      downloadZipTooltip: "Descargar archivo ZIP con todos los documentos",
      shareBtn: "Compartir CV",
      shareBtnTooltip: "Generar enlace de visualización seguro"
    },
    modal: {
      title: "Importar CV Existente",
      sub: "Arrastra tu archivo. Nuestro analizador inteligente completará tu perfil.",
      drop: "Arrastra tu CV aquí",
      dropSub: "Admite PDF, DOCX y TXT",
      progress: "Extrayendo información...",
      extracted: "¡Datos extraídos con éxito!",
      options: "¿Qué acción deseas realizar?",
      fill: "Cargar datos básicos",
      fillDesc: "Rellenar campos estándar del formulario.",
      summary: "Optimizar perfil",
      summaryDesc: "Generar un resumen profesional de alto impacto.",
      bullets: "Mejorar logros laborales",
      bulletsDesc: "Reformular con métricas cuantificables.",
      full: "Optimización integral (Recomendada)",
      fullDesc: "Importar y mejorar todo el perfil en un clic."
    }
  },

  it: {
    appTitle: "ResumeAI Pro",
    appSub: "Piattaforma AI per Candidati & Recruiter",
    tabs: {
      editor: "✏️ Editor CV",
      analyzer: "🔍 Analisi Offerta",
      cover: "📄 Lettera Motivazionale",
      interview: "🎯 Preparazione Colloquio",
      salary: "💰 Stima Retributiva",
      recruiter: "👔 Spazio Recruiter"
    },
    actions: {
      save: "Salva",
      export: "Esporta in PDF",
      ats: "Punteggio ATS",
      add: "Aggiungi",
      remove: "Elimina",
      improveWithAi: "Migliora con l'IA",
      generating: "Generazione in corso...",
      copied: "Copiato negli appunti!",
      loading: "Analisi in corso..."
    },
    editor: {
      bannerTitle: "Hai già un CV pronto?",
      bannerDesc: "Carica un file (PDF, DOCX, TXT). La nostra IA estrarrà le informazioni per precompilare il modulo e suggerire miglioramenti.",
      bannerBtn: "Importa il mio CV",
      personalInfo: "Informazioni Personali",
      fullName: "Nome e Cognome",
      jobTitle: "Titolo Professionale",
      location: "Città / Paese",
      linkedin: "LinkedIn / Portfolio",
      summary: "Profilo Professionale",
      summaryPh: "Sviluppatore motivato con solide competenze in React...",
      experiences: "Esperienze Lavorative",
      role: "Ruolo / Posizione",
      company: "Azienda",
      startDate: "Data di Inizio",
      endDate: "Data di Fine (o presente)",
      bullets: "Risultati e Mansioni (uno per riga)",
      bulletsPh: "• Sviluppate API REST ad alte prestazioni\n• Tempi di caricamento ridotti del 40%...",
      education: "Formazione e Titoli",
      degree: "Laurea / Corso di Studi",
      school: "Università / Istituto",
      year: "Anno di Conseguimento",
      grade: "Votazione / Lode",
      skills: "Competenze Chiave",
      skillsPh: "React, Python, Agile...",
      languages: "Lingue",
      languageName: "Lingua",
      languageLevel: "Livello",
      projects: "Progetti e Portfolio",
      projectName: "Nome Progetto",
      projectUrl: "Link (GitHub / Demo)",
      projectDesc: "Breve descrizione del progetto...",
      certifications: "Certificazioni",
      certName: "Nome Certificazione",
      certIssuer: "Ente Rilasciante",
      references: "Referenze",
      referencesLabel: "Includi nel CV",
      referencesPh: "Referenze disponibili su richiesta"
    },
    analyzer: {
      desc: "Incolla una descrizione di lavoro per valutare la corrispondenza ATS con il tuo curriculum.",
      label: "Descrizione del Lavoro",
      ph: "Incolla qui la job description...",
      btn: "Analizza Compatibilità",
      matchScore: "Punteggio ATS Globale",
      foundKw: "Competenze Convalidate",
      missingKw: "Competenze Mancanti",
      recs: "Raccomandazioni di Ottimizzazione",
      autoAdd: "Aggiungi parole chiave mancanti",
      noResults: "Incolla un annuncio per avviare l'analisi."
    },
    cover: {
      title: "Lettera Motivazionale IA",
      company: "Nome Azienda",
      role: "Posizione di Riferimento",
      why: "Perché questa azienda?",
      whyPh: "Apprezzo particolarmente la vostra cultura dell'innovazione...",
      tone: "Tono di Scrittura",
      tones: {
        professional: "Professionale & Formale",
        dynamic: "Dinamico & Entusiasta",
        creative: "Creativo & Originale",
        concise: "Conciso & Diretto"
      },
      btn: "Genera Lettera",
      copy: "Copia Lettera"
    },
    interview: {
      title: "Simulazione Colloquio IA",
      desc: "Genera domande personalizzate per preparare al meglio il colloquio di selezione.",
      role: "Ruolo Target",
      btn: "Genera Domande",
      tip: "Consiglio per la risposta:"
    },
    salary: {
      title: "Stima Retributiva di Mercato",
      role: "Ruolo ricercato",
      exp: "Anni di esperienza",
      city: "Città di lavoro",
      sector: "Settore aziendale",
      sectors: {
        tech: "Tecnologia & IT",
        finance: "Finanza & Banche",
        marketing: "Marketing & Vendite",
        health: "Salute & Farmaceutica",
        education: "Istruzione & Ricerca",
        industry: "Industria & Ingegneria"
      },
      estimate: "Forchetta Retributiva Annuale",
      median: "Retribuzione Mediana Lorda",
      factors: "Fattori di Mercato Chiave"
    },
    recruiter: {
      title: "Spazio Recruiter Intelligente",
      desc: "Carica l'offerta e i curriculum dei candidati. L'IA classifica i profili, evidenzia i punti di forza e motiva la selezione.",
      steps: {
        one: "1. Offerta di Lavoro",
        two: "2. Candidati",
        three: "3. Risultati & Classifica"
      },
      jobUpload: "Carica job description (PDF, DOCX, TXT)",
      addCandidate: "Aggiungi Candidato",
      candName: "Nome del Candidato",
      docs: "Documenti caricati:",
      btn: "Valuta e Classifica i Candidati",
      leaderboard: "Classifica Finale dei Candidati",
      exportReport: "Esporta Report HR",
      matchedKw: "Competenze Riscontrate",
      missingKw: "Competenze Mancanti",
      decision: "Raccomandazione:",
      decisions: {
        yes: "Colloquio",
        maybe: "Da approfondire",
        no: "Non selezionato"
      },
      favoritesOnly: "Solo preferiti",
      toggleFavorite: "Aggiungi ai preferiti",
      downloadZip: "Scarica ZIP",
      downloadZipTooltip: "Scarica archivio ZIP con tutti i documenti",
      shareBtn: "Condividi CV",
      shareBtnTooltip: "Genera link sicuro in sola lettura"
    },
    modal: {
      title: "Importa Curriculum Esistente",
      sub: "Trascina un file per estrarre automaticamente dati e competenze.",
      drop: "Trascina il tuo CV qui",
      dropSub: "Formati supportati: PDF, DOCX, TXT",
      progress: "Elaborazione dati con l'IA in corso...",
      extracted: "Dati estratti con successo!",
      options: "Cosa desideri fare?",
      fill: "Importa dati grezzi",
      fillDesc: "Compila i campi con i dati estratti.",
      summary: "Ottimizza sommario",
      summaryDesc: "Genera un profilo accattivante.",
      bullets: "Migliora esperienze",
      bulletsDesc: "Riscrivi le mansioni con metriche d'impatto.",
      full: "Ottimizzazione completa IA (Consigliata)",
      fullDesc: "Importa e perfeziona ogni elemento in un click."
    }
  },

  pt: {
    appTitle: "ResumeAI Pro",
    appSub: "Plataforma IA para Candidatos & Recrutadores",
    tabs: {
      editor: "✏️ Editor de Currículo",
      analyzer: "🔍 Analisador de Vagas",
      cover: "📄 Carta de Apresentação",
      interview: "🎯 Preparação de Entrevista",
      salary: "💰 Estimativa Salarial",
      recruiter: "👔 Espaço Recrutador"
    },
    actions: {
      save: "Salvar",
      export: "Exportar em PDF",
      ats: "Pontuação ATS",
      add: "Adicionar",
      remove: "Excluir",
      improveWithAi: "Melhorar com IA",
      generating: "Gerando...",
      copied: "Copiado para a área de transferência!",
      loading: "Analisando..."
    },
    editor: {
      bannerTitle: "Já possui um currículo?",
      bannerDesc: "Envie seu arquivo (PDF, DOCX, TXT). Nossa IA extrairá as informações para preencher o formulário e propor melhorias.",
      bannerBtn: "Importar meu CV",
      personalInfo: "Informações Pessoais",
      fullName: "Nome Completo",
      jobTitle: "Cargo Alvo",
      location: "Cidade / País",
      linkedin: "LinkedIn / Portfólio",
      summary: "Resumo Profissional",
      summaryPh: "Desenvolvedor apaixonado com sólidos conhecimentos...",
      experiences: "Experiência Profissional",
      role: "Cargo",
      company: "Empresa",
      startDate: "Data de Início",
      endDate: "Data de Término (ou Atual)",
      bullets: "Conquistas e Responsabilidades (uma por linha)",
      bulletsPh: "• Desenvolvi API REST de alta performance\n• Reduzi tempo de carregamento em 40%...",
      education: "Formação Acadêmica",
      degree: "Grau / Curso",
      school: "Instituição / Faculdade",
      year: "Ano de Conclusão",
      grade: "Nota / Menção",
      skills: "Competências Chave",
      skillsPh: "React, Python, Agile...",
      languages: "Idiomas",
      languageName: "Idioma",
      languageLevel: "Proficiência",
      projects: "Projetos & Portfólio",
      projectName: "Nome do Projeto",
      projectUrl: "Link (GitHub / Demo)",
      projectDesc: "Descrição sucinta...",
      certifications: "Certificações",
      certName: "Nome da Certificação",
      certIssuer: "Órgão Emissor",
      references: "Referências",
      referencesLabel: "Incluir no CV",
      referencesPh: "Referências disponíveis sob solicitação"
    },
    analyzer: {
      desc: "Cole uma vaga de emprego para avaliar a compatibilidade do currículo com os filtros ATS.",
      label: "Descrição da Vaga",
      ph: "Cole a descrição da vaga aqui...",
      btn: "Analisar Compatibilidade",
      matchScore: "Compatibilidade ATS Geral",
      foundKw: "Palavras-chave Validadas",
      missingKw: "Palavras-chave Ausentes",
      recs: "Recomendações Práticas",
      autoAdd: "Adicionar palavras-chave ausentes",
      noResults: "Cole a descrição da vaga para iniciar."
    },
    cover: {
      title: "Carta de Apresentação IA",
      company: "Nome da Empresa",
      role: "Cargo Desejado",
      why: "Por que esta empresa?",
      whyPh: "Admiro o compromisso da empresa com a inovação...",
      tone: "Tom de Escrita",
      tones: {
        professional: "Profissional & Formal",
        dynamic: "Dinâmico & Entusiasta",
        creative: "Criativo & Original",
        concise: "Conciso & Direto"
      },
      btn: "Gerar Carta",
      copy: "Copiar Carta"
    },
    interview: {
      title: "Simulação de Entrevista IA",
      desc: "Receba perguntas personalizadas de preparação com base no seu perfil e vaga.",
      role: "Cargo Pretendido",
      btn: "Gerar Perguntas",
      tip: "Dica de resposta:"
    },
    salary: {
      title: "Estimativa Salarial de Mercado",
      role: "Cargo desejado",
      exp: "Anos de experiência",
      city: "Cidade",
      sector: "Setor de atuação",
      sectors: {
        tech: "Tecnologia & TI",
        finance: "Finanças & Bancos",
        marketing: "Marketing & Vendas",
        health: "Saúde & Farmacêutica",
        education: "Educação & Pesquisa",
        industry: "Indústria & Engenharia"
      },
      estimate: "Faixa Salarial Estimada",
      median: "Mediana Salarial Anual",
      factors: "Fatores de Mercado"
    },
    recruiter: {
      title: "Painel de Recrutamento Inteligente",
      desc: "Envie a vaga e os currículos. A IA ranqueia os perfis, analisa competências e sugere decisões de contratação.",
      steps: {
        one: "1. Vaga de Emprego",
        two: "2. Candidatos",
        three: "3. Resultados e Classificação"
      },
      jobUpload: "Carregar vaga (PDF, DOCX, TXT)",
      addCandidate: "Adicionar Candidato",
      candName: "Nome do Candidato",
      docs: "Documentos carregados:",
      btn: "Avaliar e Ranquear Candidatos",
      leaderboard: "Classificação Final de Talentos",
      exportReport: "Exportar Relatório RH",
      matchedKw: "Competências Validadas",
      missingKw: "Competências Faltantes",
      decision: "Recomendação:",
      decisions: {
        yes: "Entrevista",
        maybe: "Em análise",
        no: "Não selecionado"
      },
      favoritesOnly: "Apenas favoritos",
      toggleFavorite: "Marcar como favorito",
      downloadZip: "Baixar ZIP",
      downloadZipTooltip: "Baixar arquivo compactado com todos os documentos",
      shareBtn: "Compartilhar CV",
      shareBtnTooltip: "Gerar link seguro de visualização"
    },
    modal: {
      title: "Importar Currículo Existente",
      sub: "Carregue seu currículo para preenchimento automático inteligente.",
      drop: "Solte o arquivo do CV aqui",
      dropSub: "Suporta PDF, DOCX e TXT",
      progress: "Processando informações com IA...",
      extracted: "Dados extraídos com sucesso!",
      options: "O que deseja fazer?",
      fill: "Importar dados brutos",
      fillDesc: "Preencher campos do formulário.",
      summary: "Otimizar perfil profissional",
      summaryDesc: "Criar resumo atrativo e moderno.",
      bullets: "Aprimorar realizações",
      bulletsDesc: "Destacar conquistas com métricas reais.",
      full: "Upgrade Completo por IA (Recomendado)",
      fullDesc: "Importar e aprimorar todo o currículo em um clique."
    }
  },

  nl: {
    appTitle: "ResumeAI Pro",
    appSub: "AI-platform voor Sollicitanten & Recruiters",
    tabs: {
      editor: "✏️ CV-Bewerker",
      analyzer: "🔍 Vacature Matcher",
      cover: "📄 Motivatiebrief",
      interview: "🎯 Sollicitatietraining",
      salary: "💰 Salarisindicatie",
      recruiter: "👔 Recruiter Dashboard"
    },
    actions: {
      save: "Opslaan",
      export: "Exporteren naar PDF",
      ats: "ATS-score",
      add: "Toevoegen",
      remove: "Verwijderen",
      improveWithAi: "Verbeteren met AI",
      generating: "Genereren...",
      copied: "Gekopieerd naar klembord!",
      loading: "Analyseren..."
    },
    editor: {
      bannerTitle: "Heb je al een CV?",
      bannerDesc: "Importeer een bestand (PDF, DOCX, TXT). Onze AI haalt gegevens op om het formulier in te vullen en verbeteringen voor te stellen.",
      bannerBtn: "Mijn CV importeren",
      personalInfo: "Persoonlijke Informatie",
      fullName: "Voor- & Achternaam",
      jobTitle: "Functietitel",
      location: "Stad / Land",
      linkedin: "LinkedIn / Portfolio",
      summary: "Professionele Samenvatting",
      summaryPh: "Gedreven ontwikkelaar met grondige kennis...",
      experiences: "Werkervaring",
      role: "Functie",
      company: "Bedrijf",
      startDate: "Startdatum",
      endDate: "Einddatum (of heden)",
      bullets: "Verantwoordelijkheden & Resultaten (één per regel)",
      bulletsPh: "• Schaalbare REST API ontworpen\n• Laadtijd met 40% verlaagd...",
      education: "Opleiding & Diploma's",
      degree: "Diploma / Studie",
      school: "Onderwijsinstelling",
      year: "Afstudeerjaar",
      grade: "Cijfer / Onderscheiding",
      skills: "Kernvaardigheden",
      skillsPh: "React, Python, Agile...",
      languages: "Talen",
      languageName: "Taal",
      languageLevel: "Niveau",
      projects: "Projecten & Portfolio",
      projectName: "Projectnaam",
      projectUrl: "Link (GitHub / Demo)",
      projectDesc: "Korte beschrijving...",
      certifications: "Certificaten",
      certName: "Certificaatnaam",
      certIssuer: "Uitgevende Instantie",
      references: "Referenties",
      referencesLabel: "Vermelden op CV",
      referencesPh: "Referenties op aanvraag"
    },
    analyzer: {
      desc: "Plak een vacaturetekst om de aansluiting op je CV te meten en ontbrekende trefwoorden te ontdekken.",
      label: "Vacatureomschrijving",
      ph: "Plak hier de volledige vacaturetekst...",
      btn: "Compatibiliteit Analyseren",
      matchScore: "Totale ATS Match Score",
      foundKw: "Gevonden trefwoorden",
      missingKw: "Ontbrekende trefwoorden",
      recs: "Praktische aanbevelingen",
      autoAdd: "Ontbrekende trefwoorden toevoegen",
      noResults: "Plak een vacature om de analyse te starten."
    },
    cover: {
      title: "AI Motivatiebrief",
      company: "Bedrijfsnaam",
      role: "Beoogde Functie",
      why: "Waarom dit bedrijf?",
      whyPh: "Ik bewonder jullie innovatieve aanpak...",
      tone: "Schrijfstijl",
      tones: {
        professional: "Professioneel & Formeel",
        dynamic: "Dynamisch & Enthousiast",
        creative: "Creatief & Origineel",
        concise: "Beknopt & Direct"
      },
      btn: "Brief Genereren",
      copy: "Brief Kopiëren"
    },
    interview: {
      title: "AI Sollicitatievoorbereiding",
      desc: "Ontvang op maat gemaakte interviewvragen en beantwoordingsstrategieën.",
      role: "Doelfunctie",
      btn: "Vragen Genereren",
      tip: "Antwoordtip:"
    },
    salary: {
      title: "Geschatte Marktwaarde",
      role: "Functietitel",
      exp: "Jaren ervaring",
      city: "Werklocatie",
      sector: "Sector",
      sectors: {
        tech: "Technologie & IT",
        finance: "Financiën & Bankwezen",
        marketing: "Marketing & Verkoop",
        health: "Zorg & Farmacie",
        education: "Onderwijs & Onderzoek",
        industry: "Industrie & Engineering"
      },
      estimate: "Geschatte Salarisbandbreedte",
      median: "Mediaan Jaarsalaris",
      factors: "Belangrijke Marktfactoren"
    },
    recruiter: {
      title: "Slimme Recruiter Omgeving",
      desc: "Upload vacatures en cv's van kandidaten. De AI rangschikt profielen, vergelijkt vaardigheden en onderbouwt selectiebeslissingen.",
      steps: {
        one: "1. Vacature",
        two: "2. Kandidaten",
        three: "3. Resultaten & Ranglijst"
      },
      jobUpload: "Vacature uploaden (PDF, DOCX, TXT)",
      addCandidate: "Kandidaat toevoegen",
      candName: "Naam van de kandidaat",
      docs: "Geüploade documenten:",
      btn: "Kandidaten Evalueren & Rangschikken",
      leaderboard: "Uiteindelijke Ranglijst",
      exportReport: "HR-Rapport Exporteren",
      matchedKw: "Gevonden Vaardigheden",
      missingKw: "Ontbrekende Vaardigheden",
      decision: "Besluitadvies:",
      decisions: {
        yes: "Interview",
        maybe: "Beoordelen",
        no: "Afgewezen"
      },
      favoritesOnly: "Alleen favorieten",
      toggleFavorite: "Als favoriet markeren",
      downloadZip: "ZIP Downloaden",
      downloadZipTooltip: "Download een ZIP-bestand met alle documenten",
      shareBtn: "CV Delen",
      shareBtnTooltip: "Genereer veilige alleen-lezen link"
    },
    modal: {
      title: "Bestaand CV Importeren",
      sub: "Sleep je bestand hierheen om het automatisch in te laten lezen door AI.",
      drop: "Sleep CV hierheen",
      dropSub: "Ondersteunt PDF, DOCX en TXT",
      progress: "AI-extractie wordt uitgevoerd...",
      extracted: "Succesvol uitgelezen!",
      options: "Wat wil je doen?",
      fill: "Gegevens invullen",
      fillDesc: "Velden automatisch aanvullen.",
      summary: "Profieltekst versterken",
      summaryDesc: "Schrijf een krachtige inleiding.",
      bullets: "Ervaringspunten verrijken",
      bulletsDesc: "Versterk beschrijvingen met meetbare KPI's.",
      full: "Volledige AI-Upgrade (Aanbevolen)",
      fullDesc: "Gegevens inlezen en direct compleet optimaliseren."
    }
  },

  pl: {
    appTitle: "ResumeAI Pro",
    appSub: "Platforma AI dla Kandydatów & Rekruterów",
    tabs: {
      editor: "✏️ Edytor CV",
      analyzer: "🔍 Analizator Ofert",
      cover: "📄 List Motywacyjny",
      interview: "🎯 Przygotowanie do Rozmowy",
      salary: "💰 Wycena Wynagrodzenia",
      recruiter: "👔 Panel Rekrutera"
    },
    actions: {
      save: "Zapisz",
      export: "Eksportuj do PDF",
      ats: "Wynik ATS",
      add: "Dodaj",
      remove: "Usuń",
      improveWithAi: "Ulepsz z AI",
      generating: "Generowanie...",
      copied: "Skopiowano do schowka!",
      loading: "Trwa analiza..."
    },
    editor: {
      bannerTitle: "Masz już gotowe CV?",
      bannerDesc: "Prześlij plik (PDF, DOCX, TXT). Nasza sztuczna inteligencja odczyta dane, wypełni formularz i zasugeruje kluczowe ulepszenia.",
      bannerBtn: "Importuj moje CV",
      personalInfo: "Dane Osobowe",
      fullName: "Imię i Nazwisko",
      jobTitle: "Stanowisko Docelowe",
      location: "Miasto / Kraj",
      linkedin: "LinkedIn / Portfolio",
      summary: "Podsumowanie Zawodowe",
      summaryPh: "Zaangażowany specjalista z bogatym doświadczeniem...",
      experiences: "Doświadczenie Zawodowe",
      role: "Stanowisko",
      company: "Firma",
      startDate: "Data Rozpoczęcia",
      endDate: "Data Zakończenia (lub obecnie)",
      bullets: "Osiągnięcia i Zadania (jedno na wiersz)",
      bulletsPh: "• Opracowałem skalowalne API REST\n• Skróciłem czas ładowania o 40%...",
      education: "Wykształcenie",
      degree: "Tytuł / Kierunek",
      school: "Uczelnia / Szkoła",
      year: "Rok Ukończenia",
      grade: "Ocena / Wyróżnienie",
      skills: "Kluczowe Umiejętności",
      skillsPh: "React, Python, Agile...",
      languages: "Języki",
      languageName: "Język",
      languageLevel: "Poziom",
      projects: "Projekty i Portfolio",
      projectName: "Nazwa Projektu",
      projectUrl: "Link (GitHub / Demo)",
      projectDesc: "Zwięzły opis...",
      certifications: "Certyfikaty",
      certName: "Nazwa Certyfikatu",
      certIssuer: "Organizacja Wydająca",
      references: "Referencje",
      referencesLabel: "Dołącz do CV",
      referencesPh: "Referencje dostępne na życzenie"
    },
    analyzer: {
      desc: "Wklej opis oferty pracy, aby sprawdzić dopasowanie ATS ze swoim CV.",
      label: "Opis Stanowiska",
      ph: "Wklej tutaj treść oferty pracy...",
      btn: "Sprawdź Dopasowanie",
      matchScore: "Ogólny Wynik ATS",
      foundKw: "Dopasowane Słowa Kluczowe",
      missingKw: "Brakujące Słowa Kluczowe",
      recs: "Rekomendacje Optymalizacji",
      autoAdd: "Dodaj brakujące słowa kluczowe",
      noResults: "Wklej ofertę pracy, aby rozpocząć."
    },
    cover: {
      title: "List Motywacyjny AI",
      company: "Nazwa Firmy",
      role: "Docelowe Stanowisko",
      why: "Dlaczego ta firma?",
      whyPh: "Szczególnie cenię Wasze innowacje technologiczne...",
      tone: "Ton Wypowiedzi",
      tones: {
        professional: "Profesjonalny & Formalny",
        dynamic: "Dynamiczny & Entuzjastyczny",
        creative: "Kreatywny & Opowiadający historię",
        concise: "Zwięzły & Konkretny"
      },
      btn: "Generuj List",
      copy: "Kopiuj List"
    },
    interview: {
      title: "Symulacja Rozmowy Kwalifikacyjnej",
      desc: "Otrzymaj dedykowane pytania rekrutacyjne i wskazówki dotyczące odpowiedzi.",
      role: "Stanowisko Docelowe",
      btn: "Generuj Pytania",
      tip: "Wskazówka do odpowiedzi:"
    },
    salary: {
      title: "Szacunkowa Wycena Rynkowa",
      role: "Stanowisko",
      exp: "Lata doświadczenia",
      city: "Miasto",
      sector: "Branża",
      sectors: {
        tech: "Technologia & IT",
        finance: "Finanse & Bankowość",
        marketing: "Marketing & Sprzedaż",
        health: "Zdrowie & Farmacja",
        education: "Edukacja & Nauka",
        industry: "Przemysł & Inżynieria"
      },
      estimate: "Szacowany Przedział Wynagrodzenia",
      median: "Roczna Mediana Rynkowa",
      factors: "Kluczowe Czynniki Wpływające"
    },
    recruiter: {
      title: "Inteligentny Panel Rekrutera",
      desc: "Prześlij opis oferty oraz CV kandydatów. AI ocenia dopasowanie ATS, analizuje mocne strony i uzasadnia decyzje.",
      steps: {
        one: "1. Oferta Pracy",
        two: "2. Kandydaci",
        three: "3. Wyniki i Ranking"
      },
      jobUpload: "Prześlij ofertę (PDF, DOCX, TXT)",
      addCandidate: "Dodaj Kandydata",
      candName: "Imię i Nazwisko Kandydata",
      docs: "Załączone dokumenty:",
      btn: "Oceń i Uszereguj Kandydatów",
      leaderboard: "Ostateczny Ranking Talentów",
      exportReport: "Eksportuj Raport HR",
      matchedKw: "Dopasowane Umiejętności",
      missingKw: "Brakujące Umiejętności",
      decision: "Rekomendacja:",
      decisions: {
        yes: "Rozmowa",
        maybe: "Do weryfikacji",
        no: "Odrzucony"
      },
      favoritesOnly: "Tylko ulubieni",
      toggleFavorite: "Oznacz jako ulubionego",
      downloadZip: "Pobierz ZIP",
      downloadZipTooltip: "Pobierz archiwum ZIP ze wszystkimi dokumentami",
      shareBtn: "Udostępnij CV",
      shareBtnTooltip: "Generuj bezpieczny link tylko do odczytu"
    },
    modal: {
      title: "Importuj Istniejące CV",
      sub: "Przeciągnij plik, a inteligentny parser AI odczyta Twoje dane.",
      drop: "Upuść plik CV tutaj",
      dropSub: "Obsługuje formaty PDF, DOCX oraz TXT",
      progress: "Trwa odczytywanie danych...",
      extracted: "Dane zostały pomyślnie odczytane!",
      options: "Wybierz działanie:",
      fill: "Zaimportuj dane",
      fillDesc: "Wypełnij pola formularza.",
      summary: "Ulepsz podsumowanie",
      summaryDesc: "Stwórz angażujący profil kandydata.",
      bullets: "Wzmocnij opisy osiągnięć",
      bulletsDesc: "Dodaj mierzalne wyniki i KPI.",
      full: "Kompleksowa optymalizacja AI (Zalecane)",
      fullDesc: "Zaimportuj i udoskonal całe CV jednym kliknięciem."
    }
  },

  zh: {
    appTitle: "ResumeAI Pro",
    appSub: "面向求职者与招聘官的智能 AI 平台",
    tabs: {
      editor: "✏️ 简历编辑器",
      analyzer: "🔍 职位匹配分析",
      cover: "📄 智能求职信",
      interview: "🎯 面试辅导模拟",
      salary: "💰 薪酬行情估算",
      recruiter: "👔 招聘官工作台"
    },
    actions: {
      save: "保存",
      export: "导出为 PDF",
      ats: "ATS 匹配分",
      add: "添加",
      remove: "删除",
      improveWithAi: "AI 一键润色",
      generating: "正在生成中...",
      copied: "已复制到剪贴板！",
      loading: "正在深度分析..."
    },
    editor: {
      bannerTitle: "已有现成简历？",
      bannerDesc: "上传文件 (PDF, DOCX, TXT)，AI 智能引擎将快速提取信息并推荐高价值优化方案。",
      bannerBtn: "导入我的简历",
      personalInfo: "个人基本信息",
      fullName: "姓名",
      jobTitle: "期望职位",
      location: "所在城市 / 国家",
      linkedin: "领英 / 个人主页",
      summary: "个人专业总结",
      summaryPh: "充满热情的技术工程师，拥有丰富的项目实战经验...",
      experiences: "工作与项目经验",
      role: "担任职位",
      company: "公司名称",
      startDate: "入职时间",
      endDate: "离职时间 (或至今)",
      bullets: "主要业绩与核心职责 (每行一条)",
      bulletsPh: "• 架构设计高可用微服务 API\n• 页面渲染耗时降低 40%...",
      education: "教育背景",
      degree: "学位 / 专业",
      school: "毕业院校",
      year: "毕业年份",
      grade: "学业成绩 / 荣誉",
      skills: "核心技能",
      skillsPh: "React, Python, Agile...",
      languages: "语言能力",
      languageName: "语种",
      languageLevel: "掌握程度",
      projects: "精选项目",
      projectName: "项目名称",
      projectUrl: "项目链接 (GitHub / 演示)",
      projectDesc: "简要介绍...",
      certifications: "专业认证",
      certName: "证书名称",
      certIssuer: "发证机构",
      references: "推荐人",
      referencesLabel: "在简历上展示",
      referencesPh: "可根据要求提供推荐人"
    },
    analyzer: {
      desc: "粘贴招聘 JD，智能评估与当前简历的匹配程度并找出缺失核心关键词。",
      label: "职位描述 (JD)",
      ph: "在此粘贴完整的职位描述...",
      btn: "开始匹配分析",
      matchScore: "总体 ATS 匹配分",
      foundKw: "已匹配技能点",
      missingKw: "缺失核心技能点",
      recs: "针对性改进建议",
      autoAdd: "一键补充缺失关键词",
      noResults: "请先粘贴职位描述后发起分析。"
    },
    cover: {
      title: "AI 智能求职信",
      company: "目标公司名称",
      role: "应聘岗位",
      why: "为什么选择该公司？",
      whyPh: "我长期关注贵公司在行业内的卓越表现与技术创新...",
      tone: "写作风格与语气",
      tones: {
        professional: "专业且严谨",
        dynamic: "充满活力与热情",
        creative: "富有创意与叙事感",
        concise: "干练直接"
      },
      btn: "一键生成求职信",
      copy: "复制信件文本"
    },
    interview: {
      title: "AI 模拟面试备战",
      desc: "根据您的履历与应聘岗位定制高频面试真题与应答策略。",
      role: "目标岗位",
      btn: "生成面试问题",
      tip: "高分回答策略："
    },
    salary: {
      title: "市场薪酬评估",
      role: "职位名称",
      exp: "工作年限",
      city: "工作城市",
      sector: "行业领域",
      sectors: {
        tech: "互联网与高新科技",
        finance: "金融、银行与保险",
        marketing: "市场与品牌营销",
        health: "医疗健康与制药",
        education: "教育与科研机构",
        industry: "制造业与工程工业"
      },
      estimate: "预估年薪区间",
      median: "行业中位数水平",
      factors: "关键市场影响因子"
    },
    recruiter: {
      title: "智能招聘官工作台",
      desc: "上传职位要求及多份候选人简历，AI 自动评分、生成排名榜单、梳理人岗匹配优势并提供决策依据。",
      steps: {
        one: "1. 职位要求",
        two: "2. 候选人档案",
        three: "3. 评估与排行榜"
      },
      jobUpload: "上传职位描述 (PDF, DOCX, TXT)",
      addCandidate: "添加候选人",
      candName: "候选人姓名",
      docs: "已载入文档：",
      btn: "开始智能评审与排名",
      leaderboard: "候选人匹配最终榜单",
      exportReport: "导出 HR 评审报告",
      matchedKw: "匹配技能点",
      missingKw: "缺失技能点",
      decision: "录取建议：",
      decisions: {
        yes: "安排面试",
        maybe: "列入考察",
        no: "暂不考虑"
      },
      favoritesOnly: "仅看收藏候选人",
      toggleFavorite: "标记为收藏",
      downloadZip: "打包下载 ZIP",
      downloadZipTooltip: "下载包含所有候选人文档的压缩包",
      shareBtn: "分享简历",
      shareBtnTooltip: "生成安全的只读分享链接"
    },
    modal: {
      title: "导入已有简历",
      sub: "上传文件，智能分析引擎将快速提取内容填入表单。",
      drop: "将简历拖拽至此处",
      dropSub: "支持 PDF, DOCX 及 TXT 格式",
      progress: "正在解析简历内容...",
      extracted: "数据解析成功！",
      options: "请选择处理方式：",
      fill: "直接导入数据",
      fillDesc: "填充基础表单字段。",
      summary: "润色个人亮点",
      summaryDesc: "生成高端个人专业概述。",
      bullets: "量化工作经历",
      bulletsDesc: "以量化指标优化成果描述。",
      full: "全面深度优化 (强烈推荐)",
      fullDesc: "一键导入并全面提升简历竞争力。"
    }
  },

  ja: {
    appTitle: "ResumeAI Pro",
    appSub: "求職者と採用担当者のためのAIプラットフォーム",
    tabs: {
      editor: "✏️ 職務経歴書エディタ",
      analyzer: "🔍 求人マッチング",
      cover: "📄 志望動機書",
      interview: "🎯 面接シミュレーション",
      salary: "💰 想定年収診断",
      recruiter: "👔 採用担当者ダッシュボード"
    },
    actions: {
      save: "保存する",
      export: "PDFで書き出し",
      ats: "ATS適合スコア",
      add: "追加",
      remove: "削除",
      improveWithAi: "AIで最適化",
      generating: "生成中...",
      copied: "クリップボードにコピーしました！",
      loading: "分析中..."
    },
    editor: {
      bannerTitle: "すでに経歴書をお持ちですか？",
      bannerDesc: "ファイル(PDF, DOCX, TXT)をアップロードすると、AIが情報を自動抽出し、魅力的な改善案を提示します。",
      bannerBtn: "職務経歴書を読み込む",
      personalInfo: "基本情報",
      fullName: "氏名",
      jobTitle: "希望職種・役職",
      location: "所在地（市区町村・国）",
      linkedin: "LinkedIn / ポートフォリオ",
      summary: "自己PR・職務要約",
      summaryPh: "実務経験豊富なエンジニアとして...",
      experiences: "職務経歴",
      role: "担当役職",
      company: "会社名",
      startDate: "開始年月",
      endDate: "終了年月（または現在）",
      bullets: "主な実績・業務内容（1行に1項目）",
      bulletsPh: "• スケーラブルなREST APIを設計・構築\n• ロード時間を40%短縮...",
      education: "学歴・資格",
      degree: "学位・専攻",
      school: "学校名・大学名",
      year: "卒業年",
      grade: "成績・特記事項",
      skills: "保有スキル",
      skillsPh: "React, Python, Agile...",
      languages: "語学力",
      languageName: "言語",
      languageLevel: "レベル",
      projects: "主なプロジェクト",
      projectName: "プロジェクト名",
      projectUrl: "リンク (GitHub / デモ)",
      projectDesc: "プロジェクト概要...",
      certifications: "資格・認定",
      certName: "資格名",
      certIssuer: "発行機関",
      references: "推薦人",
      referencesLabel: "経歴書に記載する",
      referencesPh: "要望に応じて推薦人情報を提供可能"
    },
    analyzer: {
      desc: "募集要項を貼り付けると、経歴書との適合度を自動診断し、不足しているキーワードを特定します。",
      label: "求人票の募集要項",
      ph: "ここに求人票のテキストを貼り付けてください...",
      btn: "マッチ度を分析する",
      matchScore: "全体ATSマッチ度",
      foundKw: "一致したスキル・キーワード",
      missingKw: "不足している必須キーワード",
      recs: "具体的な改善アドバイス",
      autoAdd: "不足キーワードを一括追加",
      noResults: "求人情報を貼り付けて分析を開始してください。"
    },
    cover: {
      title: "AI 志望動機・送付状",
      company: "志望企業名",
      role: "応募職種",
      why: "なぜこの企業を志望しますか？",
      whyPh: "貴社の革新的な事業姿勢とオープンソースへの貢献に強く共感し...",
      tone: "文章のトーン",
      tones: {
        professional: "フォーマル＆丁寧",
        dynamic: "意欲的＆情熱的",
        creative: "創造的＆ストーリー重視",
        concise: "簡潔＆ダイレクト"
      },
      btn: "志望動機を生成",
      copy: "テキストをコピー"
    },
    interview: {
      title: "AI 面接対策シミュレーション",
      desc: "あなたの経歴と応募ポジションに合わせた実践的な質問と回答のポイントを生成します。",
      role: "志望職種",
      btn: "想定質問を生成する",
      tip: "回答のポイント："
    },
    salary: {
      title: "想定年収・市場価値診断",
      role: "希望職種",
      exp: "実務経験年数",
      city: "勤務地",
      sector: "業界・セクター",
      sectors: {
        tech: "IT・テクノロジー",
        finance: "金融・保険",
        marketing: "マーケティング・広告",
        health: "医療・製薬",
        education: "教育・研究機関",
        industry: "製造・エンジニアリング"
      },
      estimate: "想定年収レンジ",
      median: "市場中央値（額面）",
      factors: "年収に影響を与える主な要因"
    },
    recruiter: {
      title: "採用担当者スマート管理",
      desc: "求人票と応募書類をアップロードすると、AIが適合度順にランキングし、強みの分析と採否の推薦理由を作成します。",
      steps: {
        one: "1. 募集求人",
        two: "2. 応募者一覧",
        three: "3. 評価結果・順位"
      },
      jobUpload: "求人票ファイルをアップロード (PDF, DOCX, TXT)",
      addCandidate: "応募者を追加",
      candName: "応募者氏名",
      docs: "アップロード済み書類：",
      btn: "候補者を一括評価・ランキング",
      leaderboard: "候補者最終ランキング",
      exportReport: "採用レポートを出力",
      matchedKw: "合致したスキル",
      missingKw: "不足スキル",
      decision: "推薦結果：",
      decisions: {
        yes: "面接へ進む",
        maybe: "要検討",
        no: "見送り"
      },
      favoritesOnly: "お気に入りのみ表示",
      toggleFavorite: "お気に入りに登録",
      downloadZip: "ZIPで一括ダウンロード",
      downloadZipTooltip: "全候補者の書類をまとめたZIPをダウンロード",
      shareBtn: "経歴書を共有",
      shareBtnTooltip: "閲覧専用の安全なリンクを生成"
    },
    modal: {
      title: "既存の経歴書を取り込む",
      sub: "経歴書ファイルをドロップすると、AIが自動解析して入力フォームに反映します。",
      drop: "ここにファイルをドロップ",
      dropSub: "PDF, DOCX, TXT 形式に対応",
      progress: "AIが情報を解析中...",
      extracted: "解析が完了しました！",
      options: "実行するアクションを選択してください：",
      fill: "基本データを取り込む",
      fillDesc: "解析結果をフォームに自動入力します。",
      summary: "職務要約をブラッシュアップ",
      summaryDesc: "説得力のある自己PR文を作成します。",
      bullets: "実績箇条書きを強化",
      bulletsDesc: "数値やKPIを交えた具体的な表現に改善します。",
      full: "フルAIアップグレード（推奨）",
      fullDesc: "取り込みと文章全体の最適化をワンクリックで実行します。"
    }
  },

  ko: {
    appTitle: "ResumeAI Pro",
    appSub: "구직자와 채용담당자를 위한 AI 플랫폼",
    tabs: {
      editor: "✏️ 이력서 작성기",
      analyzer: "🔍 채용공고 매칭",
      cover: "📄 자기소개서",
      interview: "🎯 면접 시뮬레이션",
      salary: "💰 희망 연봉 진단",
      recruiter: "👔 채용담당자 공간"
    },
    actions: {
      save: "저장하기",
      export: "PDF로 내보내기",
      ats: "ATS 점수",
      add: "추가",
      remove: "삭제",
      improveWithAi: "AI로 최적화",
      generating: "생성 중...",
      copied: "클립보드에 복사되었습니다!",
      loading: "분석 중..."
    },
    editor: {
      bannerTitle: "작성해 둔 이력서가 있으신가요?",
      bannerDesc: "파일(PDF, DOCX, TXT)을 가져오면 AI가 내용을 자동 추출하여 양식을 채우고 맞춤 개선점을 제안합니다.",
      bannerBtn: "내 이력서 가져오기",
      personalInfo: "기본 인적사항",
      fullName: "성명",
      jobTitle: "지원 직무",
      location: "거주 지역 / 국가",
      linkedin: "링크드인 / 포트폴리오",
      summary: "전문성 요약 (자기소개)",
      summaryPh: "열정적이고 탄탄한 실무 경험을 보유한 개발자...",
      experiences: "경력 사항",
      role: "직책 / 역할",
      company: "회사명",
      startDate: "시작일",
      endDate: "종료일 (또는 재직 중)",
      bullets: "주요 성과 및 업무 (한 줄에 하나씩)",
      bulletsPh: "• 고성능 REST API 설계 및 구축\n• 서비스 로딩 시간 40% 단축...",
      education: "학력 사항",
      degree: "학위 / 전공",
      school: "학교명",
      year: "졸업년도",
      grade: "학점 / 특기사항",
      skills: "핵심 역량 및 기술",
      skillsPh: "React, Python, Agile...",
      languages: "외국어 능력",
      languageName: "언어",
      languageLevel: "수준",
      projects: "주요 프로젝트",
      projectName: "프로젝트명",
      projectUrl: "링크 (GitHub / 데모)",
      projectDesc: "프로젝트 간략 설명...",
      certifications: "자격 및 인증",
      certName: "자격증명",
      certIssuer: "발급기관",
      references: "추천인",
      referencesLabel: "이력서에 표시",
      referencesPh: "요청 시 추천인 제공 가능"
    },
    analyzer: {
      desc: "채용공고를 입력하면 이력서와의 일치도를 진단하고 누락된 필수 키워드를 찾아냅니다.",
      label: "채용공고 직무 기술서",
      ph: "전체 채용공고 내용을 여기에 붙여넣으세요...",
      btn: "공고 적합도 분석",
      matchScore: "전체 ATS 적합 점수",
      foundKw: "확인된 보유 키워드",
      missingKw: "보완이 필요한 핵심 키워드",
      recs: "맞춤형 개선 권장사항",
      autoAdd: "누락된 키워드 자동 추가",
      noResults: "채용공고를 입력한 후 분석을 시작하세요."
    },
    cover: {
      title: "AI 자기소개서",
      company: "지원 회사명",
      role: "지원 포지션",
      why: "지원 동기",
      whyPh: "귀사의 지속적인 혁신과 오픈소스 생태계 기여에 깊이 매료되어...",
      tone: "작성 어조",
      tones: {
        professional: "전문적이고 정중한 어조",
        dynamic: "열정적이고 자신감 있는 어조",
        creative: "스토리 중심의 독창적 어조",
        concise: "간결하고 명확한 어조"
      },
      btn: "자기소개서 생성",
      copy: "내용 복사하기"
    },
    interview: {
      title: "AI 면접 코칭",
      desc: "이력서와 지원 직무에 맞춘 예상 면접 질문과 모범 답변 전략을 생성합니다.",
      role: "목표 직무",
      btn: "면접 질문 생성하기",
      tip: "답변 핵심 전략:"
    },
    salary: {
      title: "시장 연봉 가치 분석",
      role: "직무명",
      exp: "경력 연수",
      city: "근무 지역",
      sector: "산업 분야",
      sectors: {
        tech: "IT 및 소프트웨어",
        finance: "금융 및 은행",
        marketing: "마케팅 및 영업",
        health: "의료 및 바이오",
        education: "교육 및 연구",
        industry: "제조 및 엔지니어링"
      },
      estimate: "예상 연봉 범위",
      median: "시장 중간값 (세전)",
      factors: "연봉 영향 핵심 지표"
    },
    recruiter: {
      title: "스마트 채용관리 대시보드",
      desc: "채용공고와 지원자 서류를 업로드하면 AI가 순위를 매기고 직무 적합성을 정밀 분석합니다.",
      steps: {
        one: "1. 채용공고",
        two: "2. 지원자 서류",
        three: "3. 분석 및 랭킹"
      },
      jobUpload: "공고 파일 업로드 (PDF, DOCX, TXT)",
      addCandidate: "지원자 추가",
      candName: "지원자 이름",
      docs: "등록된 지원 서류:",
      btn: "지원자 일괄 평가 및 순위 산출",
      leaderboard: "최종 인재 순위표",
      exportReport: "채용 심사 보고서 내보내기",
      matchedKw: "일치하는 역량",
      missingKw: "미달 역량",
      decision: "추천 결론:",
      decisions: {
        yes: "면접 진행",
        maybe: "재검토",
        no: "불합격"
      },
      favoritesOnly: "관심 지원자만 보기",
      toggleFavorite: "관심 지원자로 등록",
      downloadZip: "ZIP 압축 다운로드",
      downloadZipTooltip: "모든 지원자 서류를 하나의 ZIP 파일로 다운로드",
      shareBtn: "이력서 공유",
      shareBtnTooltip: "안전한 읽기 전용 공유 링크 생성"
    },
    modal: {
      title: "기존 이력서 가져오기",
      sub: "파일을 끌어다 놓으면 AI가 텍스트를 분석하여 이력서를 구성합니다.",
      drop: "이력서 파일을 여기에 놓으세요",
      dropSub: "PDF, DOCX, TXT 파일 지원",
      progress: "AI가 데이터를 추출하고 있습니다...",
      extracted: "데이터 추출 완료!",
      options: "원하시는 작업을 선택하세요:",
      fill: "기본 정보 입력",
      fillDesc: "추출된 정보로 폼을 채웁니다.",
      summary: "자기소개 요약문 개선",
      summaryDesc: "전문적인 소개글을 생성합니다.",
      bullets: "경력 기술 고도화",
      bulletsDesc: "성과 중심의 측정 가능한 수치로 다듬습니다.",
      full: "AI 전체 최적화 (강력 추천)",
      fullDesc: "가져오기부터 문장 완성도 개선까지 한 번에 완료합니다."
    }
  },

  ar: {
    appTitle: "ResumeAI Pro",
    appSub: "منصة الذكاء الاصطناعي للطلاب ومسؤولي التوظيف",
    tabs: {
      editor: "✏️ محرر السيرة الذاتية",
      analyzer: "🔍 مطابقة الوظائف",
      cover: "📄 خطاب التغطية",
      interview: "🎯 تحضير المقابلة",
      salary: "💰 تقدير الراتب",
      recruiter: "👔 مساحة التوظيف"
    },
    actions: {
      save: "حفظ",
      export: "تصدير إلى PDF",
      ats: "درجة ATS",
      add: "إضافة",
      remove: "حذف",
      improveWithAi: "تحسين بالذكاء الاصطناعي",
      generating: "جاري الإنشاء...",
      copied: "تم النسخ إلى الحافظة!",
      loading: "جاري التحليل..."
    },
    editor: {
      bannerTitle: "هل لديك سيرة ذاتية بالفعل؟",
      bannerDesc: "قم باستيراد أي ملف (PDF، DOCX، TXT). سيقوم الذكاء الاصطناعي باستخراج معلوماتك لملء النموذج واقتراح تحسينات احترافية.",
      bannerBtn: "استيراد السيرة الذاتية",
      personalInfo: "المعلومات الشخصية",
      fullName: "الاسم الكامل",
      jobTitle: "المسمى الوظيفي",
      location: "المدينة / الدولة",
      linkedin: "لينكد إن / معرض الأعمال",
      summary: "الملخص المهني",
      summaryPh: "مطور شغوف يمتلك مهارات قوية في React...",
      experiences: "الخبرة العملية",
      role: "المسمى الوظيفي",
      company: "الشركة",
      startDate: "تاريخ البدء",
      endDate: "تاريخ الانتهاء (أو حتى الآن)",
      bullets: "الإنجازات والمهام (واحدة في كل سطر)",
      bulletsPh: "• تطوير واجهة برمجية REST معالجة 50 ألف طلب يومياً\n• تقليل وقت التحميل بنسبة 40%...",
      education: "التعليم والشهادات",
      degree: "الدرجة / التخصص",
      school: "المؤسسة / الجامعة",
      year: "سنة التخرج",
      grade: "التقدير / الملاحظات",
      skills: "المهارات الأساسية",
      skillsPh: "React, Python, Agile...",
      languages: "اللغات",
      languageName: "اللغة",
      languageLevel: "مستوى الإتقان",
      projects: "المشاريع والأعمال",
      projectName: "اسم المشروع",
      projectUrl: "الرابط (GitHub / العرض)",
      projectDesc: "وصف مختصر للمشروع...",
      certifications: "الشهادات المهنية",
      certName: "اسم الشهادة",
      certIssuer: "الجهة المصدرة",
      references: "المراجع",
      referencesLabel: "تضمين الملاحظة في السيرة الذاتية",
      referencesPh: "المراجع متاحة عند الطلب"
    },
    analyzer: {
      desc: "قم بلصق وصف الوظيفة لتقييم التوافق مع سيرتك الذاتية واكتشاف الكلمات المفتاحية الناقصة.",
      label: "وصف الوظيفة",
      ph: "الصق وصف الوظيفة الكامل هنا...",
      btn: "تحليل التوافق",
      matchScore: "نسبة التوافق الإجمالية ATS",
      foundKw: "الكلمات المفتاحية الموجودة",
      missingKw: "الكلمات المفتاحية المفقودة",
      recs: "توصيات التحسين",
      autoAdd: "إضافة الكلمات المفقودة",
      noResults: "يرجى لصق وصف الوظيفة لبدء التحليل."
    },
    cover: {
      title: "خطاب التغطية بالذكاء الاصطناعي",
      company: "اسم الشركة",
      role: "الوظيفة المستهدفة",
      why: "لماذا هذه الشركة؟",
      whyPh: "أقدر بشكل خاص التزامكم بالابتكار والتطوير...",
      tone: "أسلوب الكتابة",
      tones: {
        professional: "مهني ورسمي",
        dynamic: "حيوي وحماسي",
        creative: "إبداعي ومبتكر",
        concise: "مختصر ومباشر"
      },
      btn: "إنشاء الخطاب",
      copy: "نسخ الخطاب"
    },
    interview: {
      title: "التحضير للمقابلة",
      desc: "احصل على أسئلة مقابلة مخصصة بناءً على ملفك الشخصي والوظيفة المستهدفة.",
      role: "الوظيفة المستهدفة",
      btn: "إنشاء أسئلة المقابلة",
      tip: "نصيحة للإجابة:"
    },
    salary: {
      title: "تقدير الراتب",
      role: "الوظيفة المطلوبة",
      exp: "سنوات الخبرة",
      city: "مدينة العمل",
      sector: "قطاع العمل",
      sectors: {
        tech: "التكنولوجيا وتكنولوجيا المعلومات",
        finance: "المالية والبنوك",
        marketing: "التسويق والمبيعات",
        health: "الصحة والصيدلة",
        education: "التعليم والبحث العلمي",
        industry: "الصناعة والهندسة"
      },
      estimate: "نطاق الراتب المتوقع",
      median: "الوسيط السنوي الإجمالي",
      factors: "العوامل المؤثرة"
    },
    recruiter: {
      title: "مساحة التوظيف الذكية",
      desc: "قم بتحميل الوظيفة والسير الذاتية للمرشحين. سيقوم الذكاء الاصطناعي بتقييم المرشحين وترتيبهم وتوضيح الميزات.",
      steps: {
        one: "1. وصف الوظيفة",
        two: "2. المرشحون",
        three: "3. النتائج والتصنيف"
      },
      jobUpload: "انقر أو اسحب الوظيفة هنا (PDF, DOCX, TXT)",
      addCandidate: "إضافة مرشح",
      candName: "اسم المرشح",
      docs: "المستندات المحملة:",
      btn: "تقييم وترتيب المرشحين",
      leaderboard: "التصنيف النهائي للمرشحين",
      exportReport: "تصدير تقرير HR",
      matchedKw: "الكلمات المفتاحية المتطابقة",
      missingKw: "الكلمات المفقودة",
      decision: "التوصية:",
      decisions: {
        yes: "مقابلة",
        maybe: "قيد الدراسة",
        no: "غير مستوفٍ"
      },
      favoritesOnly: "المفضلون فقط",
      toggleFavorite: "إضافة للمفضلة",
      downloadZip: "تحميل ملف ZIP",
      downloadZipTooltip: "تحميل ملف مضغوط يحتوي على جميع مستندات المرشحين",
      shareBtn: "مشاركة السيرة الذاتية",
      shareBtnTooltip: "إنشاء رابط مشاركة آمن للعرض فقط"
    },
    modal: {
      title: "استيراد سيرة ذاتية حالية",
      sub: "اسحب ملفًا أو اختره. سيقوم المحلل باستخراج النص لملء سيرتك الذاتية.",
      drop: "اسحب السيرة الذاتية هنا",
      dropSub: "يدعم صيغ PDF و DOCX و TXT",
      progress: "جاري معالجة البيانات بالذكاء الاصطناعي...",
      extracted: "تم استخراج البيانات بنجاح!",
      options: "ما الذي تريد القيام به؟",
      fill: "استيراد البيانات الأساسية",
      fillDesc: "ملء الحقول بالقيم المستخرجة.",
      summary: "تحسين الملخص المهني",
      summaryDesc: "إنشاء ملخص احترافي.",
      bullets: "تحسين الخبرات العملية",
      bulletsDesc: "إعادة صياغة ودعم الوصف بالإنجازات والأرقام.",
      full: "تحسين شامل بالذكاء الاصطناعي (موصى به)",
      fullDesc: "استيراد وإعادة صياغة الملخص والخبرات بنقرة واحدة."
    }
  },

  ru: {
    appTitle: "ResumeAI Pro",
    appSub: "ИИ-платформа для соискателей и рекрутеров",
    tabs: {
      editor: "✏️ Редактор резюме",
      analyzer: "🔍 Анализ вакансий",
      cover: "📄 Сопроводительное письмо",
      interview: "🎯 Подготовка к интервью",
      salary: "💰 Оценка зарплаты",
      recruiter: "👔 Кабинет рекрутера"
    },
    actions: {
      save: "Сохранить",
      export: "Экспорт в PDF",
      ats: "Балл ATS",
      add: "Добавить",
      remove: "Удалить",
      improveWithAi: "Улучшить с ИИ",
      generating: "Создание...",
      copied: "Скопировано в буфер!",
      loading: "Анализируем..."
    },
    editor: {
      bannerTitle: "У вас уже есть резюме?",
      bannerDesc: "Загрузите файл (PDF, DOCX, TXT). ИИ извлечет данные, заполнит поля и предложит улучшения.",
      bannerBtn: "Импортировать резюме",
      personalInfo: "Личные данные",
      fullName: "Имя и Фамилия",
      jobTitle: "Желаемая должность",
      location: "Город / Страна",
      linkedin: "LinkedIn / Портфолио",
      summary: "Профессиональное резюме",
      summaryPh: "Опытный разработчик с глубоким знанием...",
      experiences: "Опыт работы",
      role: "Должность",
      company: "Компания",
      startDate: "Дата начала",
      endDate: "Дата окончания (или по н.в.)",
      bullets: "Обязанности и достижения (по одному на строку)",
      bulletsPh: "• Разработал масштабируемый REST API\n• Ускорил загрузку страниц на 40%...",
      education: "Образование",
      degree: "Степень / Специальность",
      school: "Университет / ВУЗ",
      year: "Год окончания",
      grade: "Оценка / Диплом с отличием",
      skills: "Ключевые навыки",
      skillsPh: "React, Python, Agile...",
      languages: "Владение языками",
      languageName: "Язык",
      languageLevel: "Уровень",
      projects: "Проекты и портфолио",
      projectName: "Название проекта",
      projectUrl: "Ссылка (GitHub / Демо)",
      projectDesc: "Краткое описание...",
      certifications: "Сертификаты",
      certName: "Название сертификата",
      certIssuer: "Организация",
      references: "Рекомендации",
      referencesLabel: "Указать в резюме",
      referencesPh: "Рекомендации предоставляются по запросу"
    },
    analyzer: {
      desc: "Вставьте описание вакансии для проверки совпадения с резюме и поиска пропущенных ключевых слов.",
      label: "Описание вакансии",
      ph: "Вставьте текст вакансии сюда...",
      btn: "Анализировать совместимость",
      matchScore: "Общий балл ATS",
      foundKw: "Найденные навыки",
      missingKw: "Недостающие ключевые навыки",
      recs: "Практические рекомендации",
      autoAdd: "Добавить недостающие навыки",
      noResults: "Пожалуйста, вставьте текст вакансии."
    },
    cover: {
      title: "Сопроводительное письмо ИИ",
      company: "Название компании",
      role: "Желаемая должность",
      why: "Почему именно эта компания?",
      whyPh: "Меня вдохновляет технологическое лидерство компании...",
      tone: "Стиль письма",
      tones: {
        professional: "Профессиональный и формальный",
        dynamic: "Энергичный и вдохновляющий",
        creative: "Креативный",
        concise: "Краткий и по делу"
      },
      btn: "Создать письмо",
      copy: "Скопировать письмо"
    },
    interview: {
      title: "ИИ-тренажер собеседований",
      desc: "Получите список реалистичных вопросов и советов по ответам под ваш профиль.",
      role: "Целевая должность",
      btn: "Сгенерировать вопросы",
      tip: "Стратегия ответа:"
    },
    salary: {
      title: "Оценка рыночной зарплаты",
      role: "Должность",
      exp: "Опыт работы (лет)",
      city: "Город",
      sector: "Отрасль",
      sectors: {
        tech: "IT и разработка",
        finance: "Финансы и банки",
        marketing: "Маркетинг и продажи",
        health: "Медицина и фарма",
        education: "Образование и наука",
        industry: "Производство и инженерия"
      },
      estimate: "Ожидаемый диапазон зарплаты",
      median: "Рыночная медиана (брутто)",
      factors: "Ключевые рыночные факторы"
    },
    recruiter: {
      title: "Панель умного рекрутера",
      desc: "Загрузите вакансию и резюме кандидатов. ИИ распределит их по рейтингу, оценит навыки и обоснует решения.",
      steps: {
        one: "1. Вакансия",
        two: "2. Кандидаты",
        three: "3. Итоги и рейтинг"
      },
      jobUpload: "Загрузить вакансию (PDF, DOCX, TXT)",
      addCandidate: "Добавить кандидата",
      candName: "ФИО кандидата",
      docs: "Документы:",
      btn: "Оценить и составить рейтинг",
      leaderboard: "Итоговый рейтинг кандидатов",
      exportReport: "Экспорт отчета HR",
      matchedKw: "Совпадающие навыки",
      missingKw: "Недостающие навыки",
      decision: "Рекомендация:",
      decisions: {
        yes: "Интервью",
        maybe: "На рассмотрении",
        no: "Отказ"
      },
      favoritesOnly: "Только избранные",
      toggleFavorite: "Добавить в избранное",
      downloadZip: "Скачать ZIP",
      downloadZipTooltip: "Скачать архив со всеми документами кандидатов",
      shareBtn: "Поделиться резюме",
      shareBtnTooltip: "Создать безопасную ссылку для просмотра"
    },
    modal: {
      title: "Импорт существующего резюме",
      sub: "Перетащите файл, и умный парсер заполнит разделы резюме.",
      drop: "Перетащите резюме сюда",
      dropSub: "Поддерживаются форматы PDF, DOCX и TXT",
      progress: "ИИ считывает данные...",
      extracted: "Данные успешно извлечены!",
      options: "Выберите действие:",
      fill: "Заполнить поля",
      fillDesc: "Заполнить стандартные поля формы.",
      summary: "Улучшить описание профиля",
      summaryDesc: "Создать убедительное вступление.",
      bullets: "Усилить достижения",
      bulletsDesc: "Добавить конкретные метрики и факты.",
      full: "Полная ИИ-оптимизация (Рекомендуется)",
      fullDesc: "Импорт и улучшение всех секций резюме в один клик."
    }
  },

  hi: {
    appTitle: "ResumeAI Pro",
    appSub: "उम्मीदवारों और रिक्रूटर्स के लिए एआई प्लेटफॉर्म",
    tabs: {
      editor: "✏️ बायोडाटा संपादक",
      analyzer: "🔍 जॉब मैचिंग",
      cover: "📄 कवर लेटर",
      interview: "🎯 इंटरव्यू तैयारी",
      salary: "💰 वेतन अनुमान",
      recruiter: "👔 रिक्रूटर स्पेस"
    },
    actions: {
      save: "सुरक्षित करें",
      export: "PDF निर्यात करें",
      ats: "ATS स्कोर",
      add: "जोड़ें",
      remove: "हटाएं",
      improveWithAi: "AI से बेहतर बनाएं",
      generating: "तैयार किया जा रहा है...",
      copied: "क्लिपबोर्ड पर कॉपी किया गया!",
      loading: "विश्लेषण जारी है..."
    },
    editor: {
      bannerTitle: "क्या आपके पास पहले से बायोडाटा है?",
      bannerDesc: "फाइल (PDF, DOCX, TXT) अपलोड करें। हमारा AI डेटा निकालकर फॉर्म भरेगा और सुझाव देगा।",
      bannerBtn: "बायोडाटा आयात करें",
      personalInfo: "व्यक्तिगत जानकारी",
      fullName: "पूरा नाम",
      jobTitle: "पद का नाम",
      location: "शहर / देश",
      linkedin: "LinkedIn / पोर्टफोलियो",
      summary: "व्यावसायिक सारांश",
      summaryPh: "सक्षम और अनुभवी डेवलपर...",
      experiences: "कार्य अनुभव",
      role: "पद",
      company: "कंपनी",
      startDate: "प्रारंभ तिथि",
      endDate: "समाप्ति तिथि (या वर्तमान)",
      bullets: "उपलब्धियां और जिम्मेदारियां",
      bulletsPh: "• स्केलेबल REST API का निर्माण किया\n• लोडिंग समय में 40% की कमी की...",
      education: "शिक्षा और योग्यता",
      degree: "डिग्री / पाठ्यक्रम",
      school: "विश्वविद्यालय / संस्थान",
      year: "उत्तीर्ण वर्ष",
      grade: "अंक / श्रेणी",
      skills: "प्रमुख कौशल",
      skillsPh: "React, Python, Agile...",
      languages: "भाषाएं",
      languageName: "भाषा",
      languageLevel: "दक्षता स्तर",
      projects: "परियोजनाएं",
      projectName: "परियोजना का नाम",
      projectUrl: "लिंक (GitHub / डेमो)",
      projectDesc: "संक्षिप्त विवरण...",
      certifications: "प्रमाणपत्र",
      certName: "प्रमाणपत्र का नाम",
      certIssuer: "जारीकर्ता",
      references: "संदर्भ",
      referencesLabel: "बायोडाटा में शामिल करें",
      referencesPh: "अनुरोध पर संदर्भ उपलब्ध"
    },
    analyzer: {
      desc: "अपने बायोडाटा की उपयुक्तता जांचने के लिए जॉब विवरण यहां पेस्ट करें।",
      label: "नौकरी का विवरण",
      ph: "पूरी जॉब प्रोफाइल यहां पेस्ट करें...",
      btn: "मैच का विश्लेषण करें",
      matchScore: "समग्र ATS स्कोर",
      foundKw: "पाए गए कौशल",
      missingKw: "अनुपस्थित कौशल",
      recs: "सुधार के सुझाव",
      autoAdd: "छूटे हुए कौशल जोड़ें",
      noResults: "कृपया नौकरी का विवरण पेस्ट करें।"
    },
    cover: {
      title: "एआई कवर लेटर",
      company: "कंपनी का नाम",
      role: "लक्षित पद",
      why: "यह कंपनी क्यों?",
      whyPh: "मैं आपकी कंपनी के तकनीकी नवाचार से बेहद प्रभावित हूं...",
      tone: "लेखन शैली",
      tones: {
        professional: "व्यावसायिक एवं औपचारिक",
        dynamic: "उत्साही एवं ऊर्जावान",
        creative: "रचनात्मक",
        concise: "संक्षिप्त और स्पष्ट"
      },
      btn: "कवर लेटर बनाएं",
      copy: "पत्र कॉपी करें"
    },
    interview: {
      title: "एआई इंटरव्यू अभ्यास",
      desc: "अपनी प्रोफाइल और पद के आधार पर संभावित प्रश्न और उत्तर देने की रणनीति प्राप्त करें।",
      role: "लक्षित पद",
      btn: "प्रश्न तैयार करें",
      tip: "उत्तर देने की रणनीति:"
    },
    salary: {
      title: "मार्केट वेतन अनुमान",
      role: "पद",
      exp: "अनुभव (वर्ष)",
      city: "कार्यस्थल शहर",
      sector: "उद्योग क्षेत्र",
      sectors: {
        tech: "सूचना प्रौद्योगिकी एवं सॉफ्टवेयर",
        finance: "वित्त एवं बैंकिंग",
        marketing: "मार्केटिंग एवं बिक्री",
        health: "स्वास्थ्य एवं फार्मा",
        education: "शिक्षा एवं अनुसंधान",
        industry: "विनिर्माण एवं इंजीनियरिंग"
      },
      estimate: "अनुमानित वेतन सीमा",
      median: "वार्षिक माध्यिका वेतन",
      factors: "प्रभावित करने वाले प्रमुख कारक"
    },
    recruiter: {
      title: "स्मार्ट रिक्रूटर डैशबोर्ड",
      desc: "नौकरी की आवश्यकताएं और उम्मीदवारों के बायोडाटा अपलोड करें। AI रैंकिंग तैयार करेगा और चयन का मार्गदर्शन करेगा।",
      steps: {
        one: "1. नौकरी विवरण",
        two: "2. उम्मीदवार",
        three: "3. परिणाम और रैंकिंग"
      },
      jobUpload: "नौकरी विवरण अपलोड करें (PDF, DOCX, TXT)",
      addCandidate: "उम्मीदवार जोड़ें",
      candName: "उम्मीदवार का नाम",
      docs: "अपलोड किए गए दस्तावेज:",
      btn: "उम्मीदवारों का मूल्यांकन और रैंकिंग करें",
      leaderboard: "अंतिम प्रतिभा रैंकिंग",
      exportReport: "HR रिपोर्ट निर्यात करें",
      matchedKw: "उपयुक्त कौशल",
      missingKw: "कमी वाले कौशल",
      decision: "सिफारिश:",
      decisions: {
        yes: "साक्षात्कार",
        maybe: "समीक्षाधीन",
        no: "अस्वीकृत"
      },
      favoritesOnly: "केवल पसंदीदा",
      toggleFavorite: "पसंदीदा बनाएं",
      downloadZip: "ZIP डाउनलोड करें",
      downloadZipTooltip: "सभी उम्मीदवारों के दस्तावेजों की ZIP डाउनलोड करें",
      shareBtn: "बायोडाटा साझा करें",
      shareBtnTooltip: "सुरक्षित व्यू-ओनली लिंक बनाएं"
    },
    modal: {
      title: "बायोडाटा आयात करें",
      sub: "फाइल यहां डालें, हमारा एआई डेटा पढ़कर बायोडाटा तैयार कर देगा।",
      drop: "बायोडाटा फाइल यहां छोड़ें",
      dropSub: "PDF, DOCX और TXT समर्थित",
      progress: "डेटा पढ़ा जा रहा है...",
      extracted: "डेटा सफलतापूर्वक निकाला गया!",
      options: "आप क्या करना चाहते हैं?",
      fill: "डेटा भरें",
      fillDesc: "फॉर्म को डेटा से भरें।",
      summary: "परिचय बेहतर बनाएं",
      summaryDesc: "आकर्षक सारांश तैयार करें।",
      bullets: "उपलब्धियों को निखारें",
      bulletsDesc: "मापने योग्य परिणामों के साथ विवरण सुधारें।",
      full: "संपूर्ण AI अपग्रेड (अनुशंसित)",
      fullDesc: "एक क्लिक में पूरा बायोडाटा तैयार और अनुकूलित करें।"
    }
  },

  tr: {
    appTitle: "ResumeAI Pro",
    appSub: "Adaylar ve İşe Alım Uzmanları için Yapay Zeka Platformu",
    tabs: {
      editor: "✏️ CV Düzenleyici",
      analyzer: "🔍 İlan Eşleştirici",
      cover: "📄 Ön Yazı",
      interview: "🎯 Mülakat Hazırlığı",
      salary: "💰 Maaş Tahmini",
      recruiter: "👔 İK & İşe Alım Alanı"
    },
    actions: {
      save: "Kaydet",
      export: "PDF Olarak İndir",
      ats: "ATS Skoru",
      add: "Ekle",
      remove: "Sil",
      improveWithAi: "Yapay Zeka ile Geliştir",
      generating: "Oluşturuluyor...",
      copied: "Panoya kopyalandı!",
      loading: "Analiz ediliyor..."
    },
    editor: {
      bannerTitle: "Hazır bir özgeçmişiniz var mı?",
      bannerDesc: "Dosyanızı (PDF, DOCX, TXT) yükleyin. Yapay zekamız verilerinizi okuyup formu doldursun ve öneriler sunsun.",
      bannerBtn: "CV'mi İçe Aktar",
      personalInfo: "Kişisel Bilgiler",
      fullName: "Ad Soyad",
      jobTitle: "Hedef Pozisyon / Unvan",
      location: "Şehir / Ülke",
      linkedin: "LinkedIn / Portfolyo",
      summary: "Özet & Ön Profil",
      summaryPh: "Alanında yetkin ve tutkulu yazılım uzmanı...",
      experiences: "İş Deneyimi",
      role: "Pozisyon",
      company: "Şirket",
      startDate: "Başlangıç Tarihi",
      endDate: "Bitiş Tarihi (veya günümüz)",
      bullets: "Başarılar ve Sorumluluklar (her satıra bir tane)",
      bulletsPh: "• Yüksek performanslı REST API geliştirdim\n• Yükleme süresini %40 azalttım...",
      education: "Eğitim ve Mezuniyet",
      degree: "Bölüm / Derece",
      school: "Üniversite / Okul",
      year: "Mezuniyet Yılı",
      grade: "Not Ortalaması / Derece",
      skills: "Temel Yetenekler",
      skillsPh: "React, Python, Agile...",
      languages: "Yabancı Diller",
      languageName: "Dil",
      languageLevel: "Seviye",
      projects: "Projeler & Portfolyo",
      projectName: "Proje Adı",
      projectUrl: "Bağlantı (GitHub / Demo)",
      projectDesc: "Kısa açıklama...",
      certifications: "Sertifikalar",
      certName: "Sertifika Adı",
      certIssuer: "Veren Kurum",
      references: "Referanslar",
      referencesLabel: "Özgeçmişte Göster",
      referencesPh: "Talep edildiğinde referans sağlanabilir"
    },
    analyzer: {
      desc: "CV'nizin ATS uyumluluğunu ölçmek ve eksik anahtar kelimeleri tespit etmek için iş ilanını yapıştırın.",
      label: "İş Tanımı",
      ph: "İş ilanının tam metnini buraya yapıştırın...",
      btn: "Uyumluluğu Analiz Et",
      matchScore: "Genel ATS Uyum Skoru",
      foundKw: "Eşleşen Yetenekler",
      missingKw: "Eksik Anahtar Kelimeler",
      recs: "Geliştirme Önerileri",
      autoAdd: "Eksik yetenekleri ekle",
      noResults: "Lütfen analiz için bir iş ilanı metni girin."
    },
    cover: {
      title: "Yapay Zeka Ön Yazı",
      company: "Şirket Adı",
      role: "Hedef Pozisyon",
      why: "Neden bu şirket?",
      whyPh: "Yenilikçi vizyonunuzu ve teknolojiye katkılarınızı takdir ediyorum...",
      tone: "Yazım Dili",
      tones: {
        professional: "Profesyonel & Resmi",
        dynamic: "Dinamik & İstekli",
        creative: "Yaratıcı & Hikaye Anlatıcı",
        concise: "Öz & Net"
      },
      btn: "Ön Yazı Oluştur",
      copy: "Metni Kopyala"
    },
    interview: {
      title: "Yapay Zeka Mülakat Koçu",
      desc: "Profilinize ve hedeflediğiniz pozisyona özel mülakat soruları ve yanıt stratejileri edinin.",
      role: "Hedef Pozisyon",
      btn: "Soruları Oluştur",
      tip: "Yanıt Stratejisi:"
    },
    salary: {
      title: "Piyasa Maaş Tahmini",
      role: "Unvan",
      exp: "Deneyim (Yıl)",
      city: "Çalışma Şehri",
      sector: "Sektör",
      sectors: {
        tech: "Teknoloji & Yazılım",
        finance: "Finans & Bankacılık",
        marketing: "Pazarlama & Satış",
        health: "Sağlık & İlaç",
        education: "Eğitim & Araştırma",
        industry: "Üretim & Mühendislik"
      },
      estimate: "Tahmini Yıllık Maaş Skalası",
      median: "Piyasa Medyan Maaşı (Brüt)",
      factors: "Piyasayı Etkileyen Faktörler"
    },
    recruiter: {
      title: "Akıllı İK & İşe Alım Paneli",
      desc: "İş tanımını ve aday CV'lerini yükleyin. Yapay zeka adayları ATS puanına göre sıralar ve seçim gerekçelerini sunar.",
      steps: {
        one: "1. İş İlanı",
        two: "2. Aday Dosyaları",
        three: "3. Değerlendirme & Sıralama"
      },
      jobUpload: "İlan dosyasını yükleyin (PDF, DOCX, TXT)",
      addCandidate: "Aday Ekle",
      candName: "Aday Adı Soyadı",
      docs: "Yüklenen belgeler:",
      btn: "Adayları Değerlendir ve Sırala",
      leaderboard: "Aday Sıralaması",
      exportReport: "İK Raporunu İndir",
      matchedKw: "Eşleşen Yetenekler",
      missingKw: "Eksik Kriterler",
      decision: "Tavsiye Edilen Karar:",
      decisions: {
        yes: "Mülakata Çağır",
        maybe: "İncelemeye Al",
        no: "Elendi"
      },
      favoritesOnly: "Yalnızca favoriler",
      toggleFavorite: "Favorilere ekle",
      downloadZip: "ZIP Olarak İndir",
      downloadZipTooltip: "Tüm aday belgelerini tek bir ZIP olarak indirin",
      shareBtn: "CV'yi Paylaş",
      shareBtnTooltip: "Güvenli yalnızca-okunabilir bağlantı oluştur"
    },
    modal: {
      title: "Mevcut CV'yi İçe Aktar",
      sub: "Dosyanızı buraya bırakın, yapay zeka form alanlarını otomatik doldursun.",
      drop: "CV dosyanızı buraya sürükleyin",
      dropSub: "PDF, DOCX ve TXT desteklenir",
      progress: "Yapay zeka verileri ayrıştırıyor...",
      extracted: "Bilgiler başarıyla çıkarıldı!",
      options: "Yapmak istediğiniz işlemi seçin:",
      fill: "Temel bilgileri aktar",
      fillDesc: "Form alanlarını doldurun.",
      summary: "Ön profili güçlendir",
      summaryDesc: "Etkileyici bir özet metin oluşturun.",
      bullets: "Başarıları vurgula",
      bulletsDesc: "Ölçülebilir metriklerle zenginleştirin.",
      full: "Kapsamlı Yapay Zeka Güncellemesi (Önerilen)",
      fullDesc: "Tek tıkla tüm CV'yi içe aktarın ve optimize edin."
    }
  }
};

/**
 * Safely retrieves translation dictionary with fallback to English then French.
 */
export function getTranslation(lang: SupportedLanguage): TranslationSchema {
  return TRANSLATIONS[lang] || TRANSLATIONS.en || TRANSLATIONS.fr;
}
