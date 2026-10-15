// Live-Erde für den Hero. Gleiche Formeln wie scripts/render-globe.py (dunkle Kugel,
// kleine helle Kappe oben, ganz schwach unten links/rechts, kein Rand-Strich).
// Koordinaten: Box 0..1, Kugel mittig, Radius 0.375 (= 1500 von 4000).

// Das Canvas deckt nur den sichtbaren Bildschirm ab; uBox sagt, wo die Bild-Box (x, y unten links, Größe in Pixeln) liegt.
export const VERTEX = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

export const FRAGMENT = `
precision highp float;
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform float uLon;      // Blickmitte Laengengrad (rad), wird beim Scrollen verschoben
uniform float uLat;      // Blickmitte Breitengrad (rad)
uniform float uPx;       // Groesse eines Bildschirmpixels in Box-Einheiten
uniform vec3 uBox;       // Bild-Box im Canvas: x, y (unten links), Kantenlaenge, alles in Geraetepixeln
uniform sampler2D uLight;  // Lichtkegel (light.webp), dreht um die Kugelmitte, 1,5-fache Boxbreite
uniform sampler2D uMark;   // Schriftzug-Maske
uniform float uAngle;      // Drehung des Lichtkegels (rad, im Uhrzeigersinn wie CSS rotate)
uniform vec4 uMarkBox;     // Schriftzug: links, oben (von oben gemessen), Breite, Hoehe in Geraetepixeln
uniform float uH;          // Canvas-Hoehe in Geraetepixeln

const float R = 0.375;
const float PI = 3.14159265;
const vec3 TINT = vec3(0.94, 0.925, 0.885);
const vec3 GOLD = vec3(0.89, 0.79, 0.48);

// Licht an Stelle p (Box-Einheiten, y nach oben): wie das gedrehte Bild light.webp, Bildschirm-Mischung "screen"
vec3 light(vec2 p) {
  vec2 s = vec2(p.x, -p.y) / 1.5;
  float c = cos(uAngle), si = sin(uAngle);
  vec2 uv = vec2(c * s.x + si * s.y, -si * s.x + c * s.y) + 0.5;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec3(0.0);
  return texture2D(uLight, uv).rgb;
}

// Schriftzug hinter der Kugel: nur dort sichtbar, wo Licht hinfaellt
float mark() {
  vec2 uv = (vec2(gl_FragCoord.x, uH - gl_FragCoord.y) - uMarkBox.xy) / uMarkBox.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  return texture2D(uMark, uv).r;
}

void main() {
  vec2 p = (gl_FragCoord.xy - uBox.xy) / uBox.z - 0.5;
  vec3 L = light(p);
  // feines Rauschen gegen Stufen im weichen Lichtverlauf
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  L = clamp(L + n / 255.0, 0.0, 1.0);
  vec3 back = L * mark();
  float d = length(p);
  float cover = clamp((R - d) / uPx + 0.5, 0.0, 1.0);
  if (cover <= 0.0) { gl_FragColor = vec4(1.0 - (1.0 - back) * (1.0 - L), 1.0); return; }

  vec2 n2 = p / R;
  float nz = sqrt(max(0.0, 1.0 - dot(n2, n2)));
  vec2 u = p / max(d, 1e-5);
  float rin = (R - d) / (2.0 * R);          // Abstand zum Rand in Kugeldurchmessern
  float rinPx = (R - d) * 4000.0;           // in Pixeln der 4000er Vorlage
  float ang = degrees(atan(u.x, u.y));      // 0 = oben

  float ul = clamp(u.x * -0.34 + u.y * 0.94, 0.0, 1.0);
  // Helle Zone oben: kompakt am Rand (wie Referenz), Afrika und Ueberschrift bleiben dunkel
  float t = clamp((rin - 0.004) / (0.07 - 0.004), 0.0, 1.0);
  float cap = pow(1.0 - t * t * (3.0 - 2.0 * t), 1.6) * pow(ul, 16.0);
  float low = 0.30 * exp(-pow((abs(ang) - 83.0) / 5.0, 2.0)) * exp(-rin / 0.035);

  vec3 cen = vec3(cos(uLat) * cos(uLon), cos(uLat) * sin(uLon), sin(uLat));
  vec3 east = vec3(-sin(uLon), cos(uLon), 0.0);
  vec3 north = vec3(-sin(uLat) * cos(uLon), -sin(uLat) * sin(uLon), cos(uLat));
  vec3 P = n2.x * east + n2.y * north + nz * cen;
  float lat = asin(clamp(P.z, -1.0, 1.0));
  float lon = atan(P.y, P.x);
  vec2 tc = vec2(lon / (2.0 * PI) + 0.5, 0.5 - lat / PI);

  float albedo = pow(texture2D(uDay, tc).r, 1.7);   // mehr Kontrast im Gelaende
  float lights = pow(clamp((texture2D(uNight, tc).r - 0.12) * 1.6, 0.0, 1.0), 1.6);

  // Lichtpunkt auf Europa: oben, leicht links der Mitte
  vec2 spotPos = vec2(sin(radians(-12.0)), cos(radians(-12.0))) * R * 0.985;
  vec2 sd = p - spotPos;
  float spot = exp(-dot(sd, sd) / (2.0 * pow(0.035 * R, 2.0))) * cover;   // klein, gebuendelt, nur auf der Kugel

  float body = 0.006 + cap * (0.06 + albedo * 1.5) * (0.7 + 0.6 * ul)
             + low * (0.05 + albedo * 0.6)
             + 0.06 * exp(-rinPx / 60.0) * pow(ul, 10.0);
  vec3 spotCol = mix(vec3(1.0), GOLD, 0.35);                // Weiss-Gold
  vec3 col = clamp(body, 0.0, 1.0) * TINT + lights * (cap + low) * 0.25 * GOLD
           + spot * (0.12 + albedo * 2.0) * spotCol;
  vec3 base = col * cover + back * (1.0 - cover);   // Erde vor dem Schriftzug
  gl_FragColor = vec4(1.0 - (1.0 - base) * (1.0 - L), 1.0);   // Licht darüber ("screen")
}`;
