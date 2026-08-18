import { ExperiencePage } from "@/features/experience/components/ExperiencePage";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";

export default function ExperienceRoute() {
  return (
    <SmoothScrollProvider>
      <ExperiencePage />
    </SmoothScrollProvider>
  );
}
