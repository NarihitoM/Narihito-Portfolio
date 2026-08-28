import { Globe } from "lucide-react";
import {
  siGithub,
  siFacebook,
  siX,
  siInstagram,
  siTelegram,
  siDiscord,
  siYoutube,
  siTiktok,
} from "simple-icons";

type IconRef = { path: string; title: string };

const ICONS: Record<string, IconRef> = {
  github: siGithub,
  facebook: siFacebook,
  x: siX,
  instagram: siInstagram,
  telegram: siTelegram,
  discord: siDiscord,
  youtube: siYoutube,
  tiktok: siTiktok,
};

export const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  facebook: "Facebook",
  x: "X",
  instagram: "Instagram",
  telegram: "Telegram",
  discord: "Discord",
  youtube: "YouTube",
  tiktok: "TikTok",
  website: "Website",
};

export function socialLabel(type: string) {
  return SOCIAL_LABELS[type.toLowerCase()] ?? "Link";
}

export function SocialIcon({ type, className = "h-4 w-4" }: { type: string; className?: string }) {
  const key = type.toLowerCase();

  if (key === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 10v7M7 7v.01M11 17v-4.5a2.5 2.5 0 0 1 5 0V17" />
      </svg>
    );
  }

  const icon = ICONS[key];
  if (!icon) return <Globe className={className} strokeWidth={1.6} aria-hidden="true" />;

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" role="img">
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}
