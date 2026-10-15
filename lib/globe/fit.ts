// Kugelgröße so berechnen, dass der Kugelrand genau in den unteren Ecken der Hero endet.
// Scheitel bei DISC_TOP der Höhe, Kugelradius = SPHERE des Bildes (1500 von 4000).
const DISC_TOP = 0.3;
const SPHERE = 0.375;

/** Liefert die Bildbreite (--art-w) in px für eine Hero mit Breite w und Höhe h. */
export function globeArtWidth(w: number, h: number): number {
  const a = (1 - DISC_TOP) * h; // Scheitel bis Unterkante
  const radius = (a * a + (w * w) / 4) / (2 * a); // Kreis durch Scheitel und beide unteren Ecken
  return radius / SPHERE;
}

/** Setzt --art-w auf dem Element und hält es bei Größenänderung aktuell. Gibt eine Aufräumfunktion zurück. */
export function fitGlobe(scene: HTMLElement): () => void {
  const apply = () => {
    const w = scene.clientWidth;
    const h = scene.clientHeight;
    if (w && h) scene.style.setProperty("--art-w", `${globeArtWidth(w, h)}px`);
  };
  apply();
  const ro = new ResizeObserver(apply);
  ro.observe(scene);
  return () => ro.disconnect();
}
