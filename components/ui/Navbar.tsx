import Link from "next/link";

const navLinks = [
  { label: "Start", href: "#start" },
  { label: "Performance", href: "#performance" },
  { label: "Über uns", href: "#ueber-uns" },
  { label: "Partnerprogramm", href: "#partnerprogramm" },
] as const;

function LogoMark() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] sm:h-9 sm:w-9">
      <span className="flex items-end gap-[3px] pb-0.5">
        <span className="h-2 w-0.5 rounded-full bg-gradient-to-t from-brand-gold-400 to-brand-gold-200" />
        <span className="h-3 w-0.5 rounded-full bg-gradient-to-t from-brand-gold-400 to-brand-gold-200" />
        <span className="h-4 w-0.5 rounded-full bg-gradient-to-t from-brand-gold-400 to-brand-gold-200" />
        <span className="h-[18px] w-0.5 rounded-full bg-gradient-to-t from-brand-gold-400 to-brand-gold-200" />
      </span>
    </span>
  );
}

function CenterWordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5">
      <LogoMark />
      <span className="font-logo text-[0.9rem] font-medium uppercase tracking-[0.28em] text-transparent sm:text-[1.05rem] sm:tracking-[0.34em] bg-gradient-to-r from-brand-gold-300 via-brand-gold-200 to-brand-gold-300 bg-clip-text">
        Capitalife
      </span>
    </Link>
  );
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavCta() {
  return (
    <Link
      href="#start"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-black shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_6px_32px_-4px_rgba(255,255,255,0.5),0_16px_48px_-12px_rgba(255,255,255,0.18)] transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:px-5 sm:py-2.5 sm:text-[0.8125rem] sm:normal-case sm:tracking-wide"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] sm:h-7 sm:w-7">
        <IconChevronRight className="text-black" />
      </span>
      Jetzt starten
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/55 backdrop-blur-2xl">
      <nav
        aria-label="Hauptnavigation"
        className="mx-auto max-w-[1320px] px-[var(--container-padding-inline)]"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center py-3.5 md:hidden">
          <span aria-hidden className="block" />
          <div className="justify-self-center">
            <CenterWordmark />
          </div>
          <div className="justify-self-end">
            <NavCta />
          </div>
        </div>

        <div className="relative hidden h-[4.75rem] items-center md:flex">
          <ul className="relative z-10 flex min-w-0 flex-1 items-center gap-9 text-[0.8125rem] font-medium tracking-wide text-[#a0a0a0] lg:gap-10">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="pointer-events-auto">
              <CenterWordmark />
            </span>
          </div>

          <div className="relative z-10 flex flex-1 justify-end">
            <NavCta />
          </div>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 border-t border-white/[0.05] py-2.5 text-[0.75rem] font-medium text-[#909090] md:hidden">
          {navLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
