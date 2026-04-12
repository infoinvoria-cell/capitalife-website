import { styles } from "./Desktop_4.styles";

/**
 * Bottom “horizon” decor — simplified from Figma Group_2085662765 for bundle size;
 * preserves gold (#E2CA7B) arc / glow at bottom center.
 */
export function Desktop_4Decor() {
  return (
    <div className={styles.decorWrap} aria-hidden>
      <svg
        viewBox="0 0 1200 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <radialGradient
            id="d4_horizon"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(600 520) rotate(90) scale(560 220)"
          >
            <stop stopColor="#E2CA7B" stopOpacity="0.42" />
            <stop offset="0.45" stopColor="#E2CA7B" stopOpacity="0.12" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter
            id="d4_blurA"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter
            id="d4_blurB"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <linearGradient
            id="d4_ring"
            x1="600"
            y1="360"
            x2="600"
            y2="520"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E2CA7B" />
            <stop offset="1" stopColor="#E2CA7B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="600"
          cy="510"
          rx="520"
          ry="200"
          fill="url(#d4_horizon)"
          filter="url(#d4_blurA)"
        />
        <ellipse
          cx="600"
          cy="498"
          rx="380"
          ry="120"
          stroke="url(#d4_ring)"
          strokeWidth="2"
          fill="none"
          opacity="0.35"
          filter="url(#d4_blurB)"
        />
      </svg>
    </div>
  );
}
