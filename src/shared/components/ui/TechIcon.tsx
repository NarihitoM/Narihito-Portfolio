import {
  siReact,
  siTypescript,
  siNodedotjs,
  siNextdotjs,
  siPostgresql,
  siGraphql,
  siThreedotjs,
  siGsap,
  siDocker,
  siJavascript,
  siHtml5,
  siCss,
  siGit,
  siGithub,
  siTailwindcss,
  siMongodb,
  siExpress,
  siPrisma,
  siVercel,
  siMysql,
  siTanstack,
  siRedis,
  siPython,
  siLangchain,
  siOpenjdk,
  siSpringboot,
  siPhp,
  siBootstrap,
  siElectron,
  siGo,
  siN8n,
} from "simple-icons";

type IconRef = { path: string; title: string };

const ICONS: Record<string, IconRef> = {
  react: siReact,
  typescript: siTypescript,
  node: siNodedotjs,
  nodejs: siNodedotjs,
  "node.js": siNodedotjs,
  next: siNextdotjs,
  nextjs: siNextdotjs,
  "next.js": siNextdotjs,
  postgresql: siPostgresql,
  postgres: siPostgresql,
  graphql: siGraphql,
  three: siThreedotjs,
  threejs: siThreedotjs,
  "three.js": siThreedotjs,
  gsap: siGsap,
  docker: siDocker,
  javascript: siJavascript,
  js: siJavascript,
  html5: siHtml5,
  html: siHtml5,
  css3: siCss,
  css: siCss,
  git: siGit,
  github: siGithub,
  tailwindcss: siTailwindcss,
  tailwind: siTailwindcss,
  mongodb: siMongodb,
  mongo: siMongodb,
  express: siExpress,
  "express.js": siExpress,
  prisma: siPrisma,
  vercel: siVercel,
  mysql: siMysql,
  tanstack: siTanstack,
  "react-query": siTanstack,
  "tanstack query": siTanstack,
  redis: siRedis,
  python: siPython,
  langchain: siLangchain,
  go: siGo,
  golang: siGo,
  n8n: siN8n,
  java: siOpenjdk,
  springboot: siSpringboot,
  "spring boot": siSpringboot,
  spring: siSpringboot,
  php: siPhp,
  bootstrap: siBootstrap,
  electron: siElectron,
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const key = name.toLowerCase();
  const icon =
    ICONS[key] ??
    ICONS[key.replace(/[.\s]/g, "")] ??
    Object.entries(ICONS).find(([k]) => key.includes(k))?.[1];

  if (!icon) {
    return (
      <span
        className={`flex items-center justify-center rounded-[3px] border border-border-glow-soft font-mono text-[10px] ${className ?? ""}`}
      >
        {name[0]}
      </span>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" role="img">
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}