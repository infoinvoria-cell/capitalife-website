import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/legal/LegalPage";
import { riskCopy } from "@/content/legal/risk";

export const metadata: Metadata = { title: "Risikohinweis · Capitalife" };

export default function Page() {
  return <LegalPage copy={riskCopy} />;
}
