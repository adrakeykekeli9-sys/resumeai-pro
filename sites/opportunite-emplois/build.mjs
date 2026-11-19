// Générateur du site Opportunité d'Emplois : lit data/offres.json et articles/*.html, écrit le site dans dist/.
// Aucune dépendance : `node build.mjs`.
import fs from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE_URL || "https://opportunite-emplois.onrender.com").replace(/\/$/, "");
const ADSENSE = (process.env.ADSENSE_CLIENT || "").trim(); // ex : ca-pub-1234567890123456
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "";
const CONTACT_WHATSAPP = process.env.CONTACT_WHATSAPP || "";
const RESUMEAI_URL = process.env.RESUMEAI_URL || "https://resumeai-pro-bqsb.onrender.com";
const NAME = "Opportunité d'Emplois";
const OUT = "dist";

const data = JSON.parse(fs.readFileSync("data/offres.json", "utf8"));
const PROG = fs.existsSync("data/programmes.json") ? JSON.parse(fs.readFileSync("data/programmes.json", "utf8")).destinations : [];
let LANG = "fr";
const t = (fr, en) => (LANG === "en" ? en : fr);
const EN = fs.existsSync("data/offres_en.json") ? JSON.parse(fs.readFileSync("data/offres_en.json", "utf8")) : {};
const COUNTRY_EN = { "RD Congo": "DR Congo", "Sénégal": "Senegal", "Tchad": "Chad", "Cameroun": "Cameroon", "Bénin": "Benin", "Mauritanie": "Mauritania", "République centrafricaine": "Central African Republic", "Guinée": "Guinea", "Allemagne": "Germany", "Belgique": "Belgium", "Royaume-Uni": "United Kingdom", "Afrique du Sud": "South Africa", "Éthiopie": "Ethiopia", "Maroc": "Morocco", "Tunisie": "Tunisia", "Haïti": "Haiti", "Liban": "Lebanon", "Afrique de l'Ouest": "West Africa", "International": "International" };
const cname = (c) => (LANG === "en" ? COUNTRY_EN[c] || c : c);
// Champ d'une offre dans la langue courante (data/offres_en.json pour l'anglais, sinon le français).
const F = (o, k) => {
  if (LANG === "en") {
    const e = EN[o.id] || {};
    if (e[k]) return e[k];
    if (k === "pays") { const c = countryOf(o); return o.pays.replace(c, cname(c)); }
  }
  return o[k];
};
const hasEN = (o) => !!(EN[o.id] && EN[o.id].titre);
const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const TYPES_FR = { bourse: "Bourse d'études", emploi: "Emploi", stage: "Stage", formation: "Formation" };
const TYPES_PL_FR = { bourse: "Bourses d'études", emploi: "Emplois", stage: "Stages", formation: "Formations" };
const TYPES_EN = { bourse: "Scholarship", emploi: "Job", stage: "Internship", formation: "Training" };
const TYPES_PL_EN = { bourse: "Scholarships", emploi: "Jobs", stage: "Internships", formation: "Training" };
const TYPES = new Proxy({}, { get: (_, k) => (LANG === "en" ? TYPES_EN : TYPES_FR)[k] });
const TYPES_PL = new Proxy({}, { get: (_, k) => (LANG === "en" ? TYPES_PL_EN : TYPES_PL_FR)[k] });
const ALL_TYPES = ["bourse", "emploi", "stage", "formation"];
const isOng = (o) => o.secteur === "ong";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const d = (iso) => (iso ? new Date(iso + "T00:00:00Z") : null);
const fmt = (iso) => { const x = d(iso); if (!x) return t("non précisée", "not specified"); return LANG === "en" ? `${MONTHS[x.getUTCMonth()]} ${x.getUTCDate()}, ${x.getUTCFullYear()}` : `${x.getUTCDate()} ${MOIS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };
const daysLeft = (o) => { const x = d(o.dateLimite); return x ? Math.round((x - today) / 864e5) : null; };
const isOpen = (o) => { const n = daysLeft(o); return n === null || n >= 0; };
const MOIS_MAJ = () => { const x = d(data.maj); return `${(LANG === "en" ? MONTHS : MOIS)[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };
const countryOf = (o) => String(o.pays || "").split(" (")[0].split(",")[0].split(" /")[0].trim();
const NATIONAL_ONLY = /(poste national|\bNO-\d|\(NO|nationa(l|ux)\b|ressortissant|recrutement local|locaux|\blocal\b|local uniquement|nationalité|contrat (local|national)|réservé|\bG-\d|chauffeur|conducteur|mobilisateur|journalier|habitants)/i;
// Postes d'appui généralement recrutés sur place : exclus de la page International sauf "international": true.
const LOCAL_ROLE = /\b(assistant|stagiaire|agent|superviseur|associate|comptable junior|gestionnaire de bureau)/i;
// "international": true/false dans offres.json force le classement ; sinon on déduit du texte.
const isInternational = (o) => countryOf(o) !== "Togo" && (typeof o.international === "boolean" ? o.international : o.type === "bourse" || (!NATIONAL_ONLY.test([o.titre, o.niveau, o.financement, o.description].join(" ")) && !LOCAL_ROLE.test(o.titre)));
const slug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function badge(o) {
  const n = daysLeft(o);
  if (n === null) return `<span class="left open">${t("Ouvert", "Open")}</span>`;
  if (n < 0) return `<span class="left past">${t("Clôturée", "Closed")}</span>`;
  if (n === 0) return `<span class="left soon">${t("Dernier jour", "Last day")}</span>`;
  if (n <= 7) return `<span class="left soon">${t("J-", "D-")}${n}</span>`;
  return `<span class="left">${t("J-", "D-")}${n}</span>`;
}

const CSS = `
:root{--bg:#F3F6F4;--surface:#fff;--fg:#13211D;--muted:#56655F;--line:#DCE4E0;--brand:#0A6B4F;--brand-ink:#fff;--gold:#A86F00;--gold-soft:#FFF3D6;--bourse:#1D5FA8;--bourse-soft:#E5EFFB;--emploi:#0A6B4F;--emploi-soft:#E2F3EC;--stage:#8A3FA0;--stage-soft:#F3E8F7;--urgent:#B42318;--urgent-soft:#FDE8E6;--hero:#0B2A24;--hero-fg:#EAF5F0;--display:"Bricolage Grotesque",system-ui,sans-serif;--body:"Source Sans 3",system-ui,sans-serif;--mono:ui-monospace,Menlo,monospace}
@media (prefers-color-scheme:dark){:root{--bg:#0E1714;--surface:#15211D;--fg:#E6EFEB;--muted:#9DB0A8;--line:#26352F;--brand:#3FC495;--brand-ink:#06231A;--gold:#F2B734;--gold-soft:#3A2E10;--bourse:#7DB3F0;--bourse-soft:#16283D;--emploi:#5FD3A6;--emploi-soft:#123327;--stage:#D59BE6;--stage-soft:#2E1C35;--urgent:#FF8A7A;--urgent-soft:#3A1714;--hero:#08201B;color-scheme:dark}}
[hidden]{display:none!important}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--body);font-size:16px;line-height:1.6}
a{color:var(--brand)}img{max-width:100%}
.wrap{max-width:1160px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right))}
header.site{background:var(--hero);color:var(--hero-fg)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-block:14px}
.logo{display:flex;align-items:center;gap:10px;font-family:var(--display);font-weight:800;font-size:1.2rem;color:var(--hero-fg);text-decoration:none}
nav.top{display:flex;gap:16px;flex-wrap:wrap;font-weight:600;font-size:.95rem}nav.top a{color:var(--hero-fg);text-decoration:none;opacity:.9}nav.top a:hover{opacity:1;text-decoration:underline}
.hero{background:var(--hero);color:var(--hero-fg)}.hero .wrap{padding-block:18px 34px;display:grid;gap:14px}
h1{font-family:var(--display);font-weight:800;font-size:clamp(1.8rem,5vw,2.9rem);line-height:1.08;margin:0;letter-spacing:-.02em;text-wrap:balance}h1 em{font-style:normal;color:#F2B734}
.lede{margin:0;max-width:62ch;opacity:.9;font-size:1.05rem}
.stats{display:flex;gap:22px;flex-wrap:wrap;font-size:.85rem}.stats b{display:block;font-family:var(--display);font-size:1.35rem;color:#fff}
.tools{position:sticky;top:0;z-index:5;background:var(--surface);border-bottom:1px solid var(--line)}.tools .wrap{display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding-block:10px}
.tab{border:1px solid var(--line);background:transparent;color:var(--fg);font:600 .92rem var(--body);padding:7px 14px;border-radius:999px;cursor:pointer}.tab[aria-pressed=true]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
input[type=search]{flex:1 1 220px;min-width:0;font:inherit;padding:8px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--fg)}
.layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:28px;padding-block:26px 50px}@media(max-width:880px){.layout{grid-template-columns:minmax(0,1fr)}}
.list{display:grid;gap:12px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px 18px;display:grid;gap:8px}
.chips{display:flex;gap:8px;flex-wrap:wrap}.chip{font:700 .72rem var(--body);text-transform:uppercase;letter-spacing:.06em;padding:3px 9px;border-radius:999px}
.chip.bourse{background:var(--bourse-soft);color:var(--bourse)}.chip.emploi{background:var(--emploi-soft);color:var(--emploi)}.chip.stage{background:var(--stage-soft);color:var(--stage)}.chip.formation{background:var(--gold-soft);color:var(--gold)}.chip.ong{background:var(--urgent-soft);color:var(--urgent)}.chip.new{background:var(--gold-soft);color:var(--gold)}.chip.full{border:1px solid var(--line);color:var(--muted)}
.card h2,.card h3{font-family:var(--display);font-weight:700;font-size:1.13rem;line-height:1.25;margin:0}.card h2 a,.card h3 a{color:var(--fg);text-decoration:none}.card h2 a:hover,.card h3 a:hover{text-decoration:underline}
.meta{display:flex;flex-wrap:wrap;gap:2px 16px;font-size:.9rem;color:var(--muted)}.meta b{color:var(--fg);font-weight:600}
.foot{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;border-top:1px dashed var(--line);padding-top:10px;font-size:.9rem}
.left{white-space:nowrap;font:700 .8rem var(--mono);padding:3px 8px;border-radius:6px;background:var(--emploi-soft);color:var(--emploi);margin-left:6px}.left.soon{background:var(--urgent-soft);color:var(--urgent)}.left.past{background:var(--line);color:var(--muted)}.left.open{background:var(--gold-soft);color:var(--gold)}
.btn{display:inline-flex;align-items:center;gap:6px;font:700 .92rem var(--body);padding:9px 16px;border-radius:10px;text-decoration:none;border:1px solid transparent;cursor:pointer}.btn.primary{background:var(--brand);color:var(--brand-ink)}.btn.ghost{border-color:var(--line);color:var(--fg);background:transparent}
aside{display:grid;gap:16px;align-content:start}.panel{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px 18px}.panel h2{font-family:var(--display);font-size:1rem;margin:0 0 10px}
.panel ul,.panel ol{margin:0;padding-left:18px;display:grid;gap:6px;font-size:.93rem}.warn{background:var(--urgent-soft);border-color:transparent}.warn h2{color:var(--urgent)}
.cta{background:var(--hero);color:var(--hero-fg);border:0}.cta h2{color:#fff}.cta a.btn{background:#F2B734;color:#1b1200}
article.page{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:22px clamp(16px,4vw,34px);max-width:780px}
article.page h1{color:var(--fg);font-size:clamp(1.6rem,4vw,2.3rem)}article.page h2{font-family:var(--display);font-size:1.25rem;margin:1.6em 0 .4em}article.page p,article.page li{max-width:68ch}
dl.facts{display:grid;grid-template-columns:max-content 1fr;gap:6px 18px;margin:18px 0;padding:14px 16px;background:var(--bg);border-radius:10px}dl.facts dt{color:var(--muted)}dl.facts dd{margin:0;font-weight:600}@media(max-width:520px){dl.facts{grid-template-columns:1fr}dl.facts dd{margin-bottom:6px}}
.crumbs{font-size:.88rem;color:var(--muted);margin-bottom:10px}.crumbs a{color:var(--muted)}
.notice{background:var(--gold-soft);border-radius:10px;padding:10px 14px;font-size:.93rem}
.share{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}
.empty{padding:24px;text-align:center;color:var(--muted);background:var(--surface);border:1px dashed var(--line);border-radius:14px}
.ad{margin:8px 0;min-height:0}
footer.site{border-top:1px solid var(--line);background:var(--surface);color:var(--muted);font-size:.9rem}footer.site .wrap{padding-block:24px;display:grid;gap:10px}footer.site nav{display:flex;gap:16px;flex-wrap:wrap}footer.site a{color:var(--muted)}
pre.wa{white-space:pre-wrap;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:14px;font:15px/1.5 var(--body);max-height:60vh;overflow:auto}
:focus-visible{outline:3px solid #F2B734;outline-offset:2px}
.lang{display:inline-flex;border:1px solid rgba(255,255,255,.5);border-radius:999px;overflow:hidden;font-weight:700;font-size:.85rem}.lang a,.lang span{padding:3px 10px;color:var(--hero-fg);text-decoration:none}.lang span{background:#F2B734;color:#1b1200}
.pays{background:var(--surface);border-bottom:1px solid var(--line)}.pays .wrap{padding-block:14px}
.pays h2{font:800 1rem var(--display);margin:0 0 10px;color:var(--fg)}
.pays ul{list-style:none;margin:0;padding:0;display:flex;gap:8px;flex-wrap:wrap}
.pays a{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;font:700 .95rem var(--body);text-decoration:none;color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.15);transition:transform .1s}
.pays a:hover{transform:translateY(-1px);text-decoration:underline}
.pays a b{background:rgba(255,255,255,.25);border-radius:999px;padding:0 8px;font-size:.82rem}
.pays a[aria-current=page]{outline:3px solid var(--fg);outline-offset:2px}
.pays .c0{background:#C2410C}.pays .c1{background:#0F766E}.pays .c2{background:#1D4ED8}.pays .c3{background:#7E22CE}.pays .c4{background:#B91C1C}.pays .c5{background:#15803D}.pays .c6{background:#A16207}.pays .c7{background:#0369A1}.pays .c8{background:#BE185D}.pays .c9{background:#4D7C0F}
.pays .intl{background:#F2B734;color:#1b1200}
.pays h2.second{margin-top:14px}.pays .abroad{background:#fff;color:#13211D;border:2px solid #13211D}
nav.top a.cv-link{background:#F2B734;color:#1b1200;padding:2px 10px;border-radius:999px;opacity:1}
.prog{background:var(--surface);border:1px solid var(--line);border-left:5px solid #F2B734;border-radius:14px;padding:16px 18px;margin:14px 0}.prog h3{font-family:var(--display);margin:0 0 4px;font-size:1.15rem}.prog p.pub{margin:0 0 8px;color:var(--muted)}
.dest-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin:16px 0}.dest-grid a{display:block;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px;text-decoration:none;color:var(--fg)}.dest-grid a:hover{border-color:var(--brand)}.dest-grid .flag{font-size:2rem;display:block}.dest-grid b{font-family:var(--display);font-size:1.1rem}
.cv-hero{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:18px 0}.cv-box{border-radius:14px;padding:18px 20px}.cv-box.cand{background:var(--emploi-soft)}.cv-box.rh{background:var(--bourse-soft)}.cv-box h2{margin-top:0}
.cvband{background:linear-gradient(90deg,#F2B734,#FFD873);color:#1b1200}.cvband .wrap{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding-block:12px;font-weight:700}.cvband a{background:#0B2A24;color:#fff;padding:8px 14px;border-radius:10px;text-decoration:none}.pays .intl b{background:rgba(0,0,0,.12)}
`;

const LOGO = `<svg width="30" height="30" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="9" fill="#F2B734"/><path d="M9 22V14h16v8a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2Z" fill="#0B2A24"/><path d="M13 14v-2.5A1.5 1.5 0 0 1 14.5 10h5a1.5 1.5 0 0 1 1.5 1.5V14" stroke="#0B2A24" stroke-width="2" fill="none"/></svg>`;

const enPath = (p) => (p === "/" ? "/en/" : "/en" + p);
function layout({ title, description, pathname, body, jsonld, noindex = false, ogType = "website", enAvailable = true }) {
  const url = SITE + (LANG === "en" ? enPath(pathname) : pathname);
  const alt = enAvailable && !noindex ? `<link rel="alternate" hreflang="fr" href="${SITE + pathname}"><link rel="alternate" hreflang="en" href="${SITE + enPath(pathname)}"><link rel="alternate" hreflang="x-default" href="${SITE + pathname}">` : "";
  const sw = LANG === "en" ? `<span class="lang"><a href="${pathname}" hreflang="fr">FR</a><span>EN</span></span>` : `<span class="lang"><span>FR</span>${enAvailable ? `<a href="${enPath(pathname)}" hreflang="en">EN</a>` : ""}</span>`;
  const fullTitle = pathname === "/" ? title : `${title} | ${NAME}`;
  const html = `<!doctype html>
<html lang="${LANG}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">${alt}
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:type" content="${ogType}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="${NAME}"><meta property="og:locale" content="${t("fr_FR", "en_US")}"><meta property="og:image" content="${SITE}/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${NAME} : ${t("emplois, stages et bourses d'études en Afrique francophone", "jobs, internships and scholarships in Africa and abroad")}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${SITE}/og.png">
<meta name="theme-color" content="#0B2A24">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Source+Sans+3:wght@400;600;700&display=swap">
<link rel="stylesheet" href="/style.css">
${ADSENSE ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(ADSENSE)}" crossorigin="anonymous"></script>` : ""}
${(Array.isArray(jsonld) ? jsonld : jsonld ? [jsonld] : []).map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>
<body>
<header class="site"><div class="wrap"><a class="logo" href="/">${LOGO} ${NAME}</a>
<nav class="top" aria-label="${t("Menu principal", "Main menu")}"><a href="/bourses/">${t("Bourses", "Scholarships")}</a><a href="/emplois/">${t("Emplois", "Jobs")}</a><a href="/stages/">${t("Stages", "Internships")}</a><a href="/formations/">${t("Formations", "Training")}</a><a href="/ong/">${t("ONG", "NGOs")}</a><a href="/international/">International</a><a href="/etranger/">${t("Travailler à l'étranger", "Work abroad")}</a><a href="/outil-cv/" class="cv-link">${t("Outil CV", "CV tool")}</a><a href="/guides/">${t("Conseils", "Advice")}</a>${LANG === "fr" ? '<a href="/whatsapp/" class="wa-link">Message du jour</a>' : ""}${sw}</nav></div></header>
${body}
<footer class="site"><div class="wrap">
<nav aria-label="${t("Pages du site", "Site pages")}"><a href="/a-propos/">${t("À propos", "About")}</a><a href="/contact/">Contact</a><a href="/confidentialite/">${t("Confidentialité et cookies", "Privacy and cookies")}</a><a href="/mentions-legales/">${t("Mentions légales", "Legal notice")}</a><a href="/guides/">${t("Conseils", "Advice")}</a></nav>
${COUNTRY_PAGES.length ? `<nav aria-label="${t("Offres par pays", "Jobs by country")}">${t("Offres par pays", "Jobs by country")} : ${COUNTRY_PAGES.map((c) => `<a href="/pays/${c.slug}/">${esc(cname(c.name))}</a>`).join("")}</nav>` : ""}
<div><b>${NAME}</b> ${t("recense chaque jour des offres d'emploi, de stage et des bourses d'études ouvertes aux jeunes et aux professionnels d'Afrique francophone. Service gratuit : postuler ne doit jamais coûter d'argent.", "(\"Job Opportunities\") lists, every day, jobs, internships and scholarships open to young people and professionals in Africa and abroad. Free service: applying should never cost money.")}</div>
<div>${t("Les informations sont relayées à titre indicatif. Vérifiez toujours les dates et les conditions sur le site officiel avant de postuler. Dernière mise à jour : ", "Information is provided for guidance only. Always check dates and conditions on the official website before applying. Last updated: ")}${fmt(data.maj)}.</div>
</div></footer>
</body>
</html>`;
  return LANG === "en" ? localizeLinks(html) : html;
}
// Version anglaise : les liens internes pointent vers /en/… (sauf fichiers techniques et pages sans version anglaise).
const NO_EN = /^\/(en\/|style\.css|favicon\.svg|og\.png|whatsapp\/|guides\/[a-z])/;
function localizeLinks(html) {
  return html.replace(/href="(\/[^"]*)"(?! hreflang)/g, (m, p) => (NO_EN.test(p) ? m : `href="${enPath(p)}"`));
}

function offerCard(o, h = "h2") {
  const isNew = o.publie && Math.round((today - d(o.publie)) / 864e5) <= 2;
  return `<article class="card" data-type="${o.type}" data-text="${esc([F(o, "titre"), o.organisme, F(o, "pays"), F(o, "niveau")].join(" ").toLowerCase())}">
<div class="chips"><span class="chip ${o.type}">${TYPES[o.type]}</span>${isOng(o) ? `<span class="chip ong">${t("ONG", "NGO")}</span>` : ""}${isNew ? `<span class="chip new">${t("Nouveau", "New")}</span>` : ""}${F(o, "financement") ? `<span class="chip full">${esc(F(o, "financement"))}</span>` : ""}</div>
<${h}><a href="/offres/${o.id}/">${esc(F(o, "titre"))}</a></${h}>
<div class="meta"><span>${t("Organisme", "Organization")} : <b>${esc(o.organisme)}</b></span><span>${t("Pays", "Country")} : <b>${esc(F(o, "pays"))}</b></span><span>${t("Niveau", "Profile")} : <b>${esc(F(o, "niveau"))}</b></span></div>
<div class="foot"><span>${t("Date limite", "Deadline")} : <b>${fmt(o.dateLimite)}</b>${badge(o)}</span><a class="btn ghost" href="/offres/${o.id}/">${t("Voir les détails", "View details")}</a></div>
</article>`;
}

const sideBar = (open) => {
  const soon = open.filter((o) => { const n = daysLeft(o); return n !== null && n <= 14; }).slice(0, 8);
  return `<aside>
<div class="panel cta"><h2>${t("Votre CV est-il prêt ?", "Is your CV ready?")}</h2><p style="margin:0 0 12px">${t("Créez un CV et une lettre de motivation adaptés à chaque offre avec ResumeAI Pro. Recruteurs : classez vos candidatures automatiquement. 3 essais gratuits par jour.", "Create a CV and cover letter tailored to each offer with ResumeAI Pro. Recruiters: rank your applications automatically. 3 free tries per day.")}</p><a class="btn" href="/outil-cv/">${t("Découvrir l'outil CV", "Discover the CV tool")}</a></div>
<div class="panel"><h2>${t("Clôturent bientôt", "Closing soon")}</h2>${soon.length ? `<ul>${soon.map((o) => `<li><a href="/offres/${o.id}/">${esc(F(o, "titre"))}</a>${badge(o)}</li>`).join("")}</ul>` : `<p>${t("Aucune clôture dans les 14 prochains jours.", "Nothing closes in the next 14 days.")}</p>`}</div>
<div class="panel warn"><h2>${t("Attention aux arnaques", "Beware of scams")}</h2><ul><li>${t("Une vraie offre ne demande jamais de frais par Mobile Money.", "A real offer never asks for fees via Mobile Money.")}</li><li>${t("Postulez uniquement sur le site officiel.", "Apply only on the official website.")}</li><li>${t("Aucun visa n'est « garanti ».", "No visa is ever \"guaranteed\".")}</li></ul><p style="margin:10px 0 0"><a href="/guides/eviter-arnaques-bourses-emplois/">${t("Les 7 signes d'une fausse offre", "7 signs of a fake offer (in French)")}</a></p></div>
${COUNTRY_PAGES.length ? `<div class="panel"><h2>${t("Offres par pays", "Jobs by country")}</h2><ul>${COUNTRY_PAGES.map((c) => `<li><a href="/pays/${c.slug}/">${esc(cname(c.name))}</a> (${c.count})</li>`).join("")}</ul></div>` : ""}
${LANG === "fr" ? `<div class="panel"><h2>Partagez les offres du jour</h2><p style="margin:0 0 12px">Le message du jour est prêt : copiez-le ou envoyez-le directement dans vos groupes WhatsApp.</p><a class="btn primary" href="/whatsapp/">Message WhatsApp du jour</a></div>` : ""}
</aside>`;
};

const filterScript = `<script>
(function(){var cards=[].slice.call(document.querySelectorAll('.list .card'));var tabs=[].slice.call(document.querySelectorAll('.tab'));var q=document.getElementById('q');var empty=document.getElementById('empty');var t='tout';
function apply(){var s=(q&&q.value||'').toLowerCase().trim();var n=0;cards.forEach(function(c){var ok=(t==='tout'||c.dataset.type===t)&&(!s||c.dataset.text.indexOf(s)>-1);c.hidden=!ok;if(ok)n++;});if(empty)empty.hidden=n>0;}
tabs.forEach(function(b){b.addEventListener('click',function(){t=b.dataset.t;tabs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});apply();});});if(q)q.addEventListener('input',apply);})();
</script>`;

function listPage({ pathname, title, h1, lede, items, all, showTabs, extraLd = [] }) {
  const counts = { tout: items.length, bourse: 0, emploi: 0, stage: 0, formation: 0 };
  items.forEach((o) => counts[o.type]++);
  const body = `<section class="hero"><div class="wrap">
<h1>${h1}</h1><p class="lede">${lede}</p>
<div class="stats"><div><b>${all.filter(isOpen).length}</b>${t("offres ouvertes", "open offers")}</div><div><b>${all.filter((o) => isOpen(o) && o.type === "bourse").length}</b>${t("bourses", "scholarships")}</div><div><b>${all.filter((o) => isOpen(o) && o.type !== "bourse").length}</b>${t("emplois et stages", "jobs and internships")}</div><div><b>${fmt(data.maj)}</b>${t("dernière mise à jour", "last update")}</div></div>
</div></section>
${countryBar(pathname)}
<div class="cvband"><div class="wrap"><span>${t("📄 Candidats : un CV adapté à chaque offre. 👔 Recruteurs : triez vos candidatures avec l'IA.", "📄 Candidates: a CV tailored to each offer. 👔 Recruiters: sort applications with AI.")}</span><a href="/outil-cv/">${t("Découvrir l'outil CV", "Discover the CV tool")}</a></div></div>
<div class="tools"><div class="wrap">
${showTabs ? `<div role="group" aria-label="${t("Type d'offre", "Offer type")}" style="display:flex;gap:6px;flex-wrap:wrap">${["tout", ...ALL_TYPES].filter((k) => k === "tout" || counts[k] > 0).map((k) => `<button class="tab" type="button" data-t="${k}" aria-pressed="${k === "tout"}">${k === "tout" ? t("Tout", "All") : TYPES_PL[k]} (${counts[k]})</button>`).join("")}</div>` : ""}
<input type="search" id="q" placeholder="${t("Rechercher : pays, organisme, niveau…", "Search: country, organization, profile…")}" aria-label="${t("Rechercher une offre", "Search offers")}">
</div></div>
<main class="wrap layout"><section aria-label="${t("Offres", "Offers")}"><div class="list">
${items.map((o) => offerCard(o)).join("\n")}
</div><p class="empty" id="empty" ${items.length ? "hidden" : ""}>${t("Aucune offre ne correspond. Essayez un autre mot-clé.", "No matching offer. Try another keyword.")}</p></section>
${sideBar(all.filter(isOpen))}</main>${filterScript}`;
  return layout({
    title, description: lede.replace(/<[^>]+>/g, ""), pathname, body,
    jsonld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, url: SITE + (LANG === "en" ? enPath(pathname) : pathname), inLanguage: LANG, dateModified: data.maj,
      mainEntity: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items.slice(0, 50).map((o, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${LANG === "en" ? "/en" : ""}/offres/${o.id}/`, name: F(o, "titre") })) } }, ...extraLd],
  });
}

