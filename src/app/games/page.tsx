import { GamesPage } from "@/features/games/components/GamesPage";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";

export default function GamesRoute() {
  return (
    <SmoothScrollProvider>
      <GamesPage />
    </SmoothScrollProvider>
  );
}
