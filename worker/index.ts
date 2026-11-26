// Website-Worker: liefert die statische Seite aus out/ und hat genau EINEN Endpunkt.
// /api/partner-tracking meldet eine Warteliste-Anmeldung an das Partner-Dashboard, aber nur wenn der Kontakt
// über einen Empfehlungslink kam UND das zweite Häkchen (Einwilligung für den Empfehlungsgeber) gesetzt hat.
// Die E-Mail-Anmeldung selbst läuft unverändert vom Browser an Web3Forms; dieser Endpunkt kann sie nie blockieren.
// Das Secret liegt nur als Worker-Secret (PARTNER_INGEST_SECRET), nie im Browser-Bundle.
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  PARTNER_TRACKING_URL?: string;
  PARTNER_INGEST_SECRET?: string;
}

const HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...HEADERS, "Content-Type": "application/json; charset=utf-8" } });
const PARTNER_DEFAULT = "https://partner.capitalife-invest.de/api/website/anmeldung";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REF = /^[a-z0-9-]{2,80}$/;

async function partnerTracking(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false }, 405);
  // Nur der eigene Browser-Aufruf: Origin muss vorhanden sein und zur eigenen Adresse passen.
  const origin = request.headers.get("Origin");
  try { if (!origin || new URL(origin).host !== new URL(request.url).host) return json({ ok: false }, 403); } catch { return json({ ok: false }, 403); }
  const laenge = Number(request.headers.get("Content-Length") ?? "0");
  if (!laenge || laenge > 4096) return json({ ok: false }, 413);
  let body: Record<string, unknown>;
  try { const wert: unknown = await request.json(); if (!wert || typeof wert !== "object" || Array.isArray(wert)) return json({ ok: false }, 400); body = wert as Record<string, unknown>; } catch { return json({ ok: false }, 400); }
  const email = typeof body["email"] === "string" ? body["email"].trim().toLowerCase() : "";
  const ref = typeof body["ref"] === "string" ? body["ref"].trim().toLowerCase() : "";
  const einwilligung = typeof body["einwilligung"] === "string" ? body["einwilligung"].trim() : "";
  if (!EMAIL.test(email) || email.length > 254 || !REF.test(ref) || einwilligung.length < 20 || einwilligung.length > 1000) return json({ ok: false }, 400);
  if (!env.PARTNER_INGEST_SECRET) return json({ ok: false }, 503);
  try {
    const antwort = await fetch(env.PARTNER_TRACKING_URL || PARTNER_DEFAULT, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.PARTNER_INGEST_SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ref, email, consent: einwilligung }),
    });
    const daten = (await antwort.json().catch(() => ({}))) as { ok?: boolean };
    return json({ ok: antwort.ok && daten.ok === true }, antwort.ok ? 200 : 502);
  } catch {
    return json({ ok: false }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname === "/api/partner-tracking") return partnerTracking(request, env);
    return env.ASSETS.fetch(request);
  },
};
