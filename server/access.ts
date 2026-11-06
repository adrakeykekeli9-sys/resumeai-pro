// Accès payant : essai gratuit limité + "Pass" vendu sur Chariow (clé de licence).
import type express from "express";

const CHARIOW_API = "https://api.chariow.com/v1";
const FREE_DAILY = Number(process.env.FREE_DAILY_ACTIONS ?? 3); // actions IA gratuites par jour et par appareil
const PASS_DAILY = Number(process.env.PASS_DAILY_ACTIONS ?? 60); // plafond anti-partage par Pass et par jour
const GRACE_CALLS = Number(process.env.FREE_GRACE_CALLS ?? 6); // appels liés à un même clic (dans la minute) non décomptés
const ALLOWED_PRODUCTS = (process.env.CHARIOW_PRODUCT_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// Clés de test utilisables sans Chariow (utile en développement). Ex : DEV_PASS_KEYS="TEST-PASS-1"
const DEV_KEYS = (process.env.DEV_PASS_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);

export interface PassInfo {
  key: string;
  maskedKey: string;
  productName: string;
  customerName: string;
  expiresAt: string | null;
}

// Cache mémoire des licences validées (évite d'appeler Chariow à chaque clic).
const licenseCache = new Map<string, { info: PassInfo; checkedAt: number }>();
const CACHE_MS = 10 * 60 * 1000;

// Compteurs journaliers en mémoire (remis à zéro chaque jour).
let counterDay = new Date().toISOString().slice(0, 10);
const counters = new Map<string, number>();
function bump(id: string): number {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== counterDay) {
    counterDay = today;
    counters.clear();
    grace.clear();
  }
  const n = (counters.get(id) ?? 0) + 1;
  counters.set(id, n);
  return n;
}
function refund(id: string) {
  const n = counters.get(id);
  if (n && n > 0) counters.set(id, n - 1);
}
// Une action qui échoue (erreur serveur ou saisie refusée) n'est pas décomptée.
function refundOnFailure(res: express.Response, ids: string[]) {
  res.on("finish", () => {
    if (res.statusCode >= 400) ids.forEach(refund);
  });
}
function used(id: string): number {
  const today = new Date().toISOString().slice(0, 10);
  return today === counterDay ? counters.get(id) ?? 0 : 0;
}

const grace = new Map<string, { until: number; left: number }>();

export class PassError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

function cleanKey(raw: unknown): string {
  return String(raw ?? "").trim().toUpperCase().slice(0, 100);
}

