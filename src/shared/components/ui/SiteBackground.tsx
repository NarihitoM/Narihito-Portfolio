"use client";

import { useEffect, useId, useRef } from "react";
import * as THREE from "three";
import { useTheme, type Theme } from "@/shared/hooks/useTheme";

interface SilkPalette {
  low: readonly [number, number, number];
  high: readonly [number, number, number];
  foldGamma: number;
  sheenGamma: number;
  sheenWeight: number;
  vignetteX: number;
  vignetteY: number;
}

const GRAIN_OPACITY = 0.3;

const FOLD_FREQUENCY = 9;
const FOLD_TILT = 0.62;
const FOLD_DRIFT = 0.1;
const SHEEN_FREQUENCY = 6;
const SHEEN_TILT = 1.05;
const SHEEN_DRIFT = -0.062;

const PALETTES: Record<Theme, SilkPalette> = {
  dark: {
    low: [0, 0, 0],
    high: [42 / 255, 41 / 255, 39 / 255],
    foldGamma: 3.8,
    sheenGamma: 2.0,
    sheenWeight: 0.085,
    vignetteX: 0.26,
    vignetteY: 0.3,
  },
  light: {
    low: [1, 1, 1],
    high: [190 / 255, 188 / 255, 182 / 255],
    foldGamma: 1.7,
    sheenGamma: 1.5,
    sheenWeight: 0.16,
    vignetteX: 0.14,
    vignetteY: 0.16,
  },
};

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform float uFoldGamma;
  uniform float uSheenGamma;
  uniform float uSheenWeight;
  uniform float uVignetteX;
  uniform float uVignetteY;
  uniform vec2 uPointer;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    float diagonal = length(uResolution);
    vec2 nCoord = (vUv * uResolution) / diagonal;
    float nx = nCoord.x;
    float ny = nCoord.y;

    float foldWarpX = 0.055 * sin(nx * 3.8 + uTime * 0.19)
      + 0.03 * sin(nx * 7.0 - uTime * 0.27)
      + 0.016 * sin(nx * 11.2 + uTime * 0.13);
    float foldWarpY = 0.04 * sin(ny * 5.3 - uTime * 0.16) + 0.022 * sin(ny * 9.1 + uTime * 0.23);
    float foldAngle = ${FOLD_FREQUENCY.toFixed(1)} * ((foldWarpX - ${FOLD_TILT.toFixed(2)} * nx) + (ny + foldWarpY)) + ${FOLD_DRIFT.toFixed(2)} * uTime;
    float fold = 0.5 + 0.5 * cos(foldAngle);

    float sheenWarpX = 0.075 * sin(nx * 3.1 - uTime * 0.14);
    float sheenWarpY = 0.048 * sin(ny * 4.7 + uTime * 0.21);
    float sheenAngle = ${SHEEN_FREQUENCY.toFixed(1)} * ((sheenWarpX - ${SHEEN_TILT.toFixed(2)} * nx) + (ny + sheenWarpY)) + ${SHEEN_DRIFT.toFixed(3)} * uTime;
    float sheen = 0.5 + 0.5 * cos(sheenAngle);

    float envX = 0.8 + 0.2 * sin(nx * 2.6 + uTime * 0.11);
    float envY = 0.88 + 0.12 * sin(ny * 4.3 - uTime * 0.09);

    float crest = pow(fold, uFoldGamma) * envX * envY;
    float glow = pow(sheen, uSheenGamma) * uSheenWeight;

    float level = crest + glow - crest * glow;

    float u = vUv.x * 2.0 - 1.0;
    float v = vUv.y * 2.0 - 1.0;
    level *= (1.0 - uVignetteX * u * u) * (1.0 - uVignetteY * v * v);

    float pointerGlow = smoothstep(0.55, 0.0, distance(vUv, uPointer)) * 0.05;
    level = clamp(level + pointerGlow, 0.0, 1.0);

    float noise = (hash(vUv * uResolution + uTime) - 0.5) / 255.0;
    vec3 color = mix(uLow, uHigh, level) + noise;

    gl_FragColor = vec4(color, 1.0);
  }
`;

type SilkUniforms = {
  uTime: { value: number };
  uResolution: { value: THREE.Vector2 };
  uLow: { value: THREE.Vector3 };
  uHigh: { value: THREE.Vector3 };
  uFoldGamma: { value: number };
  uSheenGamma: { value: number };
  uSheenWeight: { value: number };
  uVignetteX: { value: number };
  uVignetteY: { value: number };
  uPointer: { value: THREE.Vector2 };
};

export function SiteBackground() {
  const grainId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uniformsRef = useRef<SilkUniforms | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const palette = PALETTES[theme];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 7.2 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uLow: { value: new THREE.Vector3(...palette.low) },
      uHigh: { value: new THREE.Vector3(...palette.high) },
      uFoldGamma: { value: palette.foldGamma },
      uSheenGamma: { value: palette.sheenGamma },
      uSheenWeight: { value: palette.sheenWeight },
      uVignetteX: { value: palette.vignetteX },
      uVignetteY: { value: palette.vignetteY },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    };

    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const resize = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (width < 2 || height < 2) return;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    const onPointerMove = (clientX: number, clientY: number) => {
      const rect = root.getBoundingClientRect();
      uniforms.uPointer.value.set(
        (clientX - rect.left) / rect.width,
        1 - (clientY - rect.top) / rect.height,
      );
    };
    const onMouseMove = (event: MouseEvent) => onPointerMove(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) onPointerMove(touch.clientX, touch.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    renderer.render(scene, camera);

    if (reduced) {
      return () => {
        observer.disconnect();
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
        material.dispose();
        quad.geometry.dispose();
        renderer.dispose();
      };
    }

    let raf = 0;
    let isVisible = true;
    const started = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      uniforms.uTime.value = 7.2 + (now - started) / 1000;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === isVisible) return;
        isVisible = entry.isIntersecting;
        if (isVisible && !raf) raf = requestAnimationFrame(frame);
        else if (!isVisible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.01 },
    );
    visObserver.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      visObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      uniformsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    const palette = PALETTES[theme];
    uniforms.uLow.value.set(...palette.low);
    uniforms.uHigh.value.set(...palette.high);
    uniforms.uFoldGamma.value = palette.foldGamma;
    uniforms.uSheenGamma.value = palette.sheenGamma;
    uniforms.uSheenWeight.value = palette.sheenWeight;
    uniforms.uVignetteX.value = palette.vignetteX;
    uniforms.uVignetteY.value = palette.vignetteY;
  }, [theme]);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10 isolate overflow-hidden">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="aura-grain" style={{ opacity: GRAIN_OPACITY }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values="0.181 0.608 0.061 0 0.075
                      0.181 0.608 0.061 0 0.075
                      0.181 0.608 0.061 0 0.075
                      0     0     0     1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
      </div>
    </div>
  );
}