function countryBar(current) {
  if (!COUNTRY_PAGES.length) return "";
  const nIntl = all.filter(isOpen).filter(isInternational).length;
  const link = (href, cls, label, n) => `<li><a class="${cls}" href="${href}"${href === current ? ' aria-current="page"' : ""}>${label} <b>${n}</b></a></li>`;
  return `<nav class="pays" aria-label="${t("Offres par pays", "Jobs by country")}"><div class="wrap"><h2>🌍 ${t("Choisissez votre pays", "Choose your country")}</h2><ul>
${link("/international/", "intl", "🌐 International", nIntl)}
${COUNTRY_PAGES.map((c, i) => link(`/pays/${c.slug}/`, `c${i % 10}`, esc(cname(c.name)), c.count)).join("\n")}
</ul>
${PROG.length ? `<h2 class="second">✈️ ${t("Travailler à l'étranger : programmes officiels de recrutement", "Work abroad: official recruitment programmes")}</h2><ul>${PROG.map((p) => `<li><a class="abroad" href="/etranger/${p.slug}/"${`/etranger/${p.slug}/` === current ? ' aria-current="page"' : ""}>${p.drapeau} ${esc(PT(p, "nom"))}</a></li>`).join("")}</ul>` : ""}
</div></nav>`;
}

