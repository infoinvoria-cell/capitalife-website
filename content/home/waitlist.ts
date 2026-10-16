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
      "I agree that Capitalife may email me about the launch and early access. For this, my email address is transmitted to Capitalife via the service Web3Forms (India, servers in the USA); these countries do not offer a level of data protection comparable to the EU. I can withdraw my consent at any time. See our",
    privacy: "privacy policy.",
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
      "Ich willige ein, dass Capitalife mich per E-Mail über den Start und den frühen Zugang informiert. Meine E-Mail-Adresse wird dazu über den Dienst Web3Forms (Indien, Server in den USA) an Capitalife übermittelt; dort besteht kein mit der EU vergleichbares Datenschutzniveau. Ich kann meine Einwilligung jederzeit widerrufen. Mehr in der",
    privacy: "Datenschutzerklärung.",
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
