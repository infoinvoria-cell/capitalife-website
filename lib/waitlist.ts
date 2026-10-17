// Warteliste, schnelle Lösung: die Anmeldung wird über Web3Forms als E-Mail an unser Postfach geschickt.
// Mitgeschickt werden nur E-Mail, Sprache, Zeitpunkt und der Wortlaut der Einwilligung (Nachweis).
const ENDPOINT = "https://api.web3forms.com/submit";

// Öffentlicher Web3Forms-Schlüssel (kein Geheimnis, laut Web3Forms für den Browser gedacht).
// Eine Env-Variable NEXT_PUBLIC_WAITLIST_KEY (beim Build gesetzt) hat Vorrang.
export const waitlistKey =
  process.env.NEXT_PUBLIC_WAITLIST_KEY || "3b24c273-88cf-407d-9879-e6a31705fa90";

export async function joinWaitlist(
  email: string,
  lang: string,
  consentText: string,
): Promise<boolean> {
  if (!waitlistKey) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: waitlistKey,
        subject: "Neue Anmeldung Warteliste Capitalife",
        from_name: "Capitalife Website",
        email,
        sprache: lang,
        zeitpunkt: new Date().toISOString(),
        einwilligung: consentText,
        botcheck: false,
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    return res.ok && data.success === true;
  } catch {
    return false;
  }
}