// Champ d'une destination ou d'un programme dans la langue courante (sous-objet "en").
const PT = (x, k) => (LANG === "en" && x.en && x.en[k] != null ? x.en[k] : x[k]);
function breadcrumbLd(trail) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: trail.map(([name, u], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + (LANG === "en" ? enPath(u) : u) })) };
}


const ISO = { "RD Congo": "CD", "Sénégal": "SN", "Tchad": "TD", "Rwanda": "RW", "Niger": "NE", "Togo": "TG", "Mali": "ML", "Cameroun": "CM", "Burkina Faso": "BF", "Madagascar": "MG", "Bénin": "BJ", "Afrique du Sud": "ZA", "Éthiopie": "ET", "France": "FR", "Côte d'Ivoire": "CI", "Burundi": "BI", "Mauritanie": "MR", "République centrafricaine": "CF", "Guinée": "GN", "Gabon": "GA", "Congo": "CG", "Kenya": "KE", "Nigeria": "NG", "Ghana": "GH", "Maroc": "MA", "Tunisie": "TN", "Haïti": "HT", "Liban": "LB", "Canada": "CA", "Allemagne": "DE", "Luxembourg": "LU", "Belgique": "BE", "Royaume-Uni": "GB", "Portugal": "PT" };
function jobPosting(o) {
  if (!["emploi", "stage"].includes(o.type) || !o.dateLimite || !isOpen(o)) return null;
  const cc = ISO[countryOf(o)];
  if (!cc) return null;
  const city = (o.pays.match(/\(([^)]+)\)/) || [])[1];
  return {
    "@context": "https://schema.org", "@type": "JobPosting",
    title: F(o, "titre"), description: `<p>${esc(F(o, "description"))}</p><p>${t("Niveau", "Profile")} : ${esc(F(o, "niveau"))}. ${esc(F(o, "financement") || "")}</p>`,
    datePosted: o.publie, validThrough: `${o.dateLimite}T23:59:00`,
    employmentType: o.type === "stage" ? "INTERN" : /volontariat/i.test(o.financement || "") ? "VOLUNTEER" : /consultance/i.test(o.financement || "") ? "CONTRACTOR" : undefined,
    hiringOrganization: { "@type": "Organization", name: o.organisme },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: cc, ...(city && !/,|ou | et |à définir|localités/.test(city) ? { addressLocality: city } : {}) } },
    directApply: false, url: `${SITE}${LANG === "en" ? "/en" : ""}/offres/${o.id}/`,
  };
}

