"""Erzeugt public/hero/landmask.png (2048x1024, weiss = Land) fuer den Umriss-Globus in Karte 3.

Quelle: farbiges NASA Blue Marble (nicht im Repo). Meer = deutlich blau und eher dunkel; so bleiben
dunkle Waelder (Amazonas, Kongo) Land. Danach kleine Inseln entfernen, Kanten glaetten.
Aufruf: python scripts/render-landmask.py <pfad/zu/blue-marble-farbe.jpg>
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = Image.open(sys.argv[1]).convert("RGB").resize((2048, 1024), Image.LANCZOS)
a = np.asarray(src).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
sea = (b - np.maximum(r, g) > 12) & ((r + g + b) / 3 < 110)
land = ~sea
land = ndimage.binary_opening(ndimage.binary_closing(land, iterations=2), iterations=1)

# kleine Inseln weg (unruhig), grosse behalten
lab2, n = ndimage.label(land)
sizes = ndimage.sum(land, lab2, range(1, n + 1))
keep = np.zeros(n + 1, bool)
keep[1:] = sizes >= 120
land = keep[lab2]
# Antarktis weglassen (unten ohnehin kaum sichtbar, wirkt sonst wie ein Balken)
land[int(1024 * (90 + 62) / 180) :, :] = False

Image.fromarray((land * 255).astype(np.uint8)).save(os.path.join(ROOT, "public", "hero", "landmask.png"), optimize=True)
print("landmask", os.path.getsize(os.path.join(ROOT, "public", "hero", "landmask.png")) // 1024, "KB")
