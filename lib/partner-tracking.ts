// Meldet eine Warteliste-Anmeldung zusätzlich an das Partner-Tracking (über den eigenen Website-Worker, /api/partner-tracking).
// Nur aufrufen, wenn der Kontakt über einen Empfehlungslink kam und das zweite Häkchen gesetzt hat.
// Fehler werden geschluckt: die Anmeldung zur Warteliste ist davon nie abhängig.
export async function meldePartner(email: string, ref: string, einwilligung: string): Promise<void> {
  try {
    await fetch("/api/partner-tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ref, einwilligung }),
    });
  } catch {
    // Netzwerkfehler: die Anmeldung ist trotzdem angekommen.
  }
}
