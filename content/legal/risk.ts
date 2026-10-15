// Risikohinweis. Freiwillig, aber für ein künftiges Futures-Angebot dringend empfohlen.
// Keine Rendite-, Performance- oder Beratungsaussagen. Deutsch ist massgeblich.
import type { LegalCopy } from "./types";

export const riskCopy: LegalCopy = {
  de: {
    title: "Risikohinweis",
    updated: "Stand: Oktober 2026",
    intro:
      "Capitalife befindet sich im Aufbau. Diese Website dient nur der Information über das Projekt und der Anmeldung zur Warteliste.",
    sections: [
      {
        heading: "Kein Angebot, keine Beratung",
        paragraphs: [
          "Capitalife erbringt derzeit keine Wertpapierdienstleistungen, keine Anlageberatung, keine Anlagevermittlung, keine Finanzportfolioverwaltung und bietet keine Finanzprodukte an. Capitalife verfügt über keine Erlaubnis der BaFin nach KWG oder WpIG. Inhalte dieser Website sind weder ein Angebot noch eine Aufforderung zum Kauf oder Verkauf von Finanzinstrumenten und ersetzen keine individuelle Beratung.",
          "Die Anmeldung zur Warteliste ist unverbindlich und begründet keinen Anspruch auf eine künftige Leistung. Die Inhalte richten sich nicht an Personen in Ländern, in denen ihre Verbreitung unzulässig ist.",
        ],
      },
      {
        heading: "Risiken beim Handel mit Futures",
        paragraphs: [
          "Der Handel mit Finanzinstrumenten, insbesondere mit Futures auf Indizes und Rohstoffe, ist mit erheblichen Risiken verbunden und nicht für jeden geeignet. Bitte handeln Sie nur mit Geld, dessen Verlust Sie wirtschaftlich tragen können.",
        ],
        items: [
          "Totalverlust: Das eingesetzte Kapital kann vollständig verloren gehen.",
          "Verluste über die Einlage hinaus: Bei Futures können Verluste die hinterlegte Sicherheitsleistung übersteigen. Es kann eine Pflicht zum Nachschuss weiterer Mittel entstehen.",
          "Hebelwirkung: Schon kleine Kursbewegungen können zu großen Gewinnen oder Verlusten führen.",
          "Marktrisiken: Kurse können stark und schnell schwanken, auch durch politische, wirtschaftliche oder wetterbedingte Ereignisse.",
          "Liquiditätsrisiko: In bestimmten Marktphasen können Positionen nicht oder nur zu ungünstigen Kursen geschlossen werden.",
          "Kurslücken: Kurse können sprunghaft, zum Beispiel über Nacht oder am Wochenende, auf ein anderes Niveau springen. Verlustbegrenzungen greifen dann womöglich erst deutlich später.",
          "Kontrahentenrisiko: Broker, Börsen oder Clearingstellen können ihren Verpflichtungen nicht oder nur eingeschränkt nachkommen.",
          "Währungsrisiko: Bei Kontrakten in Fremdwährung können Wechselkursschwankungen das Ergebnis zusätzlich beeinflussen.",
          "Technische Risiken: Ausfälle von Systemen, Datenquellen oder Verbindungen können zu Verzögerungen oder Fehlern führen.",
        ],
      },
      {
        heading: "Daten, Tests und Modelle",
        paragraphs: [
          "Quantitative Modelle beruhen auf historischen Daten und Annahmen. Ergebnisse aus Rückrechnungen (Backtests) und Simulationen sind hypothetisch, wurden nachträglich berechnet und nicht mit echtem Kapital erzielt. Vergangene Wertentwicklungen und Testergebnisse sind kein verlässlicher Indikator für künftige Ergebnisse.",
        ],
      },
      {
        heading: "Eigene Verantwortung",
        paragraphs: [
          "Jede Anlage- oder Handelsentscheidung treffen Sie selbst und auf eigene Verantwortung. Lassen Sie sich vor einer Entscheidung gegebenenfalls von einer unabhängigen, fachkundigen Stelle beraten. Die Inhalte dieser Website dienen nur der allgemeinen Information.",
        ],
      },
    ],
  },
  en: {
    title: "Risk notice",
    updated:
      "As of October 2026 · English translation, the German version prevails",
    intro:
      "Capitalife is under development. This website only provides information about the project and the option to join the waitlist.",
    sections: [
      {
        heading: "No offer, no advice",
        paragraphs: [
          "Capitalife currently provides no investment services, no investment advice, no investment brokerage, no portfolio management and offers no financial products. Capitalife holds no licence from BaFin under the KWG or WpIG. Content on this website is neither an offer nor a solicitation to buy or sell financial instruments and does not replace individual advice.",
          "Joining the waitlist is non-binding and does not create any claim to a future service. The content is not directed at persons in countries where its distribution is not permitted.",
        ],
      },
      {
        heading: "Risks of trading futures",
        paragraphs: [
          "Trading financial instruments, in particular futures on indices and commodities, involves substantial risk and is not suitable for everyone. Only trade with money you can afford to lose.",
        ],
        items: [
          "Total loss: the capital invested can be lost entirely.",
          "Losses beyond the deposit: with futures, losses can exceed the margin posted. You may be required to add further funds.",
          "Leverage: even small price movements can lead to large gains or losses.",
          "Market risk: prices can move sharply and quickly, also due to political, economic or weather events.",
          "Liquidity risk: in certain market phases positions may not be closable, or only at unfavourable prices.",
          "Price gaps: prices can jump to a different level, for example overnight or over the weekend. Loss limits may then only take effect much later.",
          "Counterparty risk: brokers, exchanges or clearing houses may fail to meet their obligations in full or in part.",
          "Currency risk: for contracts in foreign currencies, exchange rate movements can additionally affect the result.",
          "Technical risk: failures of systems, data sources or connections can cause delays or errors.",
        ],
      },
      {
        heading: "Data, tests and models",
        paragraphs: [
          "Quantitative models are based on historical data and assumptions. Results of backtests and simulations are hypothetical, calculated after the fact and were not achieved with real capital. Past performance and test results are not a reliable indicator of future results.",
        ],
      },
      {
        heading: "Your own responsibility",
        paragraphs: [
          "You make every investment or trading decision yourself and at your own risk. If appropriate, seek advice from an independent, qualified adviser before deciding. The content of this website is for general information only.",
        ],
      },
    ],
  },
};
