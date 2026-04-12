import Image from "next/image";

import {
  trustSliderLabel,
  trustSliderLogos,
} from "./TrustSlider.data";

function LogoRow() {
  return (
    <div className="flex items-center gap-12 pr-12 sm:gap-16 sm:pr-16 lg:gap-20 lg:pr-20">
      {trustSliderLogos.map((logo) => (
        <div
          key={logo.src}
          className="relative h-8 w-[120px] shrink-0 opacity-50 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 sm:h-9 sm:w-[140px]"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            className="object-contain object-center"
            sizes="140px"
          />
        </div>
      ))}
    </div>
  );
}

export function TrustSlider() {
  return (
    <section
      aria-label={trustSliderLabel}
      className="relative border-t border-white/[0.06] bg-brand-bg py-14 sm:py-16"
    >
      <div className="mx-auto max-w-[1200px] px-[var(--container-padding-inline)]">
        <p className="text-center text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-white/35">
          {trustSliderLabel}
        </p>
      </div>

      <div className="relative mt-10 sm:mt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-brand-bg to-transparent sm:w-20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-brand-bg to-transparent sm:w-20"
        />
        <div className="overflow-hidden">
          <div className="flex w-max animate-trust-scroll motion-reduce:animate-none">
            <LogoRow />
            <LogoRow />
          </div>
        </div>
      </div>
    </section>
  );
}
