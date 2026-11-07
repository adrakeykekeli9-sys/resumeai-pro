# Opportunité d'Emplois

Site statique : `data/offres.json` (les offres) + `articles/*.html` (les guides) → `node build.mjs` → `dist/`.

Mise à jour quotidienne : modifier `data/offres.json` (ajouter les nouvelles offres, retirer celles clôturées depuis plus de 30 jours, mettre `maj` à la date du jour), puis pousser sur `main`. Render reconstruit le site automatiquement.

Variables d'environnement (Render) : `SITE_URL`, `ADSENSE_CLIENT` (ca-pub-…), `CONTACT_EMAIL`, `CONTACT_WHATSAPP`, `RESUMEAI_URL`.

Champs d'une offre : `id` (unique, minuscules et tirets), `type` (bourse | emploi | stage), `titre`, `organisme`, `pays`, `niveau`, `financement`, `dateLimite` (AAAA-MM-JJ), `publie` (AAAA-MM-JJ), `description`, `lien` (source officielle de préférence).

Types : `bourse`, `emploi`, `stage`, `formation`. Champ facultatif `secteur: "ong"` pour les offres d'ONG (rubrique /ong/). `dateLimite: null` = offre ouverte en continu.

Règle de vérification : une offre n'est publiée que si l'annonce précise est retrouvée sur le site officiel de l'organisme (ou sur un portail officiel de recrutement : careers.un.org, ReliefWeb avec lien vers l'annonce, portail carrières de l'ONG). Le champ `lien` doit pointer vers l'annonce elle-même, jamais vers une page d'accueil. Les programmes permanents (portail de recrutement, formation ouverte en continu) peuvent pointer vers leur page officielle.
