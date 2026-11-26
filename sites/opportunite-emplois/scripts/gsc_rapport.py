"""Rapport Google Search Console d'opportunite-emplois.org (lancé par GitHub Actions).

La clé du compte de service Google est lue dans la variable GSC_SERVICE_ACCOUNT_JSON
(secret GitHub), écrite dans un fichier temporaire et jamais affichée.
Sortie : rapport-gsc/rapport.json (requêtes, pages, pays, appareils, image de marque,
sitemaps, inspection de quelques adresses), lu ensuite avec les skills gsc-*.
"""
import datetime as dt
import json
import os
import sys
import tempfile

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
SORTIE = "rapport-gsc"
PAGES_A_INSPECTER = ["/", "/pays/togo/", "/international/", "/etranger/", "/en/"]


def main():
    brut = os.environ.get("GSC_SERVICE_ACCOUNT_JSON", "").strip()
    if not brut:
        print("::warning::Secret GSC_SERVICE_ACCOUNT_JSON absent : rapport Search Console sauté")
        return 0
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        f.write(brut)
        chemin = f.name
    try:
        creds = service_account.Credentials.from_service_account_file(chemin, scopes=SCOPES)
    finally:
        os.remove(chemin)
    gsc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    sites = gsc.sites().list().execute().get("siteEntry", [])
    noms = [s["siteUrl"] for s in sites]
    site = next((s for s in noms if "opportunite-emplois.org" in s), None)
    if not site:
        print(f"::error::Le compte de service n'a accès à aucune propriété opportunite-emplois.org (propriétés visibles : {noms})")
        return 1
    base = "https://opportunite-emplois.org"
    fin = dt.date.today() - dt.timedelta(days=2)
    debut = fin - dt.timedelta(days=27)
    prec_fin = debut - dt.timedelta(days=1)
    prec_debut = prec_fin - dt.timedelta(days=27)

    def requete(dims, d1=debut, d2=fin, lignes=250, **extra):
        corps = {"startDate": d1.isoformat(), "endDate": d2.isoformat(), "dimensions": dims, "rowLimit": lignes, **extra}
        try:
            return gsc.searchanalytics().query(siteUrl=site, body=corps).execute().get("rows", [])
        except Exception as e:  # une dimension non disponible ne doit pas tout arrêter
            return [{"erreur": str(e)[:300]}]

    rapport = {
        "propriete": site,
        "periode": [debut.isoformat(), fin.isoformat()],
        "total": requete([], lignes=1),
        "total_periode_precedente": requete([], prec_debut, prec_fin, lignes=1),
        "par_jour": requete(["date"], lignes=60),
        "requetes": requete(["query"], lignes=500),
        "pages": requete(["page"], lignes=500),
        "requetes_par_page": requete(["page", "query"], lignes=1000),
        "pays": requete(["country"], lignes=50),
        "appareils": requete(["device"]),
        "apparence": requete(["searchAppearance"]),
        "marque": requete(["brandedClassification"]),
        "sitemaps": gsc.sitemaps().list(siteUrl=site).execute().get("sitemap", []),
        "inspections": {},
    }
    for p in PAGES_A_INSPECTER:
        try:
            r = gsc.urlInspection().index().inspect(body={"inspectionUrl": base + p, "siteUrl": site}).execute()
            rapport["inspections"][p] = r.get("inspectionResult", {}).get("indexStatusResult", {})
        except Exception as e:
            rapport["inspections"][p] = {"erreur": str(e)[:300]}
    os.makedirs(SORTIE, exist_ok=True)
    json.dump(rapport, open(os.path.join(SORTIE, "rapport.json"), "w"), ensure_ascii=False, indent=1)
    tot = (rapport["total"] or [{}])[0]
    print(f"Rapport Search Console {site} du {debut} au {fin} : {tot.get('clicks', 0)} clics, "
          f"{tot.get('impressions', 0)} impressions, position moyenne {round(tot.get('position', 0), 1)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
