# Opportunité d'Emplois

Site statique : `data/offres.json` (les offres) + `articles/*.html` (les guides) → `node build.mjs` → `dist/`.

Mise à jour quotidienne : modifier `data/offres.json` (ajouter les nouvelles offres, retirer celles clôturées depuis plus de 30 jours, mettre `maj` à la date du jour), puis pousser sur `main`. Render reconstruit le site automatiquement.

Variables d'environnement (Render) : `SITE_URL`, `ADSENSE_CLIENT` (ca-pub-…), `CONTACT_EMAIL`, `CONTACT_WHATSAPP`, `RESUMEAI_URL`.

Champs d'une offre : `id` (unique, minuscules et tirets), `type` (bourse | emploi | stage), `titre`, `organisme`, `pays`, `niveau`, `financement`, `dateLimite` (AAAA-MM-JJ), `publie` (AAAA-MM-JJ), `description`, `lien` (source officielle de préférence).

Types : `bourse`, `emploi`, `stage`, `formation`. Champ facultatif `secteur: "ong"` pour les offres d'ONG (rubrique /ong/). `dateLimite: null` = offre ouverte en continu.

Règle de vérification : une offre n'est publiée que si l'annonce précise est retrouvée sur le site officiel de l'organisme (ou sur un portail officiel de recrutement : careers.un.org, ReliefWeb avec lien vers l'annonce, portail carrières de l'ONG). Le champ `lien` doit pointer vers l'annonce elle-même, jamais vers une page d'accueil. Les programmes permanents (portail de recrutement, formation ouverte en continu) peuvent pointer vers leur page officielle.

### Page « International » (/international/)

Elle liste les offres hors Togo ouvertes aux candidats de toutes nationalités. Le classement est automatique : bourses, et postes qui ne sont ni nationaux (NO, G, « ressortissants », « recrutement local »…) ni des postes d'appui (assistant, stagiaire, agent…). Pour forcer le classement d'une offre, ajoutez `"international": true` ou `"international": false`.

### Travailler à l'étranger (/etranger/)

`data/programmes.json` liste les programmes officiels de recrutement international par destination (Canada, Québec, Allemagne, Luxembourg, France…). Chaque programme doit pointer vers un site gouvernemental. Vérifiez les conditions au moins une fois par mois.

### Offres d'emploi à l'étranger ouvertes aux candidats d'Afrique

- **Canada** : `python3 -I scripts/canada_jobbank.py /chemin/sortie.json 10` lit le Guichet-Emplois (site officiel) et ne garde que les offres dont la rubrique « Qui peut postuler » accepte les « autres candidats, avec ou sans un permis de travail canadien valide ». Le serveur coupe parfois les connexions : relancer si besoin. Publier avec `"pays": "Canada (Ville, PROV)"`, `"international": true`, lien vers `https://www.guichetemplois.gc.ca/rechercheemplois/offredemploi/<id>`.
- **Europe et Royaume-Uni** : ne publier une offre individuelle que si l'annonce officielle (EURES, Make it in Germany, employeur) indique clairement qu'elle est ouverte aux candidats hors UE, ou qu'un parrainage de visa est proposé.

### Version anglaise (/en/)

Le site est généré en français (racine) et en anglais (`/en/…`), avec un sélecteur FR | EN et les balises `hreflang`.
- Textes de l'interface : directement dans `build.mjs` via `t("français", "English")`.
- Offres : traductions dans `data/offres_en.json`, indexées par `id` : `{ "titre", "description", "niveau", "financement", "pays" (facultatif) }`. **Chaque nouvelle offre doit y être ajoutée** ; sinon la page anglaise affiche le texte français avec une mention.
- Programmes à l'étranger : sous-objets `"en"` dans `data/programmes.json`.
- Les guides et le message WhatsApp restent en français.

## Mise à jour automatique (sans Claude Code)

Le fichier `.github/workflows/opportunite-emplois-quotidien.yml` lance chaque matin à 04:17 UTC
`scripts/auto_update.py` sur les serveurs de GitHub, puis Render redéploie le site. Cela fonctionne même
quand l'abonnement Claude est épuisé.

- Sans réglage : retrait des offres expirées depuis plus de 30 jours, offres du Guichet-Emplois du Canada.
- Avec le secret GitHub `ANTHROPIC_API_KEY` (clé de l'API Claude, facturée à l'usage, séparée de l'abonnement) :
  lecture des nouvelles annonces de HumanitaireHub, JobRelais et EmploiTogo, règle de vérification, fiche en
  français et en anglais (20 offres au plus par jour, variable `MAX_NOUVELLES`).
- Modèle : `claude-opus-5-5` par défaut ; la variable GitHub `CLAUDE_MODEL` peut le changer (par exemple
  `claude-haiku-5-5`, bien moins cher).
- `data/vus.json` garde les annonces déjà examinées.
