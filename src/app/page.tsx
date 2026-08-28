import { HeaderNav } from "@/features/portfolio/components/HeaderNav";
import { Hero } from "@/features/portfolio/components/Hero";
import { About } from "@/features/portfolio/components/About";
import { NameMarquee } from "@/features/portfolio/components/NameMarquee";
import { Skills } from "@/features/portfolio/components/Skills";
import { Experience } from "@/features/portfolio/components/Experience";
import { Projects } from "@/features/portfolio/components/Projects";
import { Testimonials } from "@/features/portfolio/components/Testimonials";
import { Events } from "@/features/portfolio/components/Events";
import { Contact } from "@/features/portfolio/components/Contact";
import { SectionBridge } from "@/shared/components/ui/SectionBridge";
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
        <SectionBridge from="01 - ABOUT" to="02 - STACK" />
        <Skills />
        <SectionBridge from="02 - STACK" to="03 - EXPERIENCE" />
        <Experience />
        <SectionBridge from="03 - EXPERIENCE" to="04 - PROJECTS" />
        <Projects />
        <SectionBridge from="04 - PROJECTS" to="05 - EVENTS" />
        <Events />
        <SectionBridge from="05 - EVENTS" to="06 - WORDS" />
        <Testimonials />
        <Contact />
      </main>
      <ScrollToTop />
    </SmoothScrollProvider>
  );
}
