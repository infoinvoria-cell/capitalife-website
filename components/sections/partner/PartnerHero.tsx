import Link from "next/link";
import raw from "./PartnerHero.module.css";

function c(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

const LOGOS = [
  "/Roboforex.png",
  "/Darwinex.png",
  "/Vantage.png",
  "/Tradingview.png",
  "/Myfxbook.png",
];

export function PartnerHero() {
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section className={c("hero")}>
      {/* Navbar */}
      <nav className={c("nav")}>
        <Link href="/">
          <img
            className={c("logoImg")}
            src="/Capitalife-text_logo.png"
            alt="Capitalife"
          />
        </Link>

        <div className={c("navLinks")}>
          <Link href="/" className={c("navLink")}>Home</Link>
          <Link href="/#performance" className={c("navLink")}>Performance</Link>
          <Link href="/#strategy" className={c("navLink")}>Strategy</Link>
          <Link href="/#about" className={c("navLink")}>About us</Link>
          <Link href="/partner-program" className={`${c("navLink")} ${c("navLinkActive")}`}>Partner Program</Link>
        </div>

        <Link href="/" className={c("navBtn")}>
          <img className={c("navBtnIcon")} src="/CAPITALIFE_ICON.png" alt="" width={16} height={18} aria-hidden />
          <span className={c("navBtnText")}>Get Started</span>
        </Link>
      </nav>

      {/* Content */}
      <div className={c("content")}>
        <div className={c("label")}>
          <span className={c("labelShine")} />
          <span className={c("labelDot")} />
          <span className={c("labelText")}>Partner Program</span>
        </div>

        <h1 className={c("headline")}>
          <span className={c("h1")}>Grow With Us as a</span>
          <span className={c("h2")}>Strategic Partner</span>
        </h1>

        <p className={c("sub")}>
          Join the Capitalife Partner Program and earn performance-based
          commissions by introducing qualified investors to our
          institutional-grade strategies.
        </p>

        <div className={c("buttons")}>
          <Link href="#apply" className={c("btnStart")}>
            <span className={c("btnShine")} />
            <img className={c("btnIconStart")} src="/CAPITALIFE_ICON.png" alt="" width={20} height={22} aria-hidden />
            <span className={c("btnText")}>Become a Partner</span>
          </Link>
          <Link href="/" className={c("btnPartner")}>
            <span className={c("btnShine")} />
            <svg className={c("btnIconPartner")} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className={c("btnText")}>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Logo slider */}
      <div className={c("sliderWrap")}>
        <div className={c("sliderTrack")}>
          {doubled.map((src, i) => (
            <img
              key={`${src}-${i}`}
              className={c("sliderLogo")}
              src={src}
              alt=""
            />
          ))}
        </div>
      </div>
    </section>
  );
}
