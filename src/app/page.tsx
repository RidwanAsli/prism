import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { LogoMarquee } from "@/components/site/logo-marquee";
import { Stats } from "@/components/site/stats";
import { LightChamber } from "@/components/site/light-chamber/light-chamber";
import { BentoSection } from "@/components/site/bento";
import { Gallery } from "@/components/site/gallery/gallery";
import { Testimonials } from "@/components/site/testimonials";
import { Pricing } from "@/components/site/pricing";
import { Faq } from "@/components/site/faq";
import { Cta } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <ScrollProgress className="fixed top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoMarquee />
        <Stats />
        <LightChamber />
        <BentoSection />
        <Gallery />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
