# ResumeAI Pro

Créateur de CV et assistant de candidature propulsé par **Claude** (Anthropic) : import de CV, résumé et expériences optimisés, analyse d'une offre d'emploi, lettre de motivation, préparation d'entretien, traduction en 15 langues et espace recruteur.

L'accès est **payant via un Pass** vendu sur Chariow (Mobile Money / carte), avec quelques essais gratuits par jour.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis remplissez ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

Pour tester le Pass sans Chariow : `DEV_PASS_KEYS="TEST-PASS-1"` dans `.env.local`, puis saisissez `TEST-PASS-1` dans la fenêtre « Pass ».

## Mettre en ligne (Render)

1. Poussez ce dossier sur un dépôt GitHub.
2. Sur Render : **New → Blueprint**, choisissez le dépôt (le fichier `render.yaml` configure tout).
3. Renseignez `ANTHROPIC_API_KEY`, `CHARIOW_API_KEY`, `CHARIOW_PRODUCT_IDS` et `PASS_BUY_URL`.

## Vendre les Pass sur Chariow

1. Créez un produit de type **Licence** par offre (ex : « Pass 7 jours », durée de validité 7 jours ; « Pass 30 jours », 30 jours).
2. Dans les réglages de licence : nombre d'activations = 2 (téléphone + ordinateur).
3. Créez une clé API (droits `licenses.read` et `licenses.write`) et mettez-la dans `CHARIOW_API_KEY`.
4. Le client reçoit sa clé par e-mail, la colle dans l'application, et le compte à rebours démarre à la première utilisation.

## Fonctionnement de l'accès

| Situation | Résultat |
|---|---|
| Sans Pass | `FREE_DAILY_ACTIONS` actions IA par jour et par appareil |
| Pass valide | jusqu'à `PASS_DAILY_ACTIONS` actions par jour |
| Pass expiré / révoqué | la fenêtre d'achat s'ouvre |
| Erreur de l'IA | l'action n'est pas décomptée |

Les compteurs sont en mémoire : ils repartent à zéro si le serveur redémarre.
