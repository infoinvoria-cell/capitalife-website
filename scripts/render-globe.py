"""Rendert public/hero/earth.webp (4000x4000) und public/hero/light.webp.

Aufruf:
  python scripts/render-globe.py --day <blue-marble.jpg> --night <black-marble.jpg>
  python scripts/render-globe.py --light            (nur die Lichtebene)

Quellen (NASA, gemeinfrei, nicht im Repo):
  day:   eoimages.gsfc.nasa.gov  world.topo.bathy.200412.3x5400x2700.jpg
  night: eoimages.gsfc.nasa.gov  dnb_land_ocean_ice.2012.3600x1800.jpg
Look: graues Weiss, minimal warm, Licht von oben links, Stadtlichter schwach goldig.
"""
import argparse, os
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("--day"); ap.add_argument("--night"); ap.add_argument("--light", action="store_true")
args = ap.parse_args()

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "hero")
os.makedirs(OUT, exist_ok=True)
S = 4000; R = 1500.0; C = S / 2   # 500 px Rand fuer den Lichtsaum, nichts wird abgeschnitten
TINT = np.array([0.94, 0.925, 0.885], np.float32)
GOLD = np.array([0.89, 0.79, 0.48], np.float32)


def bilinear(tex, lat, lon):
    th, tw = tex.shape[:2]
    r = np.clip((90 - lat) / 180 * (th - 1), 0, th - 1.001)
    c = np.mod((lon + 180) / 360 * (tw - 1), tw - 1.001)
    r0 = r.astype(np.int32); c0 = c.astype(np.int32); fr = r - r0; fc = c - c0
    return (tex[r0, c0] * (1 - fr) * (1 - fc) + tex[r0, c0 + 1] * (1 - fr) * fc
            + tex[r0 + 1, c0] * fr * (1 - fc) + tex[r0 + 1, c0 + 1] * fr * fc)


