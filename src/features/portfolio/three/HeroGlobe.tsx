"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/shared/lib/utils";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

const SCENE_URL = "https://prod.spline.design/894o6T78dybPdAyX/scene.splinecode";

export function HeroGlobe() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "pointer-events-auto absolute inset-0 transition-opacity duration-1000",
        loaded ? "opacity-100" : "opacity-0",
      )}
    >
      <Spline scene={SCENE_URL} onLoad={() => setLoaded(true)} className="h-full w-full" />
    </div>
  );
}
