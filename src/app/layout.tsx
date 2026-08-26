import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Providers } from "@/shared/components/layout/Providers";
import { ClickRipple } from "@/shared/components/ui/ClickRipple";
import { CursorFollower } from "@/shared/components/ui/CursorFollower";
import { ScrollProgressLine } from "@/shared/components/ui/ScrollProgressLine";
import { Preloader } from "@/shared/components/ui/Preloader";
import { InAppBrowserBanner } from "@/shared/components/ui/InAppBrowserBanner";
import { Chatbot } from "@/features/chatbot/components/Chatbot";

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
  title: "Narihito",
  description:
    "Hi! I'm Narihito (A.K.A Hein Htet Aung). Welcome to my portfolio!",
  icons: {
    icon: "/img/Narihito.jpg",
    apple: "/img/Narihito.jpg",
  },
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
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden font-body bg-bg text-text-primary">
        <div id="transition-overlay" className="fixed inset-0 z-[100] pointer-events-none bg-bg-panel-solid opacity-0" />
        <InAppBrowserBanner />
        <Preloader />
        <ClickRipple />
        <CursorFollower />
        <ScrollProgressLine />
        <Providers>{children}</Providers>
        <Chatbot />
      </body>
    </html>
  );
}
