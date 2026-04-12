"use client";

import { Hero } from "@/components/Hero/Hero";
import { Performance } from "@/components/Performance/Performance";
import Strategy from "@/components/sections/home/Strategy";

export function HomePage() {
  return (
    <main>
      <Hero />
      <Performance />
      <Strategy />
    </main>
  );
}
