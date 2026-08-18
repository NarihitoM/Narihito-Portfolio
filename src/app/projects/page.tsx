import { ProjectsPage } from "@/features/projects/components/ProjectsPage";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";

export default function ProjectsRoute() {
  return (
    <SmoothScrollProvider>
      <ProjectsPage />
    </SmoothScrollProvider>
  );
}
