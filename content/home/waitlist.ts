// Sektion 3 Warteliste. Nur E-Mail. Vor dem Livegang Pflicht: Impressum, Datenschutzerklärung,
// Double-Opt-in (Bestätigungs-Mail). Bis dahin wird nichts gesendet oder gespeichert.
export type WaitlistCopy = {
  line1: string;
  line2: string;
  placeholder: string;
  button: string;
  consent: string;
  privacy: string;
  note: string;
  invalid: string;
  pending: string;
};

export const waitlistCopy: Record<"en" | "de", WaitlistCopy> = {
  en: {
    line1: "Be the first",
    line2: "to get access.",
    placeholder: "Your email address",
    button: "Join the waitlist",
    consent:
      "I agree that Capitalife may email me about the launch and early access. I can withdraw my consent at any time. See our",
    privacy: "privacy policy.",
    note: "Free and without obligation. This is not an investment offer and not investment advice.",
    invalid: "Please enter a valid email address and confirm the consent.",
    pending:
      "Sign-up opens together with our privacy policy. Nothing has been sent.",
  },
  de: {
    line1: "Sei von Anfang an",
    line2: "dabei.",
    placeholder: "Deine E-Mail-Adresse",
    button: "Auf die Warteliste",
    consent:
      "Ich willige ein, dass Capitalife mich per E-Mail über den Start und den frühen Zugang informiert. Ich kann meine Einwilligung jederzeit widerrufen. Mehr in der",
    privacy: "Datenschutzerklärung.",
    note: "Kostenlos und unverbindlich. Kein Anlageangebot und keine Anlageberatung.",
    invalid:
      "Bitte gib eine gültige E-Mail-Adresse ein und bestätige die Einwilligung.",
    pending:
      "Die Anmeldung wird zusammen mit unserer Datenschutzerklärung freigeschaltet. Es wurde nichts gesendet.",
  },
};