def render_earth(day_path, night_path):
    day = np.asarray(Image.open(day_path).convert("L"), np.float32) / 255
    night = np.asarray(Image.open(night_path).convert("L"), np.float32) / 255
    # Blick: Scheibenmitte bei 24 S / 38 E (Start knapp westlich von Saudi-Arabien), Norden oben: Europa liegt flach oben am Rand
    lat0, lon0 = np.radians(-24.0), np.radians(38.0)
    cen = np.array([np.cos(lat0) * np.cos(lon0), np.cos(lat0) * np.sin(lon0), np.sin(lat0)], np.float32)
    east = np.array([-np.sin(lon0), np.cos(lon0), 0], np.float32)
    north = np.array([-np.sin(lat0) * np.cos(lon0), -np.sin(lat0) * np.sin(lon0), np.cos(lat0)], np.float32)
    L2 = np.array([-0.86, 0.51], np.float32); L2 /= np.linalg.norm(L2)

    out = np.zeros((S, S, 4), np.uint8)   # RGBA: aussen durchsichtig, kein Kasten sichtbar
    rng = np.random.default_rng(3)
    for y0 in range(0, S, 400):
        y, x = np.mgrid[y0:y0 + 400, 0:S].astype(np.float32)
        dx, dy = x - C, y - C
        d = np.sqrt(dx * dx + dy * dy)
        ux, uy = dx / np.maximum(d, 1), -dy / np.maximum(d, 1)
        ldir = np.clip(ux * L2[0] + uy * L2[1], 0, 1)
        nx, ny = dx / R, -dy / R
        nz = np.sqrt(np.clip(1 - nx * nx - ny * ny, 0, 1))
        inside = d < R
        r_in = np.clip(R - d, 0, None); r_out = np.clip(d - R, 0, None)

        P = nx[..., None] * east + ny[..., None] * north + nz[..., None] * cen
        lat = np.degrees(np.arcsin(np.clip(P[..., 2], -1, 1)))
        lon = np.degrees(np.arctan2(P[..., 1], P[..., 0]))
        albedo = bilinear(day, lat, lon) ** 1.7
        lights = np.clip((bilinear(night, lat, lon) - 0.12) * 1.6, 0, 1) ** 1.6

        top = np.clip(uy, 0, 1)                                   # 1 oben, 0 an den Seiten
        # Fester Lichtschein nur auf der Kugel: von oben, leicht links
        ang = np.degrees(np.arctan2(ux, uy))                      # 0 = oben, negativ = links
        ul = np.clip(ux * -0.34 + uy * 0.94, 0, 1)
        # Sichtbarer Inhalt: kleine Kappe oben (Ueberschrift bleibt im Dunkeln) ...
        t = np.clip((r_in / (2 * R) - 0.004) / (0.07 - 0.004), 0, 1)
        cap = (1 - t * t * (3 - 2 * t)) ** 1.6 * ul ** 16       # kompakt am Rand, Afrika und Ueberschrift dunkel
        # ... und ganz schwach unten links und unten rechts am Rand (sichtbarer Bildausschnitt endet bei ca. 80 Grad)
        low = 0.30 * np.exp(-((np.abs(ang) - 83) / 5) ** 2) * np.exp(-r_in / (0.035 * 2 * R))   # Mitte der Seiten bleibt schwarz
        vis = cap + low
        # Keine Randlinie: die Kante entsteht nur aus dem scharfen Uebergang Kugel/Hintergrund (cover)
        # Lichtpunkt auf Europa: oben, leicht links der Mitte
        sx, sy = np.sin(np.radians(-12)) * R * 0.985, np.cos(np.radians(-12)) * R * 0.985
        spot = np.exp(-(((dx - sx) ** 2 + (-dy - sy) ** 2) / (2 * (0.035 * R) ** 2)))   # klein, gebuendelt
        body = (0.006 + cap * (0.06 + albedo * 1.5) * (0.7 + 0.6 * ul)     # Kappe oben, kraeftiges Licht

                + low * (0.05 + albedo * 0.6)                                 # unten links/rechts, ganz schwach
                + 0.06 * np.exp(-r_in / 60) * ul ** 10)
        halo = np.zeros_like(body)
        cover = np.clip(R - d + 0.5, 0, 1)[..., None]            # Kugel deckt, Kante geglaettet
        spot_col = 0.65 + 0.35 * GOLD                                # Weiss-Gold
        rgb = (np.clip(body, 0, 1)[..., None] * TINT + (lights * vis * 0.25)[..., None] * GOLD
               + (spot * (0.12 + albedo * 2.0))[..., None] * spot_col)
        rgb += (rng.random(rgb.shape[:2] + (1,), dtype=np.float32) - 0.5) * (2.2 / 255)
        # Straight alpha: Ergebnis auf Schwarz = cover*rgb + (1-cover)*halo*TINT
        alpha = cover + (1 - cover) * halo[..., None]
        col = (cover * rgb + (1 - cover) * halo[..., None] * TINT) / np.maximum(alpha, 1e-4)
        out[y0:y0 + 400, :, :3] = (np.clip(col, 0, 1) * 255 + 0.5).astype(np.uint8)
        out[y0:y0 + 400, :, 3] = (np.clip(alpha[..., 0], 0, 1) * 255 + 0.5).astype(np.uint8)
        print(y0, end=" ", flush=True)
    Image.fromarray(out, "RGBA").save(os.path.join(OUT, "earth.webp"), quality=90, alpha_quality=100, method=6)
    print("\nearth", os.path.getsize(os.path.join(OUT, "earth.webp")) // 1024, "KB")


def render_light():
    """Eine Lichtflaeche, die um die Kugel kreist (Referenz: Ethena).
    Zeigt nach oben (0 Grad); CSS dreht sie. Gleicher Mittelpunkt wie die Kugel, 1,5-fache Kunstbreite."""
    B = 4000; Rb = R / S / 1.5 * B; cb = B / 2                 # 4000 px: scharf genug, fluessig in der Animation
    out = np.zeros((B, B, 3), np.uint8)
    drng = np.random.default_rng(21)
    col = np.array([1.0, 0.94, 0.80], np.float32) * 0.82   # minimal dunkler, minimal goldig
    for y0 in range(0, B, 500):
        y, x = np.mgrid[y0:y0 + 500, 0:B].astype(np.float32)
        dx, dy = x - cb, y - cb
        d = np.sqrt(dx * dx + dy * dy)
        ang = np.degrees(np.arctan2(dx, -dy))
        lobe = lambda s: np.exp(-(ang / s) ** 2)
        rr = (d - Rb) / Rb                                        # Abstand zum Kugelrand in Kugelradien
        out_ = rr > 0
        # Lichtkegel wie Referenz (Zeichnung Jeroen): oeffnet den Horizont, reicht weit bis in die Ecken,
        # seitlich klar begrenzt (Kegelform), nah am Rand am hellsten
        # Tangentialer Kegel: ein Punkt ausserhalb bekommt Licht, wenn seine Tangente die Kugel im
        # beleuchteten Bogen beruehrt. So laufen die Grenzen flach vom Horizont weg (Zeichnung Jeroen).
        tang = np.degrees(np.arccos(np.clip(Rb / np.maximum(d, 1), 0, 1)))
        # Beidseitig gleich: beide Grenzen biegen mit der Entfernung zur Mitte hin (Zeichnung Jeroen),
        # so sieht das Licht beim Kommen genauso aus wie beim Gehen. Klare Flanken.
        cone = np.exp(-((np.abs(ang) + 0.7 * tang) / 75.0) ** 8)
        core = np.exp(-(rr / 0.002) ** 2) * lobe(45)              # helle Kante
        atmo = np.where(out_, 0.85 * np.exp(-rr / 0.015), 0) * lobe(50)   # Lichtsaum direkt am Rand
        scatter = np.where(out_, 0.38 * np.exp(-rr / 0.09), 0) * cone      # kraeftiger Kegel nah am Horizont
        sky = np.where(out_, 0.24 * np.exp(-rr / 0.9), 0) * cone           # Kegel bleibt bis zum Bildrand hell
        inner = np.where(out_, 0, 0.35 * np.exp(rr / 0.03)) * lobe(45)    # hellt die Oberflaeche am Rand auf
        v = core + atmo + scatter + sky + inner
        edge = np.minimum(np.minimum(x, B - 1 - x), np.minimum(y, B - 1 - y))
        v = np.clip(v * np.clip(edge / 400, 0, 1), 0, 1)
        # Dithering gegen Banding: feines Dreiecks-Rauschen (±2 Stufen) löst die Ringe im Verlauf auf
        noise = (drng.random(v.shape, dtype=np.float32) + drng.random(v.shape, dtype=np.float32) - 1.0) * 2.0
        rgb = v[..., None] * col * 255 + noise[..., None] * (v[..., None] > 0.002)
        out[y0:y0 + 500] = np.clip(rgb + 0.5, 0, 255).astype(np.uint8)
    Image.fromarray(out).save(os.path.join(OUT, "light.webp"), quality=96, method=6, use_sharp_yuv=True)
    print("light", os.path.getsize(os.path.join(OUT, "light.webp")) // 1024, "KB")


if args.light:
    render_light()
else:
    render_earth(args.day, args.night)
    render_light()
