import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Server-only helpers for anything the browser holds but must not forge or
// edit: admin sessions and Bytle progress are sealed (signed) here.

// SESSION_SECRET when set (32+ random characters), otherwise derived from the
// long random server keys that are already configured. Changing either one
// signs everyone out and resets Bytle stats.
function key() {
  const material =
    process.env.SESSION_SECRET || [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.RESEND_API_KEY].filter(Boolean).join("\0");
  if (material.length < 32) throw new Error("Set SESSION_SECRET (32+ random characters)");
  return createHash("sha256").update(`byteclub-seal-v1\0${material}`).digest();
}

const mac = (purpose: string, body: string) => createHmac("sha256", key()).update(`${purpose}.${body}`).digest("base64url");

// `purpose` keeps seals apart: a Bytle cookie can never pass as an admin session.
export function seal(purpose: string, data: unknown) {
  const body = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${body}.${mac(purpose, body)}`;
}

export function unseal<T>(purpose: string, token: string | null | undefined): T | null {
  const [body, sig, extra] = token?.split(".") ?? [];
  if (!body || !sig || extra !== undefined) return null;
  const want = Buffer.from(mac(purpose, body));
  const got = Buffer.from(sig);
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

// Constant-time string check (hashing first evens out the lengths).
export function sameSecret(given: unknown, expected: string | undefined) {
  if (typeof given !== "string" || !expected) return false;
  const h = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(given), h(expected));
}

/* admin sessions: signed, expiring tokens instead of one static password-like token */

const ADMIN_HOURS = 8;

export const adminToken = () => seal("admin", { exp: Date.now() + ADMIN_HOURS * 3_600_000 });

export function isAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const session = unseal<{ exp: number }>("admin", token);
  return typeof session?.exp === "number" && session.exp > Date.now();
}

/* rate limiting */

// ponytail: per server instance, so it slows a single attacker but isn't a
// global cap; add a Vercel Firewall rate-limit rule (or Redis) for that.
const hits = new Map<string, { n: number; reset: number }>();

export function tooMany(request: Request, bucket: string, max: number, windowMs: number) {
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  if (hits.size > 10_000) for (const [k, h] of hits) if (h.reset < now) hits.delete(k);
  const k = `${bucket}:${ip}`;
  const h = hits.get(k);
  if (!h || h.reset < now) {
    hits.set(k, { n: 1, reset: now + windowMs });
    return false;
  }
  return ++h.n > max;
}

// Request bodies are untrusted: anything but a JSON object becomes null.
export async function jsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const body = await request.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? body : null;
}
