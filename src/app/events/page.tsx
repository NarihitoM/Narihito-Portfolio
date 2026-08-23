import { EventsPage } from "@/features/events/components/EventsPage";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";

export default function EventsRoute() {
  return (
    <SmoothScrollProvider>
      <EventsPage />
    </SmoothScrollProvider>
  );
}
