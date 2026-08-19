import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Providers } from "@/shared/components/layout/Providers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Narihito — Full-Stack Software Developer",
  description:
    "I design and build performant, motion-rich web products end to end — from data models to the pixel that reacts to your cursor.",
};

const themeInitScript = `
try {
  var stored = window.localStorage.getItem('narihito-theme');
  var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
} catch (e) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={cn("h-full", "antialiased", spaceGrotesk.variable, inter.variable, jetBrainsMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden font-body bg-bg text-text-primary">
        <div id="transition-overlay" className="fixed inset-0 z-[100] pointer-events-none bg-bg-panel-solid opacity-0" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
