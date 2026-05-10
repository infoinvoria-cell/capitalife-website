"use client";

import { Hero } from "@/components/Hero/Hero";
import { Performance } from "@/components/Performance/Performance";
import RiskSuite from "@/components/sections/home/RiskSuite";
import Strategy from "@/components/sections/home/Strategy";
import StrategyAccess from "@/components/sections/home/StrategyAccess";

export function HomePage() {
  return (
    <main>
      <Hero />
      <Performance />
      <RiskSuite />
      <Strategy />
      <StrategyAccess />
    </main>
  );
}
