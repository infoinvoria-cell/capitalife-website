// Zeichenfunktion für Canvas-Visuals: Koordinaten in CSS-Pixeln, t in Sekunden.
export type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

// Wischen mit Maus oder Finger. axis = Richtung, in der gewischt wird (die andere bleibt fürs Scrollen frei).
export type DragHandlers = {
  axis: "x" | "y";
  start: () => void;
  move: (dx: number, dy: number, dtMs: number) => void;
  end: () => void;
};