function offerPage(o, all) {
  const n = daysLeft(o);
  const related = all.filter((x) => x.id !== o.id && isOpen(x) && x.type === o.type).slice(0, 4);
  const typeLink = { bourse: "/bourses/", emploi: "/emplois/", stage: "/stages/", formation: "/formations/" }[o.type];
  const shareText = `${F(o, "titre")} – ${t("date limite", "deadline")} : ${fmt(o.dateLimite)}. ${t("Détails", "Details")} : ${SITE}${LANG === "en" ? "/en" : ""}/offres/${o.id}/`;
  const tips = LANG === "en" ? {
    bourse: ["Check that your nationality, age and degree match the criteria.", "Prepare transcripts, translated diplomas if needed, passport and recommendation letters.", "Take care of your motivation letter: it often makes the difference."],
    emploi: ["Read the full job description and tailor your CV to the required skills.", "Prepare concrete examples of your achievements for the interview.", "Apply before the deadline: some offers close earlier."],
    formation: ["Check whether the training is free, online or in person, and whether it gives a certificate.", "Note the prerequisites (level, language, computer, internet connection).", "Block time every week: online training requires regularity."],
    stage: ["Check the duration, pay and required level of study.", "Attach a short letter explaining what you want to learn.", "Ask a teacher or former supervisor for a recommendation letter."],
  }[o.type] : {
    bourse: ["Vérifiez que votre nationalité, votre âge et votre diplôme correspondent aux critères.", "Préparez relevés de notes, diplômes traduits si nécessaire, passeport et lettres de recommandation.", "Soignez la lettre de motivation : c'est souvent elle qui fait la différence."],
    emploi: ["Lisez la fiche de poste en entier et adaptez votre CV aux compétences demandées.", "Préparez des exemples concrets de vos réalisations pour l'entretien.", "Postulez avant la date limite : certaines offres ferment plus tôt."],
    formation: ["Vérifiez si la formation est gratuite, en ligne ou en présentiel, et si elle délivre un certificat.", "Notez les prérequis (niveau, langue, ordinateur, connexion internet).", "Bloquez du temps chaque semaine : une formation en ligne demande de la régularité."],
    stage: ["Vérifiez la durée, la rémunération et le niveau d'études demandé.", "Joignez une lettre courte qui explique ce que vous voulez apprendre.", "Demandez une lettre de recommandation à un enseignant ou un ancien encadrant."],
  }[o.type];
  const body = `<main class="wrap layout"><div>
<nav class="crumbs" aria-label="${t("Fil d'Ariane", "Breadcrumb")}"><a href="/">${t("Accueil", "Home")}</a> › <a href="${typeLink}">${TYPES_PL[o.type]}</a>${countryPage(o) ? ` › <a href="/pays/${countryPage(o).slug}/">${esc(cname(countryPage(o).name))}</a>` : ""} › ${esc(o.organisme)}</nav>
<article class="page">
<div class="chips"><span class="chip ${o.type}">${TYPES[o.type]}</span>${isOng(o) ? `<span class="chip ong">${t("ONG", "NGO")}</span>` : ""}${F(o, "financement") ? `<span class="chip full">${esc(F(o, "financement"))}</span>` : ""}</div>
<h1>${esc(F(o, "titre"))}</h1>
${LANG === "en" && !hasEN(o) ? `<p class="notice">The details of this offer are only available in French for now. The official posting is linked below.</p>` : ""}
${n !== null && n < 0 ? `<p class="notice">${t("Cette offre est clôturée depuis le", "This offer closed on")} ${fmt(o.dateLimite)}. ${t("Consultez les", "See the")} <a href="${typeLink}">${t("offres ouvertes", "open offers")}</a>.</p>` : ""}
<dl class="facts"><dt>${t("Organisme", "Organization")}</dt><dd>${esc(o.organisme)}</dd><dt>${t("Pays / lieu", "Country / location")}</dt><dd>${esc(F(o, "pays"))}</dd><dt>${t("Niveau", "Profile")}</dt><dd>${esc(F(o, "niveau"))}</dd><dt>${t("Financement", "Pay / funding")}</dt><dd>${esc(F(o, "financement") || t("Non précisé", "Not specified"))}</dd><dt>${t("Date limite", "Deadline")}</dt><dd>${fmt(o.dateLimite)} ${badge(o)}</dd><dt>${t("Publié le", "Published")}</dt><dd>${fmt(o.publie)}</dd></dl>
<h2>${t("Présentation", "Overview")}</h2><p>${esc(F(o, "description"))}</p>
<h2>${t("Comment postuler", "How to apply")}</h2><p>${t(`La candidature se fait directement auprès de l'organisme, sur la page officielle ci-dessous. ${NAME} ne collecte aucun dossier et ne demande aucun paiement.`, `You apply directly to the organization, on the official page below. ${NAME} does not collect applications and never asks for payment.`)}</p>
<p><a class="btn primary" href="${esc(o.lien)}" target="_blank" rel="noopener nofollow">${t("Voir l'offre officielle", "View the official posting")}</a></p>
<h2>${t("Nos conseils pour cette candidature", "Our tips for this application")}</h2><ul>${tips.map((x) => `<li>${x}</li>`).join("")}<li>${t("Besoin d'un CV ou d'une lettre adaptés ?", "Need a tailored CV or cover letter?")} <a href="${RESUMEAI_URL}" target="_blank" rel="noopener">ResumeAI Pro</a> ${t("vous aide à les préparer.", "helps you prepare them.")}</li></ul>
<p class="notice">${t("Les dates et conditions peuvent changer. Vérifiez-les sur le site officiel avant d'envoyer votre dossier.", "Dates and conditions may change. Check them on the official website before sending your application.")}</p>
<div class="share"><a class="btn ghost" href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank" rel="noopener">${t("Partager sur WhatsApp", "Share on WhatsApp")}</a><a class="btn ghost" href="https://t.me/share/url?url=${encodeURIComponent(`${SITE}${LANG === "en" ? "/en" : ""}/offres/${o.id}/`)}&text=${encodeURIComponent(F(o, "titre"))}" target="_blank" rel="noopener">${t("Partager sur Telegram", "Share on Telegram")}</a></div>
</article>
${related.length ? `<h2 style="font-family:var(--display);margin:28px 0 12px">${t(`Autres ${TYPES_PL[o.type].toLowerCase()} ouvertes`, `Other open ${TYPES_PL[o.type].toLowerCase()}`)}</h2><div class="list">${related.map((x) => offerCard(x, "h3")).join("")}</div>` : ""}
</div>${sideBar(all.filter(isOpen))}</main>`;
  return layout({
    title: `${F(o, "titre")} – ${o.organisme}`.slice(0, 95),
    description: `${TYPES[o.type]} – ${o.organisme}, ${F(o, "pays")}. ${t("Date limite", "Deadline")} : ${fmt(o.dateLimite)}. ${F(o, "description")}`.slice(0, 300),
    pathname: `/offres/${o.id}/`, body, ogType: "article",
    jsonld: [breadcrumbLd([[t("Accueil", "Home"), "/"], [TYPES_PL[o.type], typeLink], ...(countryPage(o) ? [[cname(countryPage(o).name), `/pays/${countryPage(o).slug}/`]] : []), [F(o, "titre"), `/offres/${o.id}/`]]), jobPosting(o) || { "@context": "https://schema.org", "@type": "Article", headline: F(o, "titre"), datePublished: o.publie, dateModified: data.maj, inLanguage: LANG, publisher: { "@type": "Organization", name: NAME, url: SITE }, mainEntityOfPage: `${SITE}${LANG === "en" ? "/en" : ""}/offres/${o.id}/` }],
  });
}

function readArticles() {
  return fs.readdirSync("articles").filter((f) => f.endsWith(".html")).map((f) => {
    const raw = fs.readFileSync(path.join("articles", f), "utf8");
    const meta = JSON.parse(raw.match(/^<!--(.*?)-->/s)[1]);
    return { slug: f.replace(/\.html$/, ""), ...meta, html: raw.replace(/^<!--.*?-->/s, "").trim() };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

function simplePage(pathname, title, description, inner, opts = {}) {
  return layout({ title, description, pathname, noindex: opts.noindex, enAvailable: opts.enAvailable !== false, body: `<main class="wrap" style="padding-block:28px 50px"><article class="page"><h1>${esc(title)}</h1>${inner}</article></main>` });
}

function whatsappText(open) {
  const fresh = open.filter((o) => o.publie === data.maj);
  const soon = open.filter((o) => { const n = daysLeft(o); return n !== null && n <= 3 && o.publie !== data.maj; }).sort((a, b) => daysLeft(a) - daysLeft(b)).slice(0, 8);
  const line = (o) => `▪️ *${o.titre}*\n   ${o.pays} · Date limite : ${fmt(o.dateLimite)}\n   👉 ${SITE}/offres/${o.id}/`;
  let t = `🎓💼 *OPPORTUNITÉ D'EMPLOIS – ${fmt(data.maj).toUpperCase()}*\n\n`;
  if (fresh.length) t += `🆕 *Nouvelles offres du jour*\n\n${fresh.map(line).join("\n\n")}\n\n`;
  if (soon.length) t += `⏰ *Dernière chance (clôture dans 3 jours ou moins)*\n\n${soon.map(line).join("\n\n")}\n\n`;
  t += `📋 Toutes les offres ouvertes (${open.length}) : ${SITE}\n\n⚠️ Postuler est toujours GRATUIT. Ne payez jamais de « frais de dossier ».\n📲 Partagez ce message à vos amis !`;
  return t;
}

