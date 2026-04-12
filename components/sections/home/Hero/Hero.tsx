"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { trustSliderLogos } from "@/components/sections/home/TrustSlider.data";
import { heroData } from "./Hero.data";
import type { HeroProps } from "./Hero.types";

const contentEase = [0.22, 1, 0.36, 1] as const;

function IconBarChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 20V12M10 20V8M16 20v-4M22 20V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12 2.5l2.8 8.6h9l-7.3 5.3 2.8 8.6-7.3-5.3-7.3 5.3 2.8-8.6-7.3-5.3h9L12 2.5z"
      />
    </svg>
  );
}

export function Hero({ className }: HeroProps) {
  const reduceMotion = useReducedMotion();

  const containerTransition = reduceMotion
    ? { duration: 0.2 }
    : { staggerChildren: 0.14, delayChildren: 0.12 };

  const itemTransition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.9, ease: contentEase };

  const itemHidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 28 };

  const itemShow = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };

  const horizonPulse = reduceMotion
    ? undefined
    : { opacity: [0.5, 0.68, 0.5] };

  const horizonTransition = reduceMotion
    ? undefined
    : { duration: 20, repeat: Infinity, ease: "easeInOut" as const };

  const bloomPulse = reduceMotion
    ? undefined
    : { opacity: [0.32, 0.46, 0.32], scale: [1, 1.025, 1] };

  const bloomTransition = reduceMotion
    ? undefined
    : { duration: 24, repeat: Infinity, ease: "easeInOut" as const, delay: 1 };

  return (
    <section
      id="start"
      aria-labelledby="hero-heading"
      className={[
        "relative flex min-h-screen flex-col overflow-hidden bg-black",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.025] via-transparent to-black"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_20%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.92)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-hero-noise bg-size-[256px] bg-repeat opacity-[0.02] mix-blend-overlay"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-16 h-[min(48vh,400px)] w-[min(75vw,480px)] md:top-24"
      >
        <div className="absolute left-[6%] top-[8%] h-px w-[min(95%,400px)] origin-left rotate-[40deg] bg-gradient-to-r from-brand-gold-400/50 via-brand-gold-300/18 to-transparent" />
        <div className="absolute left-[2%] top-[18%] h-px w-[min(88%,360px)] origin-left rotate-[34deg] bg-gradient-to-r from-brand-gold-200/40 via-brand-gold-400/14 to-transparent" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-25%] bottom-0 h-[min(75vh,780px)]"
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 h-full bg-[radial-gradient(ellipse_95%_62%_at_50%_100%,rgba(213,175,54,0.55),rgba(180,140,50,0.18)_38%,rgba(40,32,12,0)_72%)] blur-3xl"
          animate={horizonPulse}
          transition={horizonTransition}
        />
        <motion.div
          className="absolute inset-x-[4%] bottom-0 h-[92%] bg-[radial-gradient(ellipse_78%_52%_at_50%_100%,rgba(236,219,166,0.28),rgba(213,175,54,0.11)_34%,rgba(0,0,0,0)_68%)] blur-2xl"
          animate={bloomPulse}
          transition={bloomTransition}
        />
        <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(to_top,rgba(213,175,54,0.16),rgba(0,0,0,0)_88%)] blur-2xl" />
        <div className="absolute inset-x-[22%] bottom-0 h-[34%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,248,235,0.55),rgba(226,202,122,0.26)_30%,transparent_76%)] blur-lg opacity-95" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-[var(--container-padding-inline)] pb-10 pt-[7.5rem] text-center sm:pt-36 md:pb-12 md:pt-40">
        <motion.div
          className="flex flex-1 flex-col items-center justify-center py-6 md:py-16"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: containerTransition },
          }}
        >
          <motion.div
            variants={{
              hidden: itemHidden,
              show: { ...itemShow, transition: itemTransition },
            }}
            className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-[#111]/90 px-5 py-2 sm:mb-12"
          >
            <span className="size-2 shrink-0 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.55)]" />
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-[0.6875rem]">
              {heroData.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={{
              hidden: itemHidden,
              show: { ...itemShow, transition: itemTransition },
            }}
            className="max-w-[980px] text-[2.25rem] font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl sm:leading-[1.04] md:text-6xl md:leading-[1.03] lg:text-7xl lg:leading-[1.02] xl:text-[4.35rem]"
          >
            <span className="block text-white">{heroData.headlineLine1}</span>
            <span className="mt-2 block bg-gradient-to-r from-brand-gold-400 via-brand-gold-350 to-brand-gold-200 bg-clip-text text-transparent sm:mt-2.5">
              {heroData.headlineLine2}
            </span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: itemHidden,
              show: { ...itemShow, transition: itemTransition },
            }}
            className="mt-10 max-w-[540px] text-[0.9375rem] font-normal leading-[1.72] tracking-[-0.01em] text-[#a0a0a0] sm:mt-12 sm:text-base md:text-[1.0625rem] md:leading-[1.68]"
          >
            {heroData.subtext}
          </motion.p>

          <motion.div
            variants={{
              hidden: itemHidden,
              show: { ...itemShow, transition: itemTransition },
            }}
            className="mt-14 flex w-full max-w-[440px] flex-col items-stretch justify-center gap-5 sm:mt-16 sm:max-w-none sm:flex-row sm:items-start sm:gap-6"
          >
            <span className="relative inline-flex w-full justify-center sm:w-auto">
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-9 left-1/2 h-16 w-[min(100%,260px)] -translate-x-1/2 rounded-full bg-white/25 blur-3xl sm:-bottom-10 sm:h-[4.5rem] sm:w-[280px]"
              />
              <Link
                href={heroData.primaryCta.href}
                className="relative z-10 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-9 py-4 text-[0.9375rem] font-semibold tracking-wide text-black shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_40px_-6px_rgba(255,255,255,0.55),0_28px_64px_-18px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:w-auto"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.07]">
                  <IconBarChart className="text-black" />
                </span>
                {heroData.primaryCta.label}
              </Link>
            </span>

            <span className="relative inline-flex w-full justify-center sm:w-auto">
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-9 left-1/2 h-16 w-[min(100%,260px)] -translate-x-1/2 rounded-full bg-brand-gold-400/35 blur-3xl sm:-bottom-10 sm:h-[4.5rem] sm:w-[280px]"
              />
              <Link
                href={heroData.secondaryCta.href}
                className="relative z-10 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 via-brand-gold-350 to-brand-gold-300 px-9 py-4 text-[0.9375rem] font-semibold tracking-wide text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_1px_rgba(213,175,54,0.45),0_12px_44px_-8px_rgba(213,175,54,0.55),0_32px_70px_-20px_rgba(213,175,54,0.28)] transition-all duration-500 ease-out hover:scale-[1.02] hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-300 sm:w-auto"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black">
                  <IconStar className="text-black" />
                </span>
                {heroData.secondaryCta.label}
              </Link>
            </span>
          </motion.div>
        </motion.div>

        <div className="relative z-10 mt-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-7 pb-4 pt-10 opacity-90 sm:gap-x-16 sm:pb-6 sm:pt-14 md:gap-x-20">
          {trustSliderLogos.map((logo) => (
            <div
              key={logo.src}
              className="relative h-7 w-[104px] opacity-[0.38] grayscale sm:h-8 sm:w-[120px] md:h-9 md:w-[132px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain object-center brightness-125 contrast-95"
                sizes="140px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
