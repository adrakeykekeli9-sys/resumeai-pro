"""Collecte, sur le Guichet-Emplois du Canada (site officiel), les offres d'employeurs qui recrutent
des travailleurs étrangers ET qui acceptent explicitement les candidats sans permis de travail canadien
(« autres candidats, avec ou sans un permis de travail canadien valide »).
Usage : python3 -I scripts/canada_jobbank.py sortie.json [max_offres]"""
import html, json, re, subprocess, sys, time

BASE = "https://www.guichetemplois.gc.ca"
UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/120"

def get(url, tries=3):
    for k in range(tries):
        out = subprocess.run(["curl", "-sL", "-m", "30", "-A", UA, url], capture_output=True, text=True, errors="ignore").stdout
        if len(out) > 5000:
            return out
        time.sleep(4 * (k + 1))
    return ""

def text(p):
    p = re.sub(r"<(script|style).*?</\1>", "", p, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", p)))

def main():
    dest, maxn = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 15
    ids = []
    for prov in ([] if len(sys.argv) > 3 else ["", "QC", "NB", "ON", "MB", "AB", "BC", "SK", "NS"]):
        lst = get(f"{BASE}/jobsearch/rechercheemplois?fsrc=32&sort=D" + (f"&fprov={prov}" if prov else ""))
        ids += re.findall(r"/jobsearch/offredemploietet/(\d+)", lst)
        time.sleep(2)
    ids = list(dict.fromkeys(sys.argv[3].split(",") if len(sys.argv) > 3 else ids))
    found = []
    for i in ids:
        if len(found) >= maxn:
            break
        time.sleep(2)
        raw = get(f"{BASE}/rechercheemplois/offredemploi/{i}")
        s = text(raw)
        j = s.find("Qui peut postuler")
        if j < 0 or "autres candidats, avec ou sans" not in s[j:j + 500]:
            continue
        def m(rx):
            r = re.search(rx, s)
            return r.group(1).strip() if r else ""
        found.append({
            "jobbank_id": i,
            "lien": f"{BASE}/rechercheemplois/offredemploi/{i}",
            "titre": (lambda t: html.unescape(t.group(1)).split(" - Emploi")[0].strip() if t else "")(re.search(r"<title>(.*?)</title>", raw, re.S)),
            "employeur": m(r"Publiée le \d{1,2} \S+ \d{4} (?:par )?(.+?) Emplacement") or m(r"Employeur\s*:?\s*(.+?)\s{1,2}(?:Emplacement|Adresse)"),
            "lieu": "",
            "salaire": m(r"Salaire\s*:?\s*(.+?(?:heure|année|semaine))"),
            "langue": m(r"Langues?\s+(Français|Anglais|Bilingue|Anglais ou français)"),
            "date_limite": m(r"Publiée jusqu’au (\d{4}-\d{2}-\d{2})"),
            "eimt": "approuvée" if "EIMT approuvée" in s else ("demandée" if "EIMT demandée" in s else ""),
            "extrait": s[s.find("Exigences"):s.find("Exigences") + 500] if "Exigences" in s else "",
        })
        json.dump(found, open(dest, "w"), ensure_ascii=False, indent=1)
        print("OK", i, found[-1]["titre"][:60], found[-1]["lieu"], found[-1]["date_limite"], file=sys.stderr)
    json.dump(found, open(dest, "w"), ensure_ascii=False, indent=1)
    print(f"{len(found)} offres ouvertes aux candidats de l'étranger sur {len(ids)} examinées", file=sys.stderr)

if __name__ == "__main__":
    main()
