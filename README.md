<p align="center">
  <img src="public/img/Narihito.jpg" alt="Narihito" width="120" height="120" style="border-radius:50%;" />
</p>

<h1 align="center">Narihito Portfolio</h1>

<p align="center">
  My portfolio site, built with Next.js, TypeScript, Tailwind CSS, GSAP and Three.js.
</p>

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- [GSAP](https://gsap.com) for scroll and cursor animations
- [Three.js](https://threejs.org) for the hero scene and the silk background
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling

## Project structure

Each feature lives in `src/features/` with its own `api/`, `hooks/`, `store/`, `components/` and `types/`. Page content is loaded from the backend API. Anything used by more than one feature goes in `src/shared/`.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # run eslint
```
