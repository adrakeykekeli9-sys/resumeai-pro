// Gestion de l'accès côté navigateur : identifiant d'appareil, clé de Pass, interception des appels /api.

const PASS_KEY = "resumeai_pass_key";
const PASS_INFO = "resumeai_pass_info";
const DEVICE_KEY = "resumeai_device_id";

function safeGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function safeSet(k: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* stockage indisponible : on continue sans */
  }
}

export function getDeviceId(): string {
  let id = safeGet(DEVICE_KEY);
  if (!id) {
    id = (crypto as any).randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
    safeSet(DEVICE_KEY, id);
  }
  return id;
}

export interface PassInfo {
  maskedKey: string;
  productName: string;
  customerName: string;
  expiresAt: string | null;
}

export function getPassKey(): string | null {
  return safeGet(PASS_KEY);
}
export function getPassInfo(): PassInfo | null {
  try {
    return JSON.parse(safeGet(PASS_INFO) || "null");
  } catch {
    return null;
  }
}
export function savePass(key: string | null, info: PassInfo | null) {
  safeSet(PASS_KEY, key);
  safeSet(PASS_INFO, info ? JSON.stringify(info) : null);
  window.dispatchEvent(new CustomEvent("resumeai:pass-changed"));
}

export type AccessEvent =
  | { type: "payment_required"; message: string }
  | { type: "error"; message: string }
  | { type: "free_remaining"; remaining: number };

function emit(detail: AccessEvent) {
  window.dispatchEvent(new CustomEvent<AccessEvent>("resumeai:access", { detail }));
}

/** Ajoute la clé de Pass aux appels IA et remonte les erreurs du serveur à l'interface. */
export function installFetchInterceptor() {
  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const isAi = /\/api\/(ai\/|scrape-job)/.test(url);
    if (!isAi) return original(input, init);

    const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
    headers.set("x-device-id", getDeviceId());
    const key = getPassKey();
    if (key) headers.set("x-pass-key", key);

    const res = await original(input, { ...init, headers });
    const remaining = res.headers.get("x-free-remaining");
    if (remaining !== null && !key) emit({ type: "free_remaining", remaining: Number(remaining) });

    if (!res.ok) {
      const body = await res.clone().json().catch(() => ({}) as any);
      const message = body?.error || "Une erreur est survenue.";
      if (res.status === 402) emit({ type: "payment_required", message });
      else if (body?.code === "pass_invalid" && (res.status === 403 || res.status === 404)) {
        savePass(null, null);
        emit({ type: "payment_required", message });
      } else emit({ type: "error", message });
    }
    return res;
  };
}
