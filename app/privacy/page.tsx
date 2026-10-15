import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/legal/LegalPage";
import { privacyCopy } from "@/content/legal/privacy";

export const metadata: Metadata = { title: "Datenschutz · Capitalife" };

export default function Page() {
  return <LegalPage copy={privacyCopy} />;
}
