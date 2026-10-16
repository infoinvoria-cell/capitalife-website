// Bekannte Umgebungsvariablen (öffentlich, im Browser sichtbar). Punkt-Zugriff nötig, damit Next.js sie einsetzt.
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_WAITLIST_KEY?: string;
  }
}
