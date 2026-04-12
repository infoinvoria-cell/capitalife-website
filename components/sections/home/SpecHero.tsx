import Link from "next/link";

export function SpecHero() {
  return (
    <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-[#101213] px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(50vh,420px)] bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(213,175,54,0.22),rgba(213,175,54,0.06)_45%,transparent_72%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] bottom-0 h-[min(35vh,280px)] bg-gradient-to-t from-[#D5AF36]/15 via-transparent to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-[900px] text-center">
        <h1 className="text-6xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
          <span className="block">Our Infrastructure</span>
          <span className="block text-[#D5AF36]">Meets Your Returns</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[600px] text-lg text-gray-400">
          Built on 20+ years of data. Proven by real-world performance.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#"
            className="inline-flex rounded-xl bg-[#D5AF36] px-6 py-3 font-medium text-black"
          >
            Get Started
          </Link>
          <Link
            href="#"
            className="inline-flex rounded-xl border border-gray-600 px-6 py-3 font-medium text-white"
          >
            Partner Program
          </Link>
        </div>
      </div>
    </section>
  );
}
