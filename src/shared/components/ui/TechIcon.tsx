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
  siSpringboot,
  siPhp,
  siBootstrap,
  siElectron,
  siGo,
  siN8n,
  siVuedotjs,
  siSwagger,
  siPostman,
  siFramer,
  siGooglegemini,
  siSupabase,
  siFigma,
  siJupyter,
  siTensorflow,
  siNumpy,
  siOpencv,
  siNpm,
  siMediapipe,
} from "simple-icons";

type IconRef = { path: string; title: string; viewBox?: string };

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
  springboot: siSpringboot,
  "spring boot": siSpringboot,
  spring: siSpringboot,
  php: siPhp,
  bootstrap: siBootstrap,
  electron: siElectron,
  vue: siVuedotjs,
  "vue.js": siVuedotjs,
  vuejs: siVuedotjs,
  "rest api": siSwagger,
  restapi: siSwagger,
  rest: siSwagger,
  swagger: siSwagger,
  postman: siPostman,
  framer: siFramer,
  "framer motion": siFramer,
  framermotion: siFramer,
  motion: siFramer,
  gemini: siGooglegemini,
  "google gemini": siGooglegemini,
  googlegemini: siGooglegemini,
  supabase: siSupabase,
  figma: siFigma,
  jupyter: siJupyter,
  jupyterbook: siJupyter,
  "jupyter book": siJupyter,
  "jupyter-book": siJupyter,
  tensorflow: siTensorflow,
  tensor: siTensorflow,
  numpy: siNumpy,
  opencv: siOpencv,
  "open cv": siOpencv,
  "open-cv": siOpencv,
  mediapipe: siMediapipe,
  "media pipe": siMediapipe,
  npm: siNpm,
  pypi: siPython,
  pip: siPython,
  groq: {
    title: "Groq",
    path: "M12.036 2c-3.853-.035-7 3-7.036 6.781-.035 3.782 3.055 6.872 6.908 6.907h2.42v-2.566h-2.292c-2.407.028-4.38-1.866-4.408-4.23-.029-2.362 1.901-4.298 4.308-4.326h.1c2.407 0 4.358 1.915 4.365 4.278v6.305c0 2.342-1.944 4.25-4.323 4.279a4.375 4.375 0 01-3.033-1.252l-1.851 1.818A7 7 0 0012.029 22h.092c3.803-.056 6.858-3.083 6.879-6.816v-6.5C18.907 4.963 15.817 2 12.036 2z",
  },
  java: {
    title: "Java",
    viewBox: "0 0 384 512",
    path: "M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zm-85.4-32.1c-19-42.7-83.1-80.2 0-145.8C296 53.2 242.84 0 242.84 0c21.5 84.5-75.6 110.1-110.7 162.6-23.9 35.9 11.7 74.4 60.2 118.2zm114.6-176.2c.1 0-175.2 43.8-91.5 140.2 24.7 28.4-6.5 54-6.5 54s62.7-32.4 33.9-72.9c-26.9-37.8-47.5-56.6 64.1-121.3zm-6.1 270.5a12.19 12.19 0 0 1-2 2.6c128.3-33.7 81.1-118.9 19.8-97.3a17.33 17.33 0 0 0-8.2 6.3 70.45 70.45 0 0 1 11-3c31-6.5 75.5 41.5-20.6 91.4zM348 437.4s14.5 11.9-15.9 21.2c-57.9 17.5-240.8 22.8-291.6.7-18.3-7.9 16-19 26.8-21.3 11.2-2.4 17.7-2 17.7-2-20.3-14.3-131.3 28.1-56.4 40.2C232.84 509.4 401 461.3 348 437.4zM124.44 396c-78.7 22 47.9 67.4 148.1 24.5a185.89 185.89 0 0 1-28.2-13.8c-44.7 8.5-65.4 9.1-106 4.5-33.5-3.8-13.9-15.2-13.9-15.2zm179.8 97.2c-78.7 14.8-175.8 13.1-233.3 3.6 0-.1 11.8 9.7 72.4 13.6 92.2 5.9 233.8-3.3 237.1-46.9 0 0-6.4 16.5-76.2 29.7zM260.64 353c-59.2 11.4-93.5 11.1-136.8 6.6-33.5-3.5-11.6-19.7-11.6-19.7-86.8 28.8 48.2 61.4 169.5 25.9a60.37 60.37 0 0 1-21.1-12.8z",
  },
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
    <svg viewBox={icon.viewBox ?? "0 0 24 24"} fill="currentColor" className={className} aria-hidden="true" role="img">
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}
