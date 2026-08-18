import { SkillsPage } from "@/features/skills/components/SkillsPage";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";

export default function SkillsRoute() {
  return (
    <SmoothScrollProvider>
      <SkillsPage /> 
    </SmoothScrollProvider>
  );
}
