// Couche IA : toutes les fonctions du serveur passent par ici pour appeler Claude.
import Anthropic from "@anthropic-ai/sdk";

// Modèle configurable par variable d'environnement (par défaut : Claude Opus 5.5).
export const CLAUDE_MODEL = process.env.AI_MODEL || "claude-opus-5-5";

// Effort de réflexion : "low" suffit pour la rédaction de CV et reste économique.
type Effort = "low" | "medium" | "high";
const DEFAULT_EFFORT = (process.env.AI_EFFORT as Effort) || "low";

let client: Anthropic | null = null;

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new AiUnavailableError("La clé ANTHROPIC_API_KEY n'est pas configurée sur le serveur.");
    }
    // Lit ANTHROPIC_API_KEY dans l'environnement. 2 nouvelles tentatives automatiques (429/5xx).
    client = new Anthropic({ maxRetries: 2, timeout: 120_000 });
  }
  return client;
}

export class AiUnavailableError extends Error {}
export class AiRefusalError extends Error {}

interface CallOptions {
  system: string;
  prompt: string;
  maxTokens?: number;
  effort?: Effort;
}

async function callClaude(opts: CallOptions, format?: Record<string, unknown>) {
  const c = getClient();
  const response = await c.beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: opts.maxTokens ?? 8000,
    // Si un filtre de sécurité refuse la requête, l'API la relance automatiquement sur un modèle de repli.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: opts.system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: opts.prompt }],
    output_config: {
      effort: opts.effort ?? DEFAULT_EFFORT,
      ...(format ? { format: { type: "json_schema", schema: format } } : {}),
    },
  } as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming);

  if (response.stop_reason === "refusal") {
    throw new AiRefusalError("La demande a été refusée par l'IA. Reformulez le contenu.");
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("La réponse de l'IA a été coupée (texte trop long). Réessayez avec un contenu plus court.");
  }
  const text = response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  console.log(
    `[claude] ${response.model} in=${response.usage.input_tokens} out=${response.usage.output_tokens} cache_read=${response.usage.cache_read_input_tokens ?? 0}`,
  );
  return text;
}

/** Réponse texte libre. */
export async function generateText(opts: CallOptions): Promise<string> {
  return callClaude(opts);
}

/** Réponse JSON garantie conforme au schéma (structured outputs). */
export async function generateJSON<T = any>(opts: CallOptions, schema: Record<string, unknown>): Promise<T> {
  const text = await callClaude(opts, schema);
  return JSON.parse(text) as T;
}

// ─── Petits constructeurs de schéma JSON (structured outputs exige additionalProperties:false + required) ───
export const S = {
  str: (description?: string) => ({ type: "string", ...(description ? { description } : {}) }),
  int: (description?: string) => ({ type: "integer", ...(description ? { description } : {}) }),
  arr: (items: Record<string, unknown>, description?: string) => ({
    type: "array",
    items,
    ...(description ? { description } : {}),
  }),
  obj: (properties: Record<string, Record<string, unknown>>) => ({
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  }),
};
