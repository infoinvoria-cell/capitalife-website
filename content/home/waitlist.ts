// Sektion 3 Warteliste. Nur E-Mail. Schnelle Lösung: Versand über Web3Forms an unser Postfach (lib/waitlist.ts).
// Ohne Schlüssel (NEXT_PUBLIC_WAITLIST_KEY) wird nichts gesendet und "pending" angezeigt.
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
  sending: string;
  success: string;
  error: string;
};

export const waitlistCopy: Record<"en" | "de", WaitlistCopy> = {
  en: {
    line1: "Be the first",
    line2: "to get access.",
    placeholder: "Your email address",
    button: "Join the waitlist",
    consent:
      "I agree to receive emails about the launch, also via a service outside the EU (India/USA). I can withdraw at any time.",
    privacy: "Details",
    note: "Free and without obligation. This is not an investment offer and not investment advice.",
    invalid: "Please enter a valid email address and confirm the consent.",
    pending:
      "Sign-up opens together with our privacy policy. Nothing has been sent.",
    sending: "Sending …",
    success:
      "Thank you! You are on the waitlist. We will email you about the launch.",
    error:
      "That did not work. Please try again or email us at info@capitalife-invest.de.",
  },
  de: {
    line1: "Sei von Anfang an",
    line2: "dabei.",
    placeholder: "Deine E-Mail-Adresse",
    button: "Auf die Warteliste",
    consent:
      "Ich willige ein, E-Mails zum Start zu erhalten, auch über einen Dienst außerhalb der EU (Indien/USA). Widerruf jederzeit möglich.",
    privacy: "Details",
    note: "Kostenlos und unverbindlich. Kein Anlageangebot und keine Anlageberatung.",
    invalid:
      "Bitte gib eine gültige E-Mail-Adresse ein und bestätige die Einwilligung.",
    pending:
      "Die Anmeldung wird zusammen mit unserer Datenschutzerklärung freigeschaltet. Es wurde nichts gesendet.",
    sending: "Wird gesendet …",
    success:
      "Danke! Du stehst auf der Warteliste. Wir melden uns per E-Mail zum Start.",
    error: "Das hat nicht geklappt. Bitte versuche es erneut.",
  },
};
