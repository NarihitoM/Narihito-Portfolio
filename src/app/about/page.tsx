import { AboutPage } from "@/features/about/components/AboutPage";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";

export default function AboutRoute() {
  return (
    <SmoothScrollProvider>
      <AboutPage />
    </SmoothScrollProvider>
  );
}
