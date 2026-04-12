import Image from "next/image";
import Link from "next/link";

import { Desktop_4Decor } from "./Desktop_4Decor";
import { styles } from "./Desktop_4.styles";

function EllipseLarge() {
  return (
    <div className={styles.ellipseLarge} aria-hidden>
      <svg
        width="800"
        height="303"
        viewBox="0 0 800 303"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Decor</title>
        <g filter="url(#d4_f53)">
          <path
            d="M800 228.088C800 310.99 655.637 302.775 428.571 302.775C201.506 302.775 0 310.99 0 228.088C0 145.187 180.683 0 407.748 0C634.813 0 800 145.187 800 228.088Z"
            fill="url(#d4_p53)"
          />
        </g>
        <defs>
          <filter
            id="d4_f53"
            x="-250"
            y="-250"
            width="1300"
            height="803"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="125" result="effect1_foregroundBlur_8_53" />
          </filter>
          <linearGradient
            id="d4_p53"
            x1="400"
            y1="0"
            x2="400"
            y2="303"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E2CA7B" stopOpacity="0.43" />
            <stop offset="1" stopColor="#2F2F2F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function EllipseSmall() {
  return (
    <div className={styles.ellipseSmall} aria-hidden>
      <svg
        width="284"
        height="76"
        viewBox="0 0 284 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Decor</title>
        <g filter="url(#d4_f54)">
          <path
            d="M284 57.2103C284 78.004 232.751 75.9436 152.143 75.9436C71.5347 75.9436 0 78.004 0 57.2103C0 36.4165 64.1424 0 144.751 0C225.359 0 284 36.4165 284 57.2103Z"
            fill="#E0D2A3"
          />
        </g>
        <defs>
          <filter
            id="d4_f54"
            x="-100"
            y="-100"
            width="484"
            height="276"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_8_54" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function LineDecor1() {
  return (
    <div className={styles.line1} aria-hidden>
      <svg width="71" height="79" viewBox="0 0 71 79" fill="none">
        <path
          d="M0 0L70.9972 78.8504"
          stroke="url(#d4_ln1)"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="d4_ln1"
            x1="4.14767"
            y1="3.74166"
            x2="70.1233"
            y2="79.6218"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="#E2CA7B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function LineDecor2() {
  return (
    <div className={styles.line2} aria-hidden>
      <svg width="71" height="79" viewBox="0 0 71 79" fill="none">
        <path
          d="M0 0L70.7192 78.5416"
          stroke="url(#d4_ln2)"
          strokeWidth="0.56"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="d4_ln2"
            x1="4.13311"
            y1="3.72549"
            x2="69.8556"
            y2="79.3041"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="#E2CA7B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function ChartIconNav() {
  return (
    <svg width="17" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20V12M10 20V8M16 20V15M20 20V4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIconPrimary() {
  return (
    <svg width="22" height="25" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20V12M10 20V8M16 20V15M20 20V4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      className={styles.starIcon}
      width="31"
      height="31"
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M15.5 3.2l3.6 8.1h8.7l-7 5.2 2.7 8.5-7.9-5.8-8 5.8 2.8-8.5-7-5.2h8.8L15.5 3.2z"
        stroke="#000"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

export default function Desktop_4() {
  return (
    <div className={styles.root} id="home">
      <div className={styles.heroPhoto} aria-hidden>
        <Image
          src="/desktop-4-hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroPhotoImg}
        />
        <div className={styles.heroPhotoScrim} />
      </div>
      <LineDecor1 />
      <LineDecor2 />
      <EllipseLarge />
      <EllipseSmall />
      <Desktop_4Decor />

      <div className={styles.inner}>
        <header className="pt-6">
          <nav className={styles.navBar} aria-label="Main">
            <Link href="/" className={styles.logo} aria-label="Capitalife home">
              <span className="sr-only">Capitalife home</span>
            </Link>
            <div className={styles.navLinks}>
              <Link href="#home" className={styles.navLink}>
                Home
              </Link>
              <Link href="#performance" className={styles.navLink}>
                Performance
              </Link>
              <Link href="#about" className={styles.navLink}>
                About us
              </Link>
              <Link href="#partner" className={styles.navLink}>
                Partner Program
              </Link>
            </div>
            <Link href="#home" className={styles.navCta}>
              <span className={styles.navCtaIcon}>
                <ChartIconNav />
              </span>
              <span className={styles.navCtaLabel}>Get Started</span>
            </Link>
          </nav>
        </header>

        <div className={styles.heroColumn}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>Institutional-Grade Investing</span>
          </div>

          <div className={styles.contentStack}>
            <div className={styles.textBlock}>
              <span className={styles.headline1}>Our Market Experience</span>
              <span className={styles.headline2}>Meets Your Returns</span>
              <p className={styles.subtext}>
                Data-driven investment strategies built on over 20 years of
                market experience, validated by +2 years real-world performance.
              </p>
            </div>

            <div className={styles.ctaRow}>
              <Link href="#home" className={styles.btnPrimary}>
                <span className={styles.btnPrimaryIcon}>
                  <ChartIconPrimary />
                </span>
                <span className={styles.btnPrimaryLabel}>Get Started</span>
              </Link>
              <Link href="#partner" className={styles.btnSecondary}>
                <StarIcon />
                <span className={styles.btnSecondaryLabel}>Partner Program</span>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.partnerStrip}>
          <Image
            src="/Group%202085662766.png"
            alt="Darwinex, Vantage, TradingView, Myfxbook"
            width={812}
            height={56}
            sizes="(max-width: 900px) 100vw, 812px"
            className={styles.trustStripImage}
          />
        </div>
      </div>
    </div>
  );
}
