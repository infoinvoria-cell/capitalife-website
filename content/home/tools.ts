// Tools und Partner für Karte 2 in Sektion 2 (als weisse, vereinfachte Zeichen in lib/cards/logos.ts).
// Logos sind Marken: vor dem Livegang Erlaubnis bzw. Markenrichtlinien prüfen; nur zeigen, was ihr wirklich nutzt.
// Python und TradingView sind Platzhalter (TradingView-Logo lag schon im alten Projekt) – bitte prüfen.
export const tools = ["Interactive Brokers", "CME Group", "Nasdaq", "Levantis", "TradingView", "Python"] as const;

export const toolsCaption: Record<"en" | "de", string> = {
  en: "Data and tools we work with",
  de: "Daten und Werkzeuge, mit denen wir arbeiten",
};