// ─── Construction ───
fs.rmSync(OUT, { recursive: true, force: true });
const write = (p, content) => { const f = path.join(OUT, LANG === "en" && !/^(style\.css|favicon\.svg|sitemap\.xml|robots\.txt|ads\.txt)$/.test(p) ? "en/" + p : p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };

const all = [...data.offres].sort((a, b) => (a.dateLimite || "9999").localeCompare(b.dateLimite || "9999"));
const open = all.filter(isOpen);
const articles = readArticles();
const DE = { "Togo": "au Togo", "Bénin": "au Bénin", "Sénégal": "au Sénégal", "Niger": "au Niger", "Mali": "au Mali", "Tchad": "au Tchad", "Cameroun": "au Cameroun", "Burkina Faso": "au Burkina Faso", "Burundi": "au Burundi", "Rwanda": "au Rwanda", "Gabon": "au Gabon", "Congo": "au Congo", "Kenya": "au Kenya", "Nigeria": "au Nigeria", "Ghana": "au Ghana", "Maroc": "au Maroc", "Liban": "au Liban", "RD Congo": "en RD Congo", "Côte d'Ivoire": "en Côte d'Ivoire", "Guinée": "en Guinée", "Mauritanie": "en Mauritanie", "République centrafricaine": "en Centrafrique", "Madagascar": "à Madagascar", "Haïti": "en Haïti", "Tunisie": "en Tunisie", "Éthiopie": "en Éthiopie", "Afrique du Sud": "en Afrique du Sud" };
const countryCounts = {};
open.forEach((o) => { const c = countryOf(o); if (DE[c]) countryCounts[c] = (countryCounts[c] || 0) + 1; });
const COUNTRY_PAGES = Object.entries(countryCounts).filter(([, n]) => n >= 2).sort((a, b) => (b[0] === "Togo") - (a[0] === "Togo") || b[1] - a[1]).map(([name, count]) => ({ name, count, slug: slug(name), de: DE[name] }));
const countryPage = (o) => COUNTRY_PAGES.find((c) => c.name === countryOf(o));

// Fichiers communs (une seule fois).
write("style.css", CSS);
if (fs.existsSync("static")) for (const f of fs.readdirSync("static")) fs.copyFileSync(path.join("static", f), path.join(OUT, f));
write("favicon.svg", LOGO.replace('width="30" height="30" ', 'xmlns="http://www.w3.org/2000/svg" '));
const intl = open.filter(isInternational);
const deIn = (c) => (LANG === "en" ? `in ${cname(c.name)}` : c.de);

function buildLang() {
  write("index.html", listPage({ pathname: "/", title: t(`${NAME} – Emplois, stages et bourses d'études en Afrique (${MOIS_MAJ()})`, `Jobs, internships and scholarships in Africa and abroad (${MOIS_MAJ()}) – ${NAME}`), h1: t("Emplois, stages et <em>bourses d'études</em>, mis à jour chaque jour.", "Jobs, internships and <em>scholarships</em>, updated every day."), lede: t("Les offres ouvertes aux jeunes et aux professionnels d'Afrique francophone, avec un lien vers la source officielle. Service gratuit, sans inscription.", "Open offers for young people and professionals in Africa and abroad, each with a link to the official source. Free service, no sign-up."), items: open, all, showTabs: true, extraLd: [
    { "@context": "https://schema.org", "@type": "WebSite", name: NAME, url: SITE + t("/", "/en/"), inLanguage: LANG },
    { "@context": "https://schema.org", "@type": "Organization", name: NAME, url: SITE + "/", logo: SITE + "/og.png", ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}) }] }));
  write("international/index.html", listPage({ pathname: "/international/", title: t(`Emplois à l'international et bourses à l'étranger (${MOIS_MAJ()})`, `International jobs and scholarships abroad (${MOIS_MAJ()})`), h1: t(`Emplois, stages et bourses <em>à l'international</em>`, `International <em>jobs, internships and scholarships</em>`), lede: t(`${intl.length} offres ouvertes aux candidats de toutes nationalités, y compris du Togo et de toute l'Afrique francophone : postes internationaux des Nations Unies et des ONG, missions dans d'autres pays, bourses d'études à l'étranger. Les postes réservés aux nationaux d'un autre pays et les recrutements locaux sont exclus. Vérifiez toujours les conditions de nationalité sur la fiche officielle.`, `${intl.length} offers open to candidates of all nationalities, including from Togo and all of Africa: international UN and NGO positions, assignments in other countries and scholarships abroad. Positions reserved for nationals of another country and local hires are excluded. Always check nationality requirements on the official posting.`), items: intl, all, showTabs: true, extraLd: [breadcrumbLd([[t("Accueil", "Home"), "/"], ["International", "/international/"]])] }));

  // ─── Travailler à l'étranger ───
  const progCard = (g) => `<div class="prog"><h3>${esc(PT(g, "nom"))}</h3><p class="pub">${t("Pour qui", "Who it is for")} : ${esc(PT(g, "public"))}</p><ul>${PT(g, "points").map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p><a class="btn primary" href="${esc(g.lien)}" target="_blank" rel="noopener">${t("Site officiel", "Official website")}</a></p></div>`;
  const abroadWarn = `<p class="notice">${t("Ces programmes sont gratuits ou à frais officiels fixés par l'État. Méfiez-vous des agences qui « garantissent » un visa ou un emploi contre paiement. Les conditions changent souvent : vérifiez-les toujours sur le site officiel.", "These programmes are free or charge only official government fees. Beware of agencies that \"guarantee\" a visa or a job for money. Conditions change often: always check them on the official website.")}</p>`;
  if (PROG.length) {
    write("etranger/index.html", layout({ title: t(`Travailler à l'étranger : Canada, Québec, Allemagne, Luxembourg, France, Belgique, Royaume-Uni (${MOIS_MAJ()})`, `Work abroad from Africa: Canada, Quebec, Germany, Luxembourg, France, Belgium, UK (${MOIS_MAJ()})`), description: t("Programmes officiels de recrutement international et offres d'emploi ouvertes aux candidats d'Afrique : Canada, Québec, Allemagne, Luxembourg, France, Belgique, Royaume-Uni, Portugal, avec les liens vers les sites gouvernementaux.", "Official international recruitment programmes and job offers open to candidates from Africa: Canada, Quebec, Germany, Luxembourg, France, Belgium, UK, Portugal, with links to government websites."), pathname: "/etranger/",
      jsonld: [breadcrumbLd([[t("Accueil", "Home"), "/"], [t("Travailler à l'étranger", "Work abroad"), "/etranger/"]])],
      body: `<section class="hero"><div class="wrap"><h1>${t("Travailler <em>à l'étranger</em>", "Work <em>abroad</em>")}</h1><p class="lede">${t("Plusieurs pays recrutent officiellement des travailleurs qualifiés d'Afrique francophone. Voici leurs programmes, expliqués simplement, avec le lien vers le site du gouvernement.", "Several countries officially recruit skilled workers from Africa. Here are their programmes, explained simply, with links to the government websites.")}</p></div></section>${countryBar("/etranger/")}<main class="wrap layout"><div><article class="page"><h2>${t("Choisissez une destination", "Choose a destination")}</h2><div class="dest-grid">${PROG.map((p) => `<a href="/etranger/${p.slug}/"><span class="flag">${p.drapeau}</span><b>${esc(PT(p, "nom"))}</b><br><span style="color:var(--muted)">${p.programmes.length} ${t("programme", "programme")}${p.programmes.length > 1 ? "s" : ""}</span></a>`).join("")}</div>${abroadWarn}<h2>${t("Préparer son dossier", "Preparing your application")}</h2><ul>${t("<li>Un CV au format du pays visé (souvent 2 pages, sans photo au Canada).</li><li>Des diplômes traduits et, selon le pays, une reconnaissance officielle de vos qualifications.</li><li>Un test de langue reconnu (français ou anglais, parfois allemand).</li>", "<li>A CV in the format of the target country (often 2 pages, no photo in Canada).</li><li>Translated diplomas and, depending on the country, official recognition of your qualifications.</li><li>A recognised language test (French or English, sometimes German).</li>")}</ul><p>${t(`Préparez votre CV avec notre <a href="/outil-cv/">outil CV</a> et consultez les <a href="/international/">offres d'emploi à l'international</a>.`, `Prepare your CV with our <a href="/outil-cv/">CV tool</a> and browse <a href="/international/">international job offers</a>.`)}</p></article></div>${sideBar(open)}</main>` }));
    for (const p of PROG) {
      const de = PT(p, "de");
      const jobs = open.filter((o) => p.slug === "quebec" ? countryOf(o) === "Canada" && /\bQC\)/.test(o.pays) : (p.match || []).includes(countryOf(o)));
      write(`etranger/${p.slug}/index.html`, layout({ title: t(`Travailler ${de} depuis l'Afrique : offres et programmes officiels (${MOIS_MAJ()})`, `Work ${de} from Africa: jobs and official programmes (${MOIS_MAJ()})`), description: `${PT(p, "intro")} ${t("Conditions principales et lien vers le site officiel.", "Main conditions and link to the official website.")}`.slice(0, 300), pathname: `/etranger/${p.slug}/`, ogType: "article",
        jsonld: [breadcrumbLd([[t("Accueil", "Home"), "/"], [t("Travailler à l'étranger", "Work abroad"), "/etranger/"], [PT(p, "nom"), `/etranger/${p.slug}/`]])],
        body: `<section class="hero"><div class="wrap"><h1>${p.drapeau} ${t("Travailler", "Work")} <em>${esc(de)}</em></h1><p class="lede">${esc(PT(p, "intro"))}</p></div></section>${countryBar(`/etranger/${p.slug}/`)}<main class="wrap layout"><div><nav class="crumbs"><a href="/">${t("Accueil", "Home")}</a> › <a href="/etranger/">${t("Travailler à l'étranger", "Work abroad")}</a> › ${esc(PT(p, "nom"))}</nav>${jobs.length ? `<h2 style="font-family:var(--display);margin:18px 0 10px">💼 ${t(`Offres d'emploi ${de} ouvertes aux candidats de l'étranger`, `Jobs ${de} open to applicants from abroad`)} (${jobs.length})</h2><div class="list">${jobs.map((o) => offerCard(o, "h3")).join("")}</div>` : ""}
<h2 style="font-family:var(--display);margin:22px 0 10px">📋 ${t("Programmes officiels d'immigration", "Official immigration programmes")}</h2>${p.programmes.map(progCard).join("")}
${p.portails ? `<h2 style="font-family:var(--display);margin:22px 0 10px">🔎 ${t(`Où trouver d'autres offres officielles ${de}`, `Where to find more official job offers ${de}`)}</h2>${p.portails.map((x) => `<div class="prog" style="border-left-color:var(--brand)"><h3>${esc(PT(x, "nom"))}</h3><p class="pub">${esc(PT(x, "note"))}</p><p><a class="btn ghost" href="${esc(x.lien)}" target="_blank" rel="noopener">${t("Ouvrir le portail officiel", "Open the official portal")}</a></p></div>`).join("")}` : ""}${abroadWarn}<p>${t(`Voir aussi les <a href="/international/">offres d'emploi ouvertes à toutes les nationalités</a> et préparez un CV adapté avec notre <a href="/outil-cv/">outil CV</a>.`, `See also <a href="/international/">jobs open to all nationalities</a> and prepare a tailored CV with our <a href="/outil-cv/">CV tool</a>.`)}</p></div>${sideBar(open)}</main>` }));
    }
  }

  // ─── Outil CV ───
  write("outil-cv/index.html", layout({ title: t("Outil CV avec IA pour candidats et recruteurs (ResumeAI Pro)", "AI CV tool for candidates and recruiters (ResumeAI Pro)"), description: t("Créez un CV et une lettre de motivation adaptés à chaque offre, simulez un entretien, ou classez automatiquement les candidatures reçues : ResumeAI Pro, 3 essais gratuits par jour.", "Create a CV and cover letter tailored to each offer, practise interviews, or automatically rank the applications you receive: ResumeAI Pro, 3 free tries per day."), pathname: "/outil-cv/",
    jsonld: [{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "ResumeAI Pro", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: RESUMEAI_URL, inLanguage: LANG, offers: { "@type": "Offer", price: "0", priceCurrency: "XOF", description: t("3 actions IA gratuites par jour ; Pass payant pour un usage intensif.", "3 free AI actions per day; paid Pass for heavy use.") } }],
    body: `<section class="hero"><div class="wrap"><h1>${t("Un CV qui passe les filtres, <em>des recrutements plus rapides</em>", "A CV that gets through the filters, <em>faster hiring</em>")}</h1><p class="lede">${t("ResumeAI Pro utilise l'intelligence artificielle pour aider les candidats à postuler mieux, et les recruteurs à trier plus vite. 3 actions gratuites par jour, sans inscription.", "ResumeAI Pro uses artificial intelligence to help candidates apply better and recruiters sort faster. 3 free actions per day, no sign-up.")}</p><p><a class="btn" style="background:#F2B734;color:#1b1200" href="${RESUMEAI_URL}" target="_blank" rel="noopener">${t("Ouvrir ResumeAI Pro", "Open ResumeAI Pro")}</a></p></div></section>
<main class="wrap" style="padding-block:24px 50px"><div class="cv-hero">
<div class="cv-box cand"><h2>📄 ${t("Pour les demandeurs d'emploi", "For job seekers")}</h2><ul>${t(`<li><b>Importez votre CV</b> : l'outil le lit et le remet en forme proprement.</li>
<li><b>Analyse d'une offre</b> : collez le lien ou le texte d'une annonce, l'outil repère les compétences et mots-clés demandés.</li>
<li><b>Résumé et expériences améliorés</b> pour coller à l'offre et passer les logiciels de tri (ATS).</li>
<li><b>Lettre de motivation</b> rédigée pour l'offre visée.</li>
<li><b>Simulation d'entretien</b> avec les questions probables.</li>
<li><b>Traduction du CV</b> pour les candidatures à l'international.</li>`, `<li><b>Import your CV</b>: the tool reads it and formats it cleanly.</li>
<li><b>Job analysis</b>: paste a job link or text and the tool spots the required skills and keywords.</li>
<li><b>Improved summary and experience</b> to match the offer and pass applicant tracking systems (ATS).</li>
<li><b>Cover letter</b> written for the target job.</li>
<li><b>Interview practice</b> with likely questions.</li>
<li><b>CV translation</b> for international applications.</li>`)}</ul><p><a class="btn primary" href="${RESUMEAI_URL}" target="_blank" rel="noopener">${t("Créer mon CV", "Create my CV")}</a></p></div>
<div class="cv-box rh"><h2>👔 ${t("Pour les recruteurs et services RH", "For recruiters and HR teams")}</h2><ul>${t(`<li><b>Analyse de la fiche de poste</b> : compétences clés et critères extraits automatiquement.</li>
<li><b>Classement des candidatures</b> : chaque CV reçoit un score de correspondance avec le poste et une recommandation.</li>
<li><b>Gain de temps</b> sur la présélection quand vous recevez des dizaines de dossiers.</li>
<li>Gardez la décision finale : l'outil vous aide à trier, il ne remplace pas l'entretien.</li>`, `<li><b>Job description analysis</b>: key skills and criteria extracted automatically.</li>
<li><b>Candidate ranking</b>: each CV gets a match score against the role and a recommendation.</li>
<li><b>Time saved</b> on screening when you receive dozens of applications.</li>
<li>You keep the final decision: the tool helps you sort, it does not replace the interview.</li>`)}</ul><p><a class="btn primary" href="${RESUMEAI_URL}" target="_blank" rel="noopener">${t("Essayer pour mon recrutement", "Try it for my hiring")}</a></p></div>
</div>
<article class="page" style="max-width:none">${t(`<h2>Tarifs</h2><p>3 actions IA gratuites par jour. Pour un usage intensif (candidat très actif, cabinet de recrutement, ONG, entreprise), un Pass à petit prix est disponible directement dans l'application.</p><h2>Honnêteté et confidentialité</h2><p>L'outil n'invente pas d'expériences : il reformule ce que vous avez réellement fait. Les recruteurs restent responsables de leurs décisions et doivent traiter les candidats de façon équitable.</p>`, `<h2>Pricing</h2><p>3 free AI actions per day. For heavy use (very active candidate, recruitment agency, NGO, company), a low-cost Pass is available directly in the app.</p><h2>Honesty and privacy</h2><p>The tool does not invent experience: it rewords what you have actually done. Recruiters remain responsible for their decisions and must treat candidates fairly.</p>`)}</article></main>` }));

  for (const c of COUNTRY_PAGES) {
    const items = open.filter((o) => countryOf(o) === c.name);
    write(`pays/${c.slug}/index.html`, listPage({ pathname: `/pays/${c.slug}/`, title: t(`Offres d'emploi ${c.de} : emplois, stages et ONG (${MOIS_MAJ()})`, `Jobs ${deIn(c)}: NGO, UN jobs and internships (${MOIS_MAJ()})`), h1: t(`Offres d'emploi et stages <em>${esc(c.de)}</em>`, `Jobs and internships <em>${esc(deIn(c))}</em>`), lede: t(`${items.length} offres ouvertes ${c.de} : emplois dans les ONG et les agences des Nations Unies, stages et opportunités locales, avec le lien vers l'annonce officielle. Mis à jour chaque jour. Voir aussi les <a href="/international/" style="color:#F2B734">offres à l'international</a>.`, `${items.length} open offers ${deIn(c)}: jobs with NGOs and UN agencies, internships and local opportunities, with a link to the official posting. Updated daily. See also <a href="/international/" style="color:#F2B734">international offers</a>.`), items, all, showTabs: true, extraLd: [breadcrumbLd([[t("Accueil", "Home"), "/"], [t(`Offres ${c.de}`, `Jobs ${deIn(c)}`), `/pays/${c.slug}/`]])] }));
  }
  for (const [type, p] of [["bourse", "/bourses/"], ["emploi", "/emplois/"], ["stage", "/stages/"], ["formation", "/formations/"]]) {
    write(`${p.slice(1)}index.html`, listPage({ pathname: p,
      title: `${t({ bourse: "Bourses d'études ouvertes", emploi: "Offres d'emploi en Afrique", stage: "Offres de stage en Afrique", formation: "Formations gratuites et financées" }[type], { bourse: "Open scholarships for African students", emploi: "Jobs in Africa and international organizations", stage: "Internships in Africa and abroad", formation: "Free and funded training" }[type])} (${MOIS_MAJ()})`,
      h1: t({ bourse: "Bourses d'études ouvertes", emploi: "Offres d'emploi ouvertes", stage: "Offres de stage ouvertes", formation: "Formations ouvertes" }[type], { bourse: "Open scholarships", emploi: "Open jobs", stage: "Open internships", formation: "Open training" }[type]),
      lede: t({ bourse: "Bourses d'études de licence, master et doctorat accessibles aux étudiants africains, classées par date limite.", emploi: "Offres d'emploi en Afrique et dans les organisations internationales, classées par date limite.", stage: "Stages pour étudiants et jeunes diplômés, classés par date limite.", formation: "Formations gratuites ou financées, en ligne et en présentiel, pour développer vos compétences." }[type], { bourse: "Bachelor's, master's and PhD scholarships open to African students, sorted by deadline.", emploi: "Jobs in Africa and with international organizations, sorted by deadline.", stage: "Internships for students and recent graduates, sorted by deadline.", formation: "Free or funded training, online and in person, to build your skills." }[type]),
      items: open.filter((o) => o.type === type), all, showTabs: false }));
  }
  write("ong/index.html", listPage({ pathname: "/ong/", title: t(`Offres d'emploi et stages dans les ONG en Afrique (${MOIS_MAJ()})`, `NGO jobs and internships in Africa (${MOIS_MAJ()})`), h1: t("Emplois et stages dans les <em>ONG</em>", "Jobs and internships with <em>NGOs</em>"), lede: t("Offres des ONG et associations humanitaires et de développement qui travaillent en Afrique : santé, éducation, protection, agriculture, eau et assainissement.", "Offers from humanitarian and development NGOs working in Africa: health, education, protection, agriculture, water and sanitation."), items: open.filter(isOng), all, showTabs: true }));
  for (const o of all) write(`offres/${o.id}/index.html`, offerPage(o, all));

  write("guides/index.html", simplePage("/guides/", t("Conseils pour réussir vos candidatures", "Advice for successful applications"), t("Guides pratiques pour postuler aux bourses, stages et emplois et éviter les arnaques.", "Practical guides to apply for scholarships, internships and jobs and avoid scams."), `<p>${t(`Des guides pratiques, rédigés par l'équipe ${NAME}, pour préparer vos candidatures.`, `Practical guides written by the ${NAME} team to prepare your applications. These guides are currently in French.`)}</p><div class="list">${articles.map((a) => `<div class="card"><h2><a href="/guides/${a.slug}/">${esc(a.titre)}</a></h2><p style="margin:0">${esc(a.resume)}</p></div>`).join("")}</div>`));
  if (LANG === "fr") for (const a of articles) {
    write(`guides/${a.slug}/index.html`, layout({ title: a.titre, description: a.resume, pathname: `/guides/${a.slug}/`, ogType: "article", enAvailable: false,
      jsonld: { "@context": "https://schema.org", "@type": "Article", headline: a.titre, datePublished: a.date, inLanguage: "fr", publisher: { "@type": "Organization", name: NAME, url: SITE } },
      body: `<main class="wrap layout"><div><nav class="crumbs"><a href="/">Accueil</a> › <a href="/guides/">Conseils</a></nav><article class="page"><h1>${esc(a.titre)}</h1><p class="crumbs">Publié le ${fmt(a.date)}</p>${a.html}</article></div>${sideBar(open)}</main>` }));
  }

  const contactLines = [CONTACT_EMAIL && `<li>E-mail : <b>${esc(CONTACT_EMAIL)}</b></li>`, CONTACT_WHATSAPP && `<li>WhatsApp : <b>${esc(CONTACT_WHATSAPP)}</b></li>`].filter(Boolean).join("");
  write("a-propos/index.html", simplePage("/a-propos/", t("À propos", "About us"), t(`${NAME} aide gratuitement les jeunes et les professionnels à trouver des emplois, stages et bourses.`, `${NAME} helps young people and professionals find jobs, internships and scholarships for free.`), t(`<p>${NAME} est un service gratuit créé pour aider les jeunes et les professionnels d'Afrique francophone à trouver plus facilement des offres d'emploi, des stages et des bourses d'études.</p><h2>Ce que nous faisons</h2><p>Chaque matin, nous consultons les sites des organisations internationales, des universités, des fondations et des recruteurs, ainsi que des sites spécialisés. Nous sélectionnons les offres encore ouvertes, nous résumons l'essentiel en français et nous indiquons toujours le lien vers la source.</p><h2>Nos engagements</h2><ul><li>Aucune offre ne demande de payer pour postuler. Nous retirons toute annonce suspecte.</li><li>Chaque fiche indique sa source. Les dates sont vérifiées au moment de la publication, mais peuvent changer : consultez toujours le site officiel.</li><li>Les offres clôturées sont retirées régulièrement.</li></ul><h2>Financement</h2><p>Le site est gratuit pour les visiteurs. Il est financé par des publicités affichées par Google AdSense.</p>`, `<p>${NAME} ("Job Opportunities") is a free service created to help young people and professionals in Africa find jobs, internships and scholarships more easily.</p><h2>What we do</h2><p>Every morning we check the websites of international organizations, universities, foundations and recruiters, as well as specialised job sites. We select the offers that are still open, summarise the essentials and always link to the original source.</p><h2>Our commitments</h2><ul><li>No offer asks you to pay to apply. We remove any suspicious posting.</li><li>Every listing shows its source. Dates are checked when published but may change: always check the official website.</li><li>Closed offers are removed regularly.</li></ul><h2>Funding</h2><p>The site is free for visitors. It is funded by advertising served by Google AdSense.</p>`)));
  write("contact/index.html", simplePage("/contact/", "Contact", t(`Contacter l'équipe ${NAME}.`, `Contact the ${NAME} team.`), `<p>${t("Une question, une offre à signaler, une erreur dans une annonce ? Écrivez-nous :", "A question, an offer to share, an error in a listing? Write to us:")}</p>${contactLines ? `<ul>${contactLines}</ul>` : ""}<p>${t("Vous êtes un recruteur, une école ou une fondation ? Envoyez-nous votre offre avec le lien officiel : nous la publions gratuitement après vérification.", "Are you a recruiter, school or foundation? Send us your offer with the official link: we publish it for free after checking it.")}</p>`));
  write("confidentialite/index.html", simplePage("/confidentialite/", t("Politique de confidentialité et cookies", "Privacy and cookie policy"), t(`Comment ${NAME} traite vos données et utilise les cookies.`, `How ${NAME} handles your data and uses cookies.`), t(`<p>Dernière mise à jour : ${fmt(data.maj)}.</p><h2>Données que nous collectons</h2><p>${NAME} ne demande ni inscription ni dossier de candidature. Nous ne collectons pas vos nom, adresse ou CV. Si vous nous écrivez, nous utilisons votre message uniquement pour vous répondre.</p><h2>Publicité et cookies</h2><p>Ce site affiche des publicités fournies par Google AdSense. Google et ses partenaires utilisent des cookies pour diffuser des annonces en fonction de vos visites sur ce site et sur d'autres sites. Google utilise notamment le cookie DoubleClick pour proposer des annonces personnalisées.</p><p>Vous pouvez désactiver la publicité personnalisée dans les <a href="https://adssettings.google.com" target="_blank" rel="noopener">paramètres des annonces Google</a>, et en savoir plus sur <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">l'utilisation des données par Google</a>. Pour les visiteurs de l'Espace économique européen, du Royaume-Uni et de la Suisse, un bandeau de consentement vous permet d'accepter ou de refuser ces cookies.</p><h2>Liens externes</h2><p>Les offres renvoient vers des sites tiers (organismes, universités, sites d'annonces) qui ont leur propre politique de confidentialité.</p><h2>Vos droits</h2><p>Vous pouvez nous demander à tout moment l'accès ou la suppression des informations que vous nous avez transmises, via la page <a href="/contact/">Contact</a>.</p>`, `<p>Last updated: ${fmt(data.maj)}.</p><h2>Data we collect</h2><p>${NAME} requires no sign-up and no application file. We do not collect your name, address or CV. If you write to us, we use your message only to reply.</p><h2>Advertising and cookies</h2><p>This site shows ads provided by Google AdSense. Google and its partners use cookies to serve ads based on your visits to this and other websites. Google uses the DoubleClick cookie to serve personalised ads.</p><p>You can turn off personalised advertising in <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google ad settings</a> and learn more about <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">how Google uses data</a>. Visitors from the European Economic Area, the UK and Switzerland can accept or refuse these cookies through a consent banner.</p><h2>External links</h2><p>Offers link to third-party websites (organizations, universities, job boards) that have their own privacy policies.</p><h2>Your rights</h2><p>You can ask us at any time to access or delete the information you sent us, through the <a href="/contact/">Contact</a> page.</p>`)));
  write("mentions-legales/index.html", simplePage("/mentions-legales/", t("Mentions légales", "Legal notice"), t(`Mentions légales du site ${NAME}.`, `Legal notice of ${NAME}.`), `<p><b>${t("Éditeur", "Publisher")} :</b> KOSSI Kodjovi Soké (EDEM MEET), Togo.</p>${contactLines ? `<ul>${contactLines}</ul>` : ""}<p><b>${t("Hébergement", "Hosting")} :</b> Render Services, Inc., San Francisco, ${t("États-Unis", "USA")}.</p><p><b>${t("Contenu", "Content")} :</b> ${t("les offres sont résumées à partir de sources publiques citées sur chaque fiche. Les marques et noms d'organisations appartiennent à leurs propriétaires. Pour toute demande de retrait, contactez-nous.", "offers are summarised from public sources cited on each listing. Trademarks and organization names belong to their owners. For any removal request, contact us.")}</p>`));
  write("404.html", simplePage("/404.html", t("Page introuvable", "Page not found"), t("Page introuvable.", "Page not found."), `<p>${t("Cette offre a peut-être été clôturée et retirée.", "This offer may have closed and been removed.")} <a href="/">${t("Voir les offres ouvertes", "See open offers")}</a>.</p>`, { noindex: true }));
}

for (LANG of ["fr", "en"]) buildLang();
LANG = "fr";

const waText = whatsappText(open);
write("whatsapp/index.html", simplePage("/whatsapp/", "Message WhatsApp du jour", "Message prêt à partager.", `<p>Deux façons de partager les offres du jour dans vos groupes :</p>
<div class="share" style="margin:14px 0">
<a class="btn primary" href="https://wa.me/?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener" style="background:#1FA855;color:#fff;font-size:1.05rem;padding:12px 20px">Envoyer sur WhatsApp</a>
<button class="btn ghost" type="button" id="copy" style="font-size:1.05rem;padding:12px 20px">Copier le message</button>
</div>
<p id="ok" aria-live="polite" style="font-weight:700;color:var(--brand);min-height:1.5em"></p>
<p class="crumbs">« Envoyer sur WhatsApp » ouvre WhatsApp avec le message déjà écrit : choisissez le groupe puis envoyez. « Copier » met le texte dans le presse-papiers pour le coller où vous voulez.</p>
<pre class="wa" id="msg">${esc(waText)}</pre>
<script>
document.getElementById('copy').addEventListener('click',function(){
  var t=document.getElementById('msg').textContent, ok=document.getElementById('ok'), b=this;
  function done(){ ok.textContent='Copié ! Collez-le maintenant dans WhatsApp.'; b.textContent='Copié ✓'; setTimeout(function(){b.textContent='Copier le message';},3000); }
  function fallback(){ var ta=document.createElement('textarea'); ta.value=t; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.top='0'; ta.style.opacity='0'; document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0,t.length); var res=false; try{res=document.execCommand('copy');}catch(e){} document.body.removeChild(ta); if(res) done(); else ok.textContent='Copie automatique impossible : appuyez longuement sur le texte ci-dessous pour le copier.'; }
  if(navigator.clipboard && window.isSecureContext){ navigator.clipboard.writeText(t).then(done,fallback); } else { fallback(); }
});
</script>`, { noindex: true, enAvailable: false }));
write("whatsapp.txt", waText);

const urls = [
  ...["/", "/bourses/", "/emplois/", "/stages/", "/formations/", "/ong/", "/guides/"].map((u) => [u, data.maj, true]),
  ...["/a-propos/", "/contact/", "/confidentialite/", "/mentions-legales/"].map((u) => [u, null, true]),
  ...all.map((o) => [`/offres/${o.id}/`, o.publie, true]),
  ...articles.map((a) => [`/guides/${a.slug}/`, a.date, false]),
  ["/international/", data.maj, true],
  ["/outil-cv/", data.maj, true],
  ...(PROG.length ? [["/etranger/", data.maj, true], ...PROG.map((p) => [`/etranger/${p.slug}/`, data.maj, true])] : []),
  ...COUNTRY_PAGES.map((c) => [`/pays/${c.slug}/`, data.maj, true]),
];
const alts = (u) => `<xhtml:link rel="alternate" hreflang="fr" href="${SITE}${u}"/><xhtml:link rel="alternate" hreflang="en" href="${SITE}${enPath(u)}"/>`;
const entries = urls.flatMap(([u, dt, both]) => {
  const lm = dt ? `<lastmod>${dt}</lastmod>` : "";
  return both ? [`<url><loc>${SITE}${u}</loc>${lm}${alts(u)}</url>`, `<url><loc>${SITE}${enPath(u)}</loc>${lm}${alts(u)}</url>`] : [`<url><loc>${SITE}${u}</loc>${lm}</url>`];
});
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /whatsapp/\nSitemap: ${SITE}/sitemap.xml\n`);
if (ADSENSE) write("ads.txt", `google.com, ${ADSENSE.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`);

const nEn = open.filter(hasEN).length;
console.log(`Site construit : ${open.length} offres ouvertes / ${all.length} au total, ${articles.length} guides, ${entries.length} pages dans le plan du site (FR + EN). Offres ouvertes traduites en anglais : ${nEn}/${open.length}.`);
