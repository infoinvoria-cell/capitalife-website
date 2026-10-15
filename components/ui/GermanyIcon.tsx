// Kleiner Deutschland-Umriss (vereinfacht aus Grenzkoordinaten), als Linie in Schriftfarbe.
export function GermanyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 17 22" className={className} aria-hidden fill="none">
      <path
        d="M5.49 1.23 L6.94 1.52 L9.43 2.37 L11.1 3.12 L13.21 2.16 L14.55 3.79 L14.84 5.4 L14.43 6.56 L15.08 7.8 L15.17 9.23 L15.74 11.27 L14.68 11.74 L11.26 13.11 L11.1 13.29 L11.75 14.58 L12.48 15.75 L13.91 17.12 L13.29 17.69 L12.48 18.72 L12.56 19.89 L11.26 20.46 L9.22 20.2 L8.08 21.0 L7.02 20.28 L5.4 19.94 L3.77 20.2 L3.77 18.72 L4.74 16.6 L2.38 16.14 L1.77 15.31 L1.37 13.68 L1.2 12.0 L1.49 10.7 L1.08 9.15 L2.87 8.12 L3.12 5.4 L5.31 4.88 L5.8 3.72 L5.48 2.81 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
