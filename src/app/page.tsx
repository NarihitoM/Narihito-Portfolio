import { HeaderNav } from "@/features/portfolio/components/HeaderNav";
import { Hero } from "@/features/portfolio/components/Hero";
import { About } from "@/features/portfolio/components/About";
import { Skills } from "@/features/portfolio/components/Skills";
import { Experience } from "@/features/portfolio/components/Experience";
import { Projects } from "@/features/portfolio/components/Projects";
import { Testimonials } from "@/features/portfolio/components/Testimonials";
import { Contact } from "@/features/portfolio/components/Contact";
import { SmoothScrollProvider } from "@/features/portfolio/components/SmoothScrollProvider";
import { ScrollToTop } from "@/features/portfolio/components/ScrollToTop";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <HeaderNav />
      <main className="flex-1">
        <Hero />
        <About />
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
