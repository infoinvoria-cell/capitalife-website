// Sektion 2 "Was ist Capitalife": Überschrift + drei Karten (Aufbau wie Referenz Ethena).
// Keine Rendite, kein CAGR, keine Performance (Wartelisten-Modus). Alle Texte Platzhalter bis Freigabe.
// Bestätigt von Jeroen: Marktdaten seit 2000, Walk-Forward seit 2013. PRÜFEN: Tool-Namen und Märkte.
export type AboutCopy = {
  statement: string;
  value: { number: string; label: string };
  cards: readonly { key: "value" | "tools" | "global"; title: string; text: string }[];
};

export const aboutCopy: Record<"en" | "de", AboutCopy> = {
  en: {
    statement: "We build quantitative strategies that follow rules, not emotions.",
    value: { number: "25+", label: "Years of market data" },
    cards: [
      { key: "value", title: "Built on deep data", text: "Our research uses market data since 2000, tested walk-forward since 2013." },
      { key: "tools", title: "Professional infrastructure", text: "We work with established exchanges, data providers and research tools, the same kind institutional traders use." },
      { key: "global", title: "Global markets", text: "Index futures such as the S&P 500, Nasdaq and DAX. Gold, silver and oil. Real agricultural products like wheat, corn, coffee and cocoa. Plus forex, stocks and ETFs." },
    ],
  },
  de: {
    statement: "Wir entwickeln quantitative Strategien, die Regeln folgen, nicht Emotionen.",
    value: { number: "25+", label: "Jahre Marktdaten" },
    cards: [
      { key: "value", title: "Auf tiefen Daten gebaut", text: "Unsere Forschung nutzt Marktdaten seit 2000, Walk-Forward getestet seit 2013." },
      { key: "tools", title: "Professionelle Infrastruktur", text: "Wir arbeiten mit etablierten Börsen, Datenanbietern und Research-Tools, wie sie auch institutionelle Händler nutzen." },
      { key: "global", title: "Globale Märkte", text: "Index-Futures wie S&P 500, Nasdaq und DAX. Gold, Silber und Öl. Echte Agrarprodukte wie Weizen, Mais, Kaffee und Kakao. Dazu Forex, Aktien und ETFs." },
    ],
  },
};
