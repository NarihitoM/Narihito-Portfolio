import { TestimonialsPage } from "@/features/testimonials/components/TestimonialsPage";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";

export default function TestimonialsRoute() {
  return (
    <SmoothScrollProvider>
      <TestimonialsPage />
    </SmoothScrollProvider>
  );
}
