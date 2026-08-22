import { HeaderNav } from "@/features/portfolio/components/HeaderNav";
import { Hero } from "@/features/portfolio/components/Hero";
import { About } from "@/features/portfolio/components/About";
import { NameMarquee } from "@/features/portfolio/components/NameMarquee";
import { Skills } from "@/features/portfolio/components/Skills";
import { Experience } from "@/features/portfolio/components/Experience";
import { Projects } from "@/features/portfolio/components/Projects";
import { Testimonials } from "@/features/portfolio/components/Testimonials";
import { Contact } from "@/features/portfolio/components/Contact";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";
import { ScrollToTop } from "@/features/portfolio/components/ScrollToTop";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <HeaderNav />
      <main className="flex-1">
        <Hero />
        <About />
        <NameMarquee />
        <Skills />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <ScrollToTop />
    </SmoothScrollProvider>
  );
}