async function chariow(path: string, init?: RequestInit) {
  const apiKey = process.env.CHARIOW_API_KEY;
  if (!apiKey) throw new PassError("Le paiement n'est pas encore configuré sur ce serveur.", 503);
  const res = await fetch(`${CHARIOW_API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", Accept: "application/json" },
  });
  const body: any = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

function toPassInfo(data: any): PassInfo {
  return {
    key: data?.license?.key,
    maskedKey: data?.license?.masked_key || "",
    productName: data?.product?.name || "Pass",
    customerName: data?.customer?.first_name || data?.customer?.name || "",
    expiresAt: data?.expires_at ?? null,
  };
}

function checkUsable(data: any) {
  if (ALLOWED_PRODUCTS.length && !ALLOWED_PRODUCTS.includes(data?.product?.id)) {
    throw new PassError("Cette clé ne correspond pas à un Pass ResumeAI.", 403);
  }
  if (data?.status === "revoked") throw new PassError("Cette clé a été révoquée.", 403);
  if (data?.is_expired || data?.status === "expired") throw new PassError("Votre Pass a expiré. Achetez un nouveau Pass pour continuer.", 402);
}

/** Vérifie une clé (et l'active au premier usage). */
export async function validatePass(rawKey: unknown, deviceId?: string): Promise<PassInfo> {
  const key = cleanKey(rawKey);
  if (!key) throw new PassError("Saisissez votre clé de Pass.");

  if (DEV_KEYS.includes(key)) {
    return { key, maskedKey: key, productName: "Pass de test", customerName: "", expiresAt: null };
  }

  const cached = licenseCache.get(key);
  if (cached && Date.now() - cached.checkedAt < CACHE_MS) {
    if (cached.info.expiresAt && new Date(cached.info.expiresAt) < new Date()) {
      licenseCache.delete(key);
      throw new PassError("Votre Pass a expiré. Achetez un nouveau Pass pour continuer.", 402);
    }
    return cached.info;
  }

  const got = await chariow(`/licenses/${encodeURIComponent(key)}`);
  if (got.status === 404) throw new PassError("Clé introuvable. Vérifiez qu'elle est bien recopiée.", 404);
  if (!got.ok) throw new PassError("Vérification de la clé impossible pour le moment. Réessayez dans un instant.", 502);
  let data = got.body.data;
  checkUsable(data);

  // Premier usage : on active la licence (le compte à rebours du Pass démarre à ce moment-là).
  if (data.status === "pending_activation") {
    const act = await chariow(`/licenses/${encodeURIComponent(key)}/activate`, {
      method: "POST",
      body: JSON.stringify(deviceId ? { device_identifier: String(deviceId).slice(0, 255) } : {}),
    });
    if (!act.ok) throw new PassError(act.body?.message || "Activation impossible.", 400);
    data = act.body.data;
    checkUsable(data);
  }
  if (!data.is_active) throw new PassError("Cette clé n'est pas active.", 403);

  const info = toPassInfo(data);
  licenseCache.set(key, { info, checkedAt: Date.now() });
  return info;
}

function clientId(req: express.Request): string {
  const device = String(req.header("x-device-id") || "").slice(0, 64);
  return `free:${device || req.ip}`;
}

/** Middleware : laisse passer si Pass valide ou s'il reste des essais gratuits. */
export function requireAccess() {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const key = req.header("x-pass-key");
      if (key) {
        const info = await validatePass(key, req.header("x-device-id") || undefined);
        const n = bump(`pass:${info.key}`);
        if (n > PASS_DAILY) {
          res.status(429).json({ error: `Limite quotidienne de ${PASS_DAILY} actions IA atteinte. Elle se renouvelle demain.`, code: "daily_limit" });
          return;
        }
        res.setHeader("x-access", "pass");
        refundOnFailure(res, [`pass:${info.key}`]);
        next();
        return;
      }
      // Essai gratuit : on compte aussi par IP pour éviter qu'on contourne la limite en changeant d'identifiant.
      const id = clientId(req);
      const ipId = `ip:${req.ip}`;
      // Un clic peut déclencher plusieurs appels (ex : analyse → lettre + questions).
      // Les appels qui suivent dans la minute comptent pour la même action.
      const g = grace.get(id);
      if (g && g.until > Date.now() && g.left > 0) {
        g.left -= 1;
        res.setHeader("x-free-remaining", String(Math.max(0, FREE_DAILY - used(id))));
        next();
        return;
      }
      if (used(id) >= FREE_DAILY || used(ipId) >= FREE_DAILY * 3) {
        res.status(402).json({
          error: `Vous avez utilisé vos ${FREE_DAILY} essais gratuits du jour. Activez un Pass pour continuer.`,
          code: "payment_required",
        });
        return;
      }
      bump(id);
      bump(ipId);
      if (GRACE_CALLS > 0) grace.set(id, { until: Date.now() + 60_000, left: GRACE_CALLS });
      refundOnFailure(res, [id, ipId]);
      res.setHeader("x-free-remaining", String(Math.max(0, FREE_DAILY - used(id))));
      next();
    } catch (e: any) {
      const status = e instanceof PassError ? e.status : 500;
      res.status(status).json({ error: e.message || "Erreur d'accès.", code: "pass_invalid" });
    }
  };
}

export function accessStatus(req: express.Request) {
  return {
    freeDaily: FREE_DAILY,
    freeRemaining: Math.max(0, FREE_DAILY - used(clientId(req))),
    passDaily: PASS_DAILY,
    buyUrl: process.env.PASS_BUY_URL || "",
    prices: process.env.PASS_PRICES || "",
  };
}
