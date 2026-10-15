// Kartenvorlage für den Umriss-Globus (Karte 3): aus der Land-Maske (scripts/render-landmask.py) einmal
// Land/Meer und weiche Küstenlinien ableiten. Ergebnis je Kartenpunkt (1024 × 512): Küste 0…255, Land 0/1.
export const MW = 1024;
export const MH = 512;

export type GlobeMap = { coast: Uint8Array; land: Uint8Array };

let map: GlobeMap | null = null;
let loading = false;

export function globeMap(): GlobeMap | null {
  if (map || loading || typeof Image === "undefined") return map;
  loading = true;
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = MW;
    c.height = MH;
    const x = c.getContext("2d");
    if (!x) return;
    x.drawImage(img, 0, 0, MW, MH);
    const d = x.getImageData(0, 0, MW, MH).data;
    const land = new Uint8Array(MW * MH);
    for (let i = 0; i < MW * MH; i++) land[i] = (d[i * 4] ?? 0) > 127 ? 1 : 0;
    // Küste: Land grenzt an Meer (waagrecht wiederholend, senkrecht begrenzt)
    const edge = new Float32Array(MW * MH);
    for (let v = 1; v < MH - 1; v++) {
      for (let u = 0; u < MW; u++) {
        const i = v * MW + u;
        const r = v * MW + ((u + 1) % MW);
        if (land[i] !== land[r] || land[i] !== land[i + MW]) edge[i] = 1;
      }
    }
    // weich und etwas breiter machen (5 × 5), damit die Linie auf der kleinen Kugel durchgehend bleibt
    const coast = new Uint8Array(MW * MH);
    for (let v = 2; v < MH - 2; v++) {
      for (let u = 0; u < MW; u++) {
        let s = 0;
        for (let dv = -2; dv <= 2; dv++)
          for (let du = -2; du <= 2; du++)
            s += edge[(v + dv) * MW + ((u + du + MW) % MW)] ?? 0;
        coast[v * MW + u] = Math.min(255, Math.round((s / 5) * 255));
      }
    }
    map = { coast, land };
  };
  img.src = "/hero/landmask.png";
  return null;
}
