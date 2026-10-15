import Image from "next/image";

import { HeroGlobeCanvas } from "./HeroGlobeCanvas";
import styles from "./HeroGlobe.module.css";

// Live-Erde (WebGL, HeroGlobeCanvas) zeichnet Erde, kreisendes Licht und Schriftzug in einem Bild.
// Die Bilder hier sind nur Ersatz ohne WebGL und Lage-Vorlage: Standbild = Lage der Kugel,
// markBox = Lage des Schriftzugs. Sobald die Live-Erde läuft, blendet CSS die Ersatz-Ebenen aus.
// Bilder und Texturen erzeugt scripts/render-globe.py.
export function HeroGlobe() {
  return (
    <div className={styles["scene"]} aria-hidden>
      {/* Schriftzug hinter der Kugel: nur sichtbar, wo der Lichtkegel hinscheint (sonst schwarz) */}
      <div className={styles["wordmarkLit"]}>
        <Image
          src="/hero/light.webp"
          alt=""
          width={4000}
          height={4000}
          unoptimized
          className={styles["beam"]}
        />
      </div>
      <Image
        src="/hero/earth.webp"
        alt=""
        width={4000}
        height={4000}
        priority
        unoptimized
        className={`${styles["art"]} ${styles["still"]}`}
      />
      <div className={styles["markBox"]} />
      <HeroGlobeCanvas
        className={styles["live"]}
        boxSelector={`.${styles["still"]}`}
        markSelector={`.${styles["markBox"]}`}
      />
      <Image
        src="/hero/light.webp"
        alt=""
        width={4000}
        height={4000}
        priority
        unoptimized
        className={styles["beam"]}
      />
      <div className={styles["fade"]} />
    </div>
  );
}
