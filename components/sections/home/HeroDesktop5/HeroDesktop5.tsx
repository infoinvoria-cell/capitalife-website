import Image from "next/image";
import Link from "next/link";

import { heroDesktop5Data } from "./HeroDesktop5.data";
import { styles } from "./HeroDesktop5.styles";

/** Pfade mit Leerzeichen URL-kodiert (Next/Image + Windows). */
const ASSETS = {
  background: "/Desktop%20-%205.png",
  logo: "/Capitalife-text_logo.png",
  navCta: "/Buttons%20Start.png",
  label: "/Label.png",
  ctaStart: "/Buttons%20Start.png",
  ctaPartner: "/Button%20Partner.png",
  trustStrip: "/Group%202085662766.png",
} as const;

export function HeroDesktop5() {
  const d = heroDesktop5Data;

  return (
    <section
      id="home"
      className={styles.root}
      aria-labelledby="hero-desktop5-heading"
    >
      <div className={styles.bg} aria-hidden>
        <Image
          src={ASSETS.background}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bgImg}
        />
      </div>

      <div className={styles.inner}>
        <header>
          <nav className={styles.nav} aria-label="Main">
            <Link href="/" className={styles.navLogoLink} aria-label="Capitalife home">
              <span className="sr-only">Capitalife home</span>
              <Image
                src={ASSETS.logo}
                alt=""
                width={2531}
                height={396}
                className={styles.navLogo}
                priority
                aria-hidden
              />
            </Link>

            <ul className={styles.navLinks}>
              {d.navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link href={d.getStartedHref} className={styles.navCta}>
              <Image
                src={ASSETS.navCta}
                alt={d.getStartedLabel}
                width={188}
                height={83}
                className={styles.navCtaImg}
                priority
              />
            </Link>
          </nav>
        </header>

        <div className={styles.heroMain}>
          <div className={styles.labelWrap}>
            <Image
              src={ASSETS.label}
              alt={d.labelAlt}
              width={262}
              height={39}
              className={styles.labelImg}
            />
          </div>

          <h1 id="hero-desktop5-heading" className={styles.headline}>
            <span className={styles.headlineLine1}>{d.headlineLine1}</span>
            <span className={styles.headlineLine2}>{d.headlineLine2}</span>
          </h1>

          <p className={styles.subtext}>{d.subtext}</p>

          <div className={styles.ctaRow}>
            <Link
              href={d.getStartedHref}
              className={styles.ctaLink}
              aria-label={d.getStartedLabel}
            >
              <Image
                src={ASSETS.ctaStart}
                alt={d.getStartedLabel}
                width={188}
                height={83}
                className={styles.ctaImg}
              />
            </Link>
            <Link
              href={d.partnerHref}
              className={styles.ctaLink}
              aria-label={d.partnerLabel}
            >
              <Image
                src={ASSETS.ctaPartner}
                alt={d.partnerLabel}
                width={228}
                height={83}
                className={`${styles.ctaImg} ${styles.ctaImgPartner}`}
              />
            </Link>
          </div>
        </div>

        <div className={styles.trust}>
          <Image
            src={ASSETS.trustStrip}
            alt={d.trustAlt}
            width={812}
            height={56}
            className={styles.trustImg}
          />
        </div>
      </div>
    </section>
  );
}
