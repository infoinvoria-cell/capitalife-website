# Capitalife Website

Lies diese Datei zuerst. Sie ist das Gedaechtnis des Projekts. Wer etwas aendert, traegt es unten unter "Stand" nach.

## Stack
Next.js 15, React 19, Tailwind 4, Three.js, framer-motion, TypeScript strict. Repo: github.com/infoinvoria-cell/capitalife-website, Branch main. Vercel-Projekt: capitalife-website (Scope infoinvoria-cells-projects). Ziel-Domain: capitalife.co, Mail info@capitalife.co.

## Arbeitsregeln
- Deutsch, kurz, einfache Saetze. Anweisungen des Nutzers werden woertlich umgesetzt, Einwand in einem Satz daneben.
- Nur ein Agent, keine Subagenten ohne Freigabe.
- Gruen ohne Rueckfrage: lesen, lokal aendern, Feature-Branch, committen, Preview, build/lint/typecheck.
- Nur mit "Go": Merge nach main, Production-Deploy, Domain/DNS, Env-Variablen, neue Dependencies, Dateien loeschen, Texte mit Zahlen/Rendite/Recht.
- Nie: Secrets ins Repo, Force-Push auf main, Checks umgehen, Renditeversprechen, Zugriff auf die Sperrzone.

## Marke (aus dem Code ausgelesen)
- Dunkel + Gold. Hintergrund #000000 / #0a0a0a. Gold 400 #d5af36, 350 #d9b84c, 300 #e2ca7a, 200 #ecdba6. Grau #a0a0a0 (in app/globals.css, @theme).
- Schrift: Montserrat (Hauptschrift), Inter (Fliesstext/Zahlen), Cinzel (nur Logo).
- Logos: public/CAPITALIFE_ICON.png, public/Capitalife-text_logo.png.
- Stil: clean, minimalistisch. VERBOTEN: Augenbrauen-Texte (kleine Zeile ueber der Ueberschrift), unnoetige Subtexte, KI-Floskeln.

## Struktur
app/ (Routen / und /partner-program), components/, content/ (Texte, i18n-Vorbereitung, nur en), lib/, styles/tokens.css (derzeit leer), public/.
Ziel: Dateien unter 200 Zeilen, Texte in content/, Logik in lib/, keine Inline-Styles, mobile-first.
Hinweis: .cursor/rules verlangt "nur Tailwind"; der Code nutzt CSS Modules. Entscheidung offen.

## Sperrzone
Nichts anfassen, lesen oder erwaehnen: Hannah's Photoart (alles) und Fotografie-Geschaeft. Vercel-Projekte ausser "capitalife-website" nicht anfassen.
Referenz, nur lesen: Capitalife Terminal (C:\Users\joris\Documents\Capitalife Terminal). Mit der Website werden nur Branding geteilt, nie Code, Env-Variablen oder Daten.

## Recht / Finanz
- Keine Performance-Zahlen ohne Freigabe. Live-Track-Record (White Swan, seit April 2024) und Backtest immer getrennt und beschriftet.
- Kein Renditeversprechen, keine CFD-Werbung.
- Pflicht vor Go-Live: Impressum, Datenschutz, Risikohinweis. Heute nicht vorhanden.
- Rechtsrisiken im Blick: Partnerprogramm, Broker-Logos, Haftungsdach. Keine Rechtsberatung.
- public/trades_clean_compounded.csv wird oeffentlich ausgeliefert: pruefen, ob sie dort bleiben darf.

## Aktueller Modus (15.10.2026)
Die Seite ist vorerst nur WARTELISTE / EARLY ACCESS / Coming soon. Keine echten Zahlen, keine Rendite-, Performance- oder Beratungs-Aussagen, auch keine Kennzahlen mit Live-Track-Record. Texte nur als Status ("Early access", "Waitlist", "Coming soon"). Die Navigation hat deshalb keinen Punkt "Performance". Wartelisten-Formular braucht vorher Impressum und Datenschutz (E-Mail-Adressen = personenbezogene Daten).

## Stand (15.10.2026)
- Letzter Deploy auf Vercel: ca. 158 Tage alt. capitalife.co zeigt NICHT auf Vercel (IP 216.162.200.200, Platzhalter-Zertifikat). Whois: Registrar Key-Systems GmbH (Wiederverkaeufer unbekannt, evtl. IONOS), Nameserver Google Cloud DNS, laeuft bis 17.07.2027.
- Arbeit laeuft auf Branch rebuild/landing-local, nur lokal, nichts committet. Startseite / = Warteliste: Hero (components/sections/home/Hero/, grosses H), About, Waitlist, Footer. Dev-Server: .claude/launch.json, Port 3010, Polling an.
- Einblenden beim Scrollen: data-reveal + components/ui/ScrollReveal.tsx, Stil in app/globals.css. Buttons: components/ui/Button.module.css.
- Geprueft (Playwright, echte Animationen): 1920, MBP 16/14, MBA 13, 1280x800, iPad quer/hoch, iPad Pro, iPhone Max/normal/SE, Android, Handy quer. Prod-Build gruen.
- Hero-Erde: Erde, Lichtkegel und Schriftzug zeichnet EIN WebGL-Canvas in Bildschirmgroesse (lib/globe/shader.ts, renderer.ts). Bilder in HeroGlobe.tsx sind nur Ersatz ohne WebGL. Qualitaet passt sich automatisch an langsame Geraete an.
- Ungeprueft: metadataBase, Open Graph, Impressum/Datenschutz.
