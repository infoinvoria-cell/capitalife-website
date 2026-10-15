import { About } from "@/components/sections/home/About/About";
import { Footer } from "@/components/sections/home/Footer/Footer";
import { HeroMinimal } from "@/components/sections/home/Hero/HeroMinimal";
import { Waitlist } from "@/components/sections/home/Waitlist/Waitlist";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// Startseite (Warteliste / Early Access): Hero, Sektion 2 (Infos), Sektion 3 (Warteliste), Fusszeile.
export default function Page() {
  return (
    <main>
      <HeroMinimal />
      <About />
      <Waitlist />
      <Footer />
      <ScrollReveal />
    </main>
  );
}
