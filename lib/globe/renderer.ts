import { FRAGMENT, VERTEX } from "./shader";

/** Rechteck relativ zum Canvas, in CSS-Pixeln. */
export type Rect = { x: number; y: number; w: number; h: number };

export type GlobeImages = {
  day: HTMLImageElement;
  night: HTMLImageElement;
  light: HTMLImageElement;
  mark: HTMLImageElement;
};

export type GlobeRenderer = {
  /** lonDeg: Drehung der Erde, angleRad: Drehung des Lichts, box: Bild-Box der Kugel, mark: Schriftzug */
  /** quality: 1 = volle Schärfe; kleiner auf Geräten, die nicht hinterherkommen */
  draw: (
    lonDeg: number,
    angleRad: number,
    box: Rect,
    mark: Rect,
    quality?: number,
  ) => void;
  dispose: () => void;
};

const LAT0 = -24; // Blickmitte 24 S: Europa liegt flach oben am Rand

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
}

// Alle Texturen sind Zweierpotenzen (Erde 4096x2048 / 2048x1024, Licht 2048², Schriftzug 2048x256): Mipmaps möglich
function texture(
  gl: WebGLRenderingContext,
  img: HTMLImageElement,
  unit: number,
  format: number,
  repeat: boolean,
) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_S,
    repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

/** Zeichnet Erde, Lichtkegel und Schriftzug in ein Canvas von Bildschirmgrösse.
 *  Gibt null zurück, wenn WebGL fehlt (dann bleiben Standbild und CSS-Licht). */
export function createGlobeRenderer(
  canvas: HTMLCanvasElement,
  img: GlobeImages,
): GlobeRenderer | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const aniso = gl.getExtension("EXT_texture_filter_anisotropic");
  texture(gl, img.day, 0, gl.LUMINANCE, true);
  if (aniso)
    gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
  texture(gl, img.night, 1, gl.LUMINANCE, true);
  texture(gl, img.light, 2, gl.RGB, false);
  texture(gl, img.mark, 3, gl.LUMINANCE, false);
  const u = (name: string) => gl.getUniformLocation(prog, name);
  gl.uniform1i(u("uDay"), 0);
  gl.uniform1i(u("uNight"), 1);
  gl.uniform1i(u("uLight"), 2);
  gl.uniform1i(u("uMark"), 3);
  gl.uniform1f(u("uLat"), (LAT0 * Math.PI) / 180);
  const uLon = u("uLon");
  const uPx = u("uPx");
  const uBox = u("uBox");
  const uAngle = u("uAngle");
  const uMarkBox = u("uMarkBox");
  const uH = u("uH");

  return {
    draw(lonDeg, angleRad, box, mark, quality = 1) {
      // Volle Schärfe auf Retina, aber nur so gross wie der sichtbare Ausschnitt (nicht die ganze Kugel)
      const dpr = Math.max(
        1,
        Math.min(window.devicePixelRatio || 1, 2) * quality,
      );
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      const size = box.w * dpr;
      gl.uniform3f(uBox, box.x * dpr, h - (box.y * dpr + size), size);
      gl.uniform4f(
        uMarkBox,
        mark.x * dpr,
        mark.y * dpr,
        mark.w * dpr,
        mark.h * dpr,
      );
      gl.uniform1f(uH, h);
      gl.uniform1f(uLon, (lonDeg * Math.PI) / 180);
      gl.uniform1f(uAngle, angleRad);
      gl.uniform1f(uPx, 1 / size);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
