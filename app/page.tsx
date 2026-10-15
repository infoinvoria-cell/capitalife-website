import { About } from "@/components/sections/home/About/About";
import { Footer } from "@/components/sections/home/Footer/Footer";
import { Founders } from "@/components/sections/home/Founders/Founders";
import { HeroMinimal } from "@/components/sections/home/Hero/HeroMinimal";
import { Waitlist } from "@/components/sections/home/Waitlist/Waitlist";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// Startseite (Warteliste / Early Access): Hero, Sektion 2 (Infos), Sektion 3 (Warteliste), Fusszeile.
export default function Page() {
  return (
    <main>
      <HeroMinimal />
      <About />
      <Founders />
      <Waitlist />
      <Footer />
      <ScrollReveal />
      <BackToTop />
    </main>
  );
}
