// Empfehlungskennung aus dem Link (?ref=<kennung>): wird im Browser gemerkt und bei der Anmeldung zur Warteliste mitgeschickt.
// Nur Kleinbuchstaben, Ziffern und Bindestrich, 3 bis 40 Zeichen. Gespeichert wird lokal (localStorage), höchstens 30 Tage.
const KEY = "clf_ref";
const PATTERN = /^[a-z0-9-]{3,40}$/;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function captureRef(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = new URLSearchParams(window.location.search).get("ref");
    if (!raw) return;
    const ref = raw.trim().toLowerCase();
    if (!PATTERN.test(ref)) return;
    window.localStorage.setItem(KEY, JSON.stringify({ ref, ts: Date.now() }));
  } catch {
    // Speicher oder Adresse nicht verfügbar: dann wird nichts gemerkt.
  }
}

export function getRef(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { ref?: unknown; ts?: unknown };
    if (typeof data.ref !== "string" || typeof data.ts !== "number") return null;
    if (!PATTERN.test(data.ref)) return null;
    if (Date.now() - data.ts > MAX_AGE_MS) return null;
    return data.ref;
  } catch {
    return null;
  }
}
