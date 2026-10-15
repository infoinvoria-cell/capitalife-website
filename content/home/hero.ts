// Stand: nur Warteliste / Early Access. Keine Zahlen, keine Rendite- oder Performance-Aussagen.
// Alle Texte sind Platzhalter bis Jeroen sie freigibt.
// Varianten: zum Wechseln nur den Index unten bei "headline" ändern.
export const heroHeadlines = [
  { line1: "Claim your place", line2: "on the waitlist." },
  { line1: "Secure your place", line2: "on the waitlist." },
  { line1: "Your place on the waitlist", line2: "is waiting." },
  { line1: "Be first", line2: "on the waitlist." },
  { line1: "Models, not moods.", line2: "Early access is open." },
  { line1: "Systematic by design.", line2: "Early access is open." },
  { line1: "The waitlist is open.", line2: "Claim your place." },
  { line1: "Capitalife is coming.", line2: "Early access is open." },
  { line1: "Quiet precision.", line2: "Now in early access." },
  { line1: "Quant. Macro. Risk.", line2: "Early access now open." },
  { line1: "Built on research.", line2: "Request early access." },
  { line1: "Research, engineered.", line2: "Early access starts here." },
  { line1: "Be early.", line2: "Join the first cohort." },
  { line1: "Early access is live.", line2: "Get in first." },
] as const;

// KPI-Varianten ohne Zahlen, Beträge, Rendite oder Beratungs-/Angebotswörter (Warteliste, keine Finanzaussagen).
// Jede Variante hat einen Hinweis, was vor dem Livegang stimmen muss. Keine Rechtsberatung.
// Zum Wechseln den Index bei "kpis" in heroCopy ändern. Vergleich: /hero-kpis
export type KpiSet = { note: string; items: readonly { label: string; value: string }[] };

export const heroKpiSets: readonly KpiSet[] = [
  {
    note: "Launch-Status. Unkritisch.",
    items: [
      { label: "Status", value: "Early access" },
      { label: "Access", value: "Waitlist" },
      { label: "Launch", value: "Coming soon" },
    ],
  },
  {
    note: "Arbeitsweise. 'By invitation' nur, wenn ihr wirklich einzeln einladet.",
    items: [
      { label: "Approach", value: "Systematic" },
      { label: "Focus", value: "Quant · Macro · Risk" },
      { label: "Access", value: "By invitation" },
    ],
  },
  {
    note: "Haltung, keine Leistungsaussage. Unkritisch.",
    items: [
      { label: "Built on", value: "Research" },
      { label: "Driven by", value: "Data" },
      { label: "Guided by", value: "Rules" },
    ],
  },
  {
    note: "Ablauf der Warteliste. Unkritisch.",
    items: [
      { label: "Stage", value: "Early access" },
      { label: "Access", value: "Waitlist" },
      { label: "Updates", value: "By email" },
    ],
  },
  {
    note: "Methode. 'Documented' nur, wenn die Regeln wirklich dokumentiert sind.",
    items: [
      { label: "Method", value: "Rule-based" },
      { label: "Discipline", value: "Systematic" },
      { label: "Process", value: "Documented" },
    ],
  },
  {
    note: "Knappheit. 'Limited' nur, wenn die Plätze wirklich begrenzt sind.",
    items: [
      { label: "Phase", value: "Pre-launch" },
      { label: "Spots", value: "Limited" },
      { label: "Next", value: "Launch updates" },
    ],
  },
  {
    note: "Ausrichtung. 'Long-term' ist Stil, kein Versprechen. Unkritisch.",
    items: [
      { label: "Focus", value: "Quant · Macro · Risk" },
      { label: "Style", value: "Systematic" },
      { label: "Horizon", value: "Long-term" },
    ],
  },
  {
    note: "Prinzipien als Gegensatzpaare. Unkritisch, sehr markentauglich.",
    items: [
      { label: "Data", value: "over opinion" },
      { label: "Rules", value: "over emotion" },
      { label: "Process", value: "over prediction" },
    ],
  },
  {
    note: "Prozess in drei Schritten. Unkritisch.",
    items: [
      { label: "Step 1", value: "Research" },
      { label: "Step 2", value: "Validate" },
      { label: "Step 3", value: "Systematize" },
    ],
  },
  {
    note: "Eigenentwicklung. 'In-house' nur, wenn Forschung und Modelle wirklich bei euch liegen.",
    items: [
      { label: "Research", value: "In-house" },
      { label: "Models", value: "Quantitative" },
      { label: "Execution", value: "Rule-based" },
    ],
  },
  {
    note: "Kein Risiko für Interessenten, rechtlich am sichersten. Muss stimmen: Warteliste kostenlos und unverbindlich.",
    items: [
      { label: "Waitlist", value: "Free to join" },
      { label: "Commitment", value: "None" },
      { label: "Launch", value: "Coming soon" },
    ],
  },
  {
    note: "Warteliste im Mittelpunkt. Unkritisch.",
    items: [
      { label: "Waitlist", value: "Open" },
      { label: "Members", value: "First access" },
      { label: "Launch", value: "Coming soon" },
    ],
  },
  {
    note: "Region und Sprache. Nur, wenn ihr euch wirklich an Europa richtet.",
    items: [
      { label: "Status", value: "Early access" },
      { label: "Region", value: "Europe" },
      { label: "Language", value: "EN · DE" },
    ],
  },
  {
    note: "Zugang in Wellen. 'In waves' nur, wenn ihr so freischaltet.",
    items: [
      { label: "Cohort", value: "Founding" },
      { label: "Access", value: "In waves" },
      { label: "Launch", value: "Coming soon" },
    ],
  },
  {
    note: "Technik-Ton ohne Ergebnis. Unkritisch.",
    items: [
      { label: "Signals", value: "Data-driven" },
      { label: "Decisions", value: "Rule-based" },
      { label: "Emotion", value: "Removed" },
    ],
  },
];

