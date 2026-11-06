import { useEffect, useState, type FormEvent } from "react";
import { KeyRound, Sparkles, X, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { AccessEvent, getDeviceId, getPassInfo, getPassKey, PassInfo, savePass } from "../access";

interface Status {
  freeDaily: number;
  freeRemaining: number;
  passDaily: number;
  buyUrl: string;
  prices: string;
  aiReady: boolean;
}

interface Offer {
  name: string;
  price: string;
  detail: string;
}

// PASS_PRICES="Pass 7 jours|1 000 FCFA|Idéal pour une candidature;Pass 30 jours|2 500 FCFA|Le plus choisi"
function parseOffers(raw: string): Offer[] {
  const list = raw
    .split(";")
    .map((s) => s.split("|").map((x) => x.trim()))
    .filter((p) => p[0])
    .map(([name, price = "", detail = ""]) => ({ name, price, detail }));
  return list.length
    ? list
    : [
        { name: "Pass 7 jours", price: "1 000 FCFA", detail: "Pour préparer une candidature" },
        { name: "Pass 30 jours", price: "2 500 FCFA", detail: "Le plus choisi" },
        { name: "Pass Recruteur 30 jours", price: "10 000 FCFA", detail: "Tri et classement de candidats" },
      ];
}

function fmtDate(iso: string | null) {
  if (!iso) return "sans limite de durée";
  try {
    return "jusqu'au " + new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export default function AccessBar() {
  const [status, setStatus] = useState<Status | null>(null);
  const [pass, setPass] = useState<PassInfo | null>(getPassInfo());
  const [hasKey, setHasKey] = useState<boolean>(!!getPassKey());
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const refreshStatus = () =>
    fetch("/api/access/status", { headers: { "x-device-id": getDeviceId() } })
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});

  useEffect(() => {
    refreshStatus();
    const onAccess = (e: Event) => {
      const d = (e as CustomEvent<AccessEvent>).detail;
      if (d.type === "payment_required") {
        setReason(d.message);
        setOpen(true);
      } else if (d.type === "error") {
        setToast(d.message);
        window.setTimeout(() => setToast(""), 6000);
      } else if (d.type === "free_remaining") {
        setStatus((s) => (s ? { ...s, freeRemaining: d.remaining } : s));
      }
    };
    const onPass = () => {
      setPass(getPassInfo());
      setHasKey(!!getPassKey());
    };
    window.addEventListener("resumeai:access", onAccess);
    window.addEventListener("resumeai:pass-changed", onPass);
    return () => {
      window.removeEventListener("resumeai:access", onAccess);
      window.removeEventListener("resumeai:pass-changed", onPass);
    };
  }, []);

  const activate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    const key = keyInput.trim();
    if (!key) {
      setFormError("Collez la clé reçue après votre achat.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/access/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-device-id": getDeviceId() },
        body: JSON.stringify({ key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || "Activation impossible.");
        return;
      }
      savePass(key.toUpperCase(), data.pass);
      setKeyInput("");
      setReason("");
      setOpen(false);
      setToast(`${data.pass.productName} activé. Toutes les fonctions IA sont débloquées.`);
      window.setTimeout(() => setToast(""), 6000);
    } catch {
      setFormError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setBusy(false);
    }
  };

  const offers = parseOffers(status?.prices || "");
  const label = hasKey
    ? `${pass?.productName || "Pass"} actif`
    : status
      ? `${status.freeRemaining}/${status.freeDaily} essais IA gratuits aujourd'hui`
      : "Essai gratuit";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setReason("");
          setOpen(true);
        }}
        className={`fixed z-[60] bottom-4 left-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg border transition-colors ${
          hasKey
            ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
            : "bg-white text-slate-800 border-slate-200 hover:border-indigo-400 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
        }`}
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {hasKey ? <CheckCircle2 size={16} /> : <Sparkles size={16} className="text-indigo-600" />}
        <span>{label}</span>
        {!hasKey && <span className="ml-1 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">Pass</span>}
      </button>

      {toast && (
        <div role="status" className="fixed z-[70] bottom-16 left-4 right-4 sm:right-auto sm:max-w-sm flex gap-2 items-start rounded-xl bg-slate-900 text-white px-4 py-3 text-sm shadow-xl">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{toast}</span>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-slate-950/60 p-0 sm:p-4" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pass-title"
            className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 id="pass-title" className="text-xl font-bold">
                  {hasKey ? "Votre Pass ResumeAI" : "Débloquez ResumeAI Pro"}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {reason ||
                    (hasKey
                      ? `${pass?.productName || "Pass"} ${fmtDate(pass?.expiresAt ?? null)}.`
                      : `Vous avez ${status?.freeDaily ?? 3} actions IA gratuites par jour. Le Pass les rend illimitées (jusqu'à ${status?.passDaily ?? 60} par jour).`)}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Fermer">
                <X size={20} />
              </button>
            </div>

            {!hasKey && (
              <div className="p-6 grid gap-3 sm:grid-cols-3">
                {offers.map((o, i) => (
                  <div
                    key={o.name}
                    className={`rounded-xl border p-4 flex flex-col gap-1 ${
                      i === 1 ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="text-sm font-semibold">{o.name}</div>
                    <div className="text-2xl font-bold tabular-nums">{o.price}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{o.detail}</div>
                  </div>
                ))}
                <ul className="sm:col-span-3 grid gap-1 text-sm text-slate-600 dark:text-slate-300 mt-1">
                  <li>• Import et analyse de CV, résumé et expériences optimisés par Claude</li>
                  <li>• Lettres de motivation, préparation d'entretien et traduction en 15 langues</li>
                  <li>• Paiement Mobile Money ou carte, sans abonnement automatique</li>
                </ul>
                {status?.buyUrl ? (
                  <a
                    href={status.buyUrl}
                    target="_blank"
                    rel="noopener"
                    className="sm:col-span-3 inline-flex justify-center items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3"
                  >
                    Acheter un Pass <ExternalLink size={16} />
                  </a>
                ) : (
                  <p className="sm:col-span-3 text-sm text-amber-700 dark:text-amber-400">La boutique n'est pas encore ouverte.</p>
                )}
              </div>
            )}

            <form onSubmit={activate} className="p-6 pt-0 grid gap-2">
              <label htmlFor="pass-key" className="text-sm font-semibold flex items-center gap-2">
                <KeyRound size={16} /> {hasKey ? "Changer de clé" : "J'ai déjà une clé"}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="pass-key"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Ex : ABCD-1234-EFGH-5678"
                  autoComplete="off"
                  className="flex-1 min-w-0 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 font-mono text-sm uppercase"
                />
                <button type="submit" disabled={busy} className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold px-5 py-2.5 disabled:opacity-60">
                  {busy ? "Vérification…" : "Activer"}
                </button>
              </div>
              {formError && <p className="text-sm text-rose-600">{formError}</p>}
              <p className="text-xs text-slate-500">La clé vous est envoyée par e-mail juste après le paiement.</p>
              {hasKey && (
                <button
                  type="button"
                  className="justify-self-start text-xs text-slate-500 underline mt-2"
                  onClick={() => {
                    savePass(null, null);
                    refreshStatus();
                  }}
                >
                  Retirer la clé de cet appareil
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
