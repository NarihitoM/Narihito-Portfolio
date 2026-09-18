import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, IBM_Plex_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Providers } from "@/shared/components/layout/Providers";
import { ClickRipple } from "@/shared/components/ui/ClickRipple";
import { CursorFollower } from "@/shared/components/ui/CursorFollower";
import { ScrollProgressLine } from "@/shared/components/ui/ScrollProgressLine";
import { SiteBackground } from "@/shared/components/ui/SiteBackground";
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

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://narihito-portfolio.vercel.app";
const SITE_DESCRIPTION =
  "Narihito (Hein Htet Aung), A full-stack developer building web apps with Next.js, React, TypeScript and Node.js, plus AI-powered tools that ship to real users. Browse projects, skills, experience and get in touch.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Narihito (Hein Htet Aung) - Full-Stack & Agentic Ai Developer Portfolio",
    template: "%s | Narihito",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Narihito",
    "Hein Htet Aung",
    "full-stack developer",
    "web developer portfolio",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "Node.js developer",
    "AI web applications",
    "software engineer Myanmar",
    "Agentic Ai Developer"
  ],
  authors: [{ name: "Hein Htet Aung", url: SITE_URL }],
  creator: "Hein Htet Aung",
  publisher: "Hein Htet Aung",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Narihito",
    title: "Narihito (Hein Htet Aung) - Full-Stack & Agentic Ai Developer Portfolio",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/img/Narihito.jpg",
        width: 1200,
        height: 630,
        alt: "Narihito - full-stack developer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Narihito (Hein Htet Aung) - Full-Stack & Agentic Ai Developer Portfolio",
    description: SITE_DESCRIPTION,
    images: ["/img/Narihito.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  icons: {
    icon: "/img/Narihito.jpg",
    apple: "/img/Narihito.jpg",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hein Htet Aung",
  alternateName: "Narihito",
  url: SITE_URL,
  image: `${SITE_URL}/img/Narihito.jpg`,
  jobTitle: "Full-Stack Developer and Agentic AI Engineer",
  description: SITE_DESCRIPTION,
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "PostgreSQL",
    "AI application development",
    "Agentic AI",
    "AI agents",
    "Large language models",
  ],
  sameAs: ["https://github.com/NarihitoM"],
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
      className={cn("h-full", "antialiased", spaceGrotesk.variable, inter.variable, ibmPlexMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden font-body text-text-primary">
        <div id="transition-overlay" className="fixed inset-0 z-[100] pointer-events-none bg-bg-panel-solid opacity-0" />
        <SiteBackground />
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