type Link = { label: string; href: string };
export type HeroCopy = {
  headline: { line1: string; line2: string };
  badge: string;
  primary: Link;
  secondary: Link;
  navCta: Link;
  kpis: readonly { label: string; value: string }[];
  nav: readonly Link[];
  langSwitch: string;
  /** Handy-Menü: Beschriftung für Vorlesehilfen */
  menu: { open: string; close: string };
};

// Aktive Texte je Sprache. Englisch aus den Varianten oben, Deutsch als Übersetzung.
export const heroCopy: Record<"en" | "de", HeroCopy> = {
  en: {
    headline: heroHeadlines[0],
    badge: "Coming soon",
    primary: { label: "Join the waitlist", href: "#waitlist" },
    secondary: { label: "Who we are", href: "#strategy" },
    navCta: { label: "Join waitlist", href: "#waitlist" },
    // Gewählt von Jeroen: Handel über Futures (Index- und Rohstoff-Futures, Begriffe wie bei IBKR), keine CFDs mehr. Sitz in Deutschland muss stimmen.
    kpis: [
      { label: "Global markets", value: "Index & commodity futures" },
      { label: "Based in", value: "Germany" },
      { label: "Built for", value: "Long-term thinkers" },
    ],
    // Nur echte Ziele. Partnerseite bewusst nicht verlinkt (alte Seite mit Gewinn-/Performance-Aussagen, erst prüfen).
    nav: [
      { label: "Approach", href: "#strategy" },
      { label: "Early access", href: "#waitlist" },
    ],
    langSwitch: "Switch to German",
    menu: { open: "Open menu", close: "Close menu" },
  },
  de: {
    headline: { line1: "Sichere dir deinen Platz", line2: "auf der Warteliste." },
    badge: "Bald verfügbar",
    primary: { label: "Auf die Warteliste", href: "#waitlist" },
    secondary: { label: "Wer wir sind", href: "#strategy" },
    navCta: { label: "Zur Warteliste", href: "#waitlist" },
    kpis: [
      { label: "Globale Märkte", value: "Index- & Rohstoff-Futures" },
      { label: "Sitz", value: "Deutschland" },
      { label: "Denkweise", value: "Langfristig" },
    ],
    nav: [
      { label: "Ansatz", href: "#strategy" },
      { label: "Zugang", href: "#waitlist" },
    ],
    langSwitch: "Auf Englisch wechseln",
    menu: { open: "Menü öffnen", close: "Menü schliessen" },
  },
};
