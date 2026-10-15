import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/legal/LegalPage";
import { imprintCopy } from "@/content/legal/imprint";

export const metadata: Metadata = { title: "Impressum · Capitalife" };

export default function Page() {
  return <LegalPage copy={imprintCopy} />;
}
