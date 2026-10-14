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
  siPypi,
  siHuggingface,
  siQwen,
  siKaggle,
  siPytorch,
  siNvidia,
  siCloudflare,
} from "simple-icons";

type IconRef = { path: string; title: string; viewBox?: string; fillRule?: "evenodd" };

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
  pypi: siPypi,
  pip: siPypi,
  huggingface: siHuggingface,
  "hugging face": siHuggingface,
  transformers: siHuggingface,
  trl: siHuggingface,
  qwen: siQwen,
  kaggle: siKaggle,
  pytorch: siPytorch,
  torch: siPytorch,
  nvidia: siNvidia,
  cuda: siNvidia,
  cloudflare: siCloudflare,
  llamacpp: {
    title: "llama.cpp",
    viewBox: "1016.5 143.9 211 211",
    path: "m 1163.3,226.8 -13.5,24 c -17.8,-13.7 -44.2,-15.7 -62,-1 -28.7,23.7 -26.7,78.5 18,78.8 12.5,0 23.1,-5.9 34.5,-9.8 l 6,23.9 c -10.1,4.7 -20.4,9.5 -31.5,11 -101.2,13.8 -95.4,-132.3 -3.9,-139.9 19.2,-1.6 36.1,3.4 52.5,13 z M 1093.4,203.8 c -15.4,4.6 -29.7,13.1 -40.5,25 -2,-24.2 3.4,-73.1 30.3,-82.7 4,-1.4 17.7,-4.9 17.3,2.2 -0.4,7.1 -9.9,19.3 -12.2,25.9 -4,11.6 -0.3,19.6 5.2,29.7 z M 1131.4,307.8 1116.4,307.8 1116.4,290.8 1099.4,290.8 1099.4,276.8 1114.9,276.8 1116.4,275.3 1116.4,258.8 1131.4,258.8 1131.4,276.8 1147.4,276.8 1147.4,290.8 1131.4,290.8 z M 1186.4,290.8 1186.4,307.8 1171.4,307.8 1171.4,290.8 1155.4,290.8 1155.4,276.8 1171.4,276.8 1171.4,258.8 1186.4,258.8 1186.4,275.3 1187.9,276.8 1203.4,276.8 1203.4,290.8 z M 1142.3,156.9 c 2,3 -9.3,15.9 -11.1,19.2 -5.2,9.8 -1.7,15.4 2.2,24.7 -11.3,-1.7 -21.8,-0.3 -33,1 2.5,-21.5 14.6,-52.8 41.9,-44.9 z",
  },
  unsloth: {
    title: "Unsloth",
    fillRule: "evenodd",
    path: "m17.404 16.57-.044.046a.15.15 0 0 1-.074.042 9.6 9.6 0 0 0-1.756.62.13.13 0 0 1-.074.012l-.081-.01c-.326-.201-.786.303-.982.56l-.77.438q-.44-.52-.676-1.451-.052-.21-.335-.204c-.353.009-.86.495-1.133.78-.23.238-.606.585-.968.49a.15.15 0 0 1-.076-.047q-.195-.226-.235-.366c-.12-.401-.539-1.577-.981-1.601q-.154-.008-.346.195-.4.425-.522.561-.231.26-.341.297c-.944.316-.704-1.595-1.412-1.537-.399.032-.352.575-.342.888a.3.3 0 0 1-.05.174.3.3 0 0 1-.144.117c-.478.194-.728-.517-.805-.849A10.9 10.9 0 0 1 5 12.63a.043.043 0 0 0-.036-.045l-.003-.001a.05.05 0 0 0-.034.007.05.05 0 0 0-.02.03c-.043.16-.097.485-.29.532-.33.08-.38-.13-.377-.405.033-2.21.648-4.29 2.037-5.93 1.264-1.493 3.145-2.515 5.113-2.576l.588-.03a.5.5 0 0 0 .176-.042c.582-.256 1.805-.599 2.402-.305a.31.31 0 0 1 .165.34q-.01.042-.131.146-.06.052-.315.232a.04.04 0 0 0-.018.043.04.04 0 0 0 .033.033q.454.101.802.253c3.696 1.622 5.106 5.641 4.024 9.407q-.135.474-.395 1.194a1.5 1.5 0 0 1-.307.527.24.24 0 0 1-.147.077.23.23 0 0 1-.159-.036c-.189-.123-.128-.381-.107-.667a.03.03 0 0 0-.017-.031.04.04 0 0 0-.037 0q-.019.014-.03.05a6.4 6.4 0 0 1-.513 1.139m-.084-5.319a2.9 2.9 0 0 0-.776-1.696q-.213-.226-.912-.662c-.613-.383-1.06-.721-1.525-1.218a.14.14 0 0 0-.104-.046.14.14 0 0 0-.103.045c-.362.385-.475.948-.667 1.572-.062.204-.165.387-.398.354-.49-.07-.482-1.176-.44-1.528a.07.07 0 0 0-.017-.054.07.07 0 0 0-.052-.023.13.13 0 0 0-.083.032c-.155.133-.55.495-.8.534-.252.038-.338-.267-.304-.488q.056-.355.18-.752a.06.06 0 0 0-.082-.074 5.6 5.6 0 0 1-1.96.447.6.6 0 0 0-.13.02A3.15 3.15 0 0 0 7.254 9.09a.034.034 0 0 0 .034.051c.972-.164 2.249-.397 2.893.603.55.855.01 1.93-.947 2.12q-.313.064-1.132-.063a7 7 0 0 0-1.145-.08.054.054 0 0 0-.054.044l.001.026c.409 1.463 1.552 2.543 2.92 3.14 2.215.966 5.037.87 6.71-1.057a.06.06 0 0 0 .003-.073l-.02-.017c-.574-.308-1.284-.456-1.804-.644-.551-.2-.92-.717-.927-1.322-.014-1.137 1.166-1.718 2.159-1.287q.63.273 1.326.751a.03.03 0 0 0 .049-.029M9.568 10.11a.5.5 0 0 0-.283-.23.693.693 0 0 0-.88.897q.044.128.14.188c.046.03.102.038.158.024a.25.25 0 0 0 .143-.098c.187-.262.287-.381.666-.312a.173.173 0 0 0 .203-.161.17.17 0 0 0-.023-.094zm5.192 1.116c-.376.208-.494.751-.132 1.032a.17.17 0 0 0 .249-.038c.07-.102.163-.245.266-.302.102-.056.273-.06.397-.065a.17.17 0 0 0 .164-.19c-.045-.457-.568-.645-.944-.437M12 0c6.627 0 12 5.373 12 12 0 1.61-.317 3.147-.893 4.55h-.002a12 12 0 0 0-4.032-.268.6.6 0 0 0 .14-.177c.2-.497.402-1.016.51-1.529.152-.715.358-1.456.405-2.17q.232-3.517-2.063-6.183-.775-.903-2.093-1.644c-.189-.106-.398-.163-.542-.252a.14.14 0 0 1-.058-.073c-.017-.05.017-.21-.003-.305q-.12-.565-.681-.718-.578-.158-.926-.134a6.3 6.3 0 0 0-1.833.423.4.4 0 0 1-.14.025 7.5 7.5 0 0 0-1.851.228 7.8 7.8 0 0 0-3.45 1.86 8.5 8.5 0 0 0-2.28 3.445c-.195.548-.31 1.232-.451 1.844-.114.49-.157 1.016-.19 1.527-.029.453.052 1.15.546 1.302q.094.03.156.057a.1.1 0 0 1 .036.029.1.1 0 0 1 .014.044c.048.94.185 1.948.59 2.76.322.644 1.198.881 1.733.306a.09.09 0 0 1 .108-.016.1.1 0 0 1 .028.028l.21.318q.007.011.015.019.694.58 1.432.17c.236-.132.489-.439.668-.672a.077.077 0 0 1 .132.02q.23.645.44 1.13c.116.265.366.494.65.57a1.27 1.27 0 0 0 1.178-.247q.265-.213.834-.76a.102.102 0 0 1 .17.057q.106.627.525 1.103a12.04 12.04 0 0 0-3.834 4.976l-.036.02C3.904 22.386 0 17.65 0 12 0 5.373 5.373 0 12 0M12.056 11.124c-.384-.082-.759.15-.836.517-.078.367.172.73.556.81.385.082.76-.15.836-.517.078-.366-.171-.73-.556-.81m-.359 1.674c.414.089.075.438.323.572.407.218.726-.087.97-.37a.18.18 0 0 1 .2-.052c.283.104.192.354.035.534-.444.505-1.141.605-1.668.167a.1.1 0 0 0-.041-.012.2.2 0 0 0-.042-.006c-.661.181-1.256-.198-1.45-.84-.07-.23-.05-.495.251-.472a.18.18 0 0 1 .16.13c.107.357.27.768.732.737.28-.019.115-.478.53-.388M9.188 23.67c1.792-4.372 6.09-7.451 11.107-7.451.978 0 1.928.117 2.838.337z",
  },
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
    <svg
      viewBox={icon.viewBox ?? "0 0 24 24"}
      fill="currentColor"
      fillRule={icon.fillRule}
      className={className}
      aria-hidden="true"
      role="img"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}
