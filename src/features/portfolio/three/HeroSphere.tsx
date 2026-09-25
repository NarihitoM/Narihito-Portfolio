"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme, type Theme } from "@/shared/hooks/useTheme";
import { REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

interface HorizonStyle {
  glowVar: string;
  line: number;
  halo: number;
  inner: number;
}

const STYLES: Record<Theme, HorizonStyle> = {
  dark: { glowVar: "--color-text-primary", line: 1, halo: 1, inner: 1 },
  light: { glowVar: "--color-text-primary", line: 0.95, halo: 0.22, inner: 0.05 },
};

const MOBILE_TOP = 0.18;
const DESKTOP_TOP = 0.22;
const MOBILE_RADIUS = 1.4;
const DESKTOP_RADIUS = 1;

function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== ancestor) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

function measureApex(layer: HTMLElement) {
  const section = layer.closest("section");
  if (!section) return null;
  const cta = section.querySelector<HTMLElement>("[data-hero-cta]");
  const meta = Array.from(section.querySelectorAll<HTMLElement>("[data-hero-meta]")).find(
    (element) => element.offsetParent !== null,
  );
  if (!cta || !meta) return null;
  const ctaBottom = offsetWithin(cta, section) + cta.offsetHeight;
  return (ctaBottom + offsetWithin(meta, section)) / 2;
}

export function horizonCircle(layer: HTMLElement) {
  const width = layer.clientWidth;
  const height = layer.clientHeight;
  const portrait = width < height;
  const radius = width * (portrait ? MOBILE_RADIUS : DESKTOP_RADIUS);
  const apex = measureApex(layer) ?? height * (1 - (portrait ? MOBILE_TOP : DESKTOP_TOP));
  return { cx: width / 2, cy: apex + radius, radius };
}
const POINTER_FOLLOW = 0.04;

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uDpr;
  uniform float uTime;
  uniform float uTop;
  uniform float uRadius;
  uniform float uFocus;
  uniform vec3 uGlow;
  uniform vec3 uBase;
  uniform vec3 uMix;

  void main() {
    vec2 p = gl_FragCoord.xy;
    float radius = uResolution.x * uRadius;
    vec2 center = vec2(uResolution.x * 0.5, uResolution.y * uTop - radius);
    float edge = length(p - center) - radius;
    float d = edge / uDpr;

    float along = (p.x - center.x) / radius;
    float drift = 0.12 * sin(uTime * 0.25) + 0.25 * uFocus;
    float focus = exp(-pow(along - drift, 2.0) / 0.09);
    float pulse = 0.92 + 0.08 * sin(uTime * 0.8);

    float line = exp(-abs(d) / 1.2) * uMix.x;
    float halo = d > 0.0 ? (exp(-d / 26.0) * 0.55 + exp(-d / 120.0) * 0.25) * uMix.y : 0.0;
    float inner = d < 0.0 ? exp(d / 40.0) * 0.35 * uMix.z : 0.0;
    float light = clamp((line + halo + inner) * (0.18 + 0.82 * focus) * pulse, 0.0, 1.0);

    float body = clamp(0.5 - edge, 0.0, 1.0);
    vec3 color = uGlow * light + uBase * body * (1.0 - light);
    float alpha = light + body * (1.0 - light);
    gl_FragColor = vec4(color, alpha);
  }
`;

type HorizonUniforms = {
  uResolution: { value: THREE.Vector2 };
  uDpr: { value: number };
  uTime: { value: number };
  uTop: { value: number };
  uRadius: { value: number };
  uFocus: { value: number };
  uGlow: { value: THREE.Color };
  uBase: { value: THREE.Color };
  uMix: { value: THREE.Vector3 };
};

function applyTheme(uniforms: HorizonUniforms, theme: Theme) {
  const style = STYLES[theme];
  uniforms.uGlow.value.copy(themeColor(style.glowVar));
  uniforms.uBase.value.copy(themeColor("--color-bg"));
  uniforms.uMix.value.set(style.line, style.halo, style.inner);
}

function themeColor(name: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#ffffff";
  return new THREE.Color().setStyle(value, THREE.LinearSRGBColorSpace);
}

export function HeroSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uniformsRef = useRef<HorizonUniforms | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms: HorizonUniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uDpr: { value: dpr },
      uTime: { value: 0 },
      uTop: { value: DESKTOP_TOP },
      uRadius: { value: DESKTOP_RADIUS },
      uFocus: { value: 0 },
      uGlow: { value: new THREE.Color() },
      uBase: { value: new THREE.Color() },
      uMix: { value: new THREE.Vector3(1, 1, 1) },
    };
    applyTheme(uniforms, document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const place = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (width < 2 || height < 2) return;
      renderer.setSize(width, height, false);
      const { radius, cy } = horizonCircle(parent);
      uniforms.uResolution.value.set(width * dpr, height * dpr);
      uniforms.uTop.value = 1 - (cy - radius) / height;
      uniforms.uRadius.value = radius / width;
    };

    const render = () => renderer.render(scene, camera);

    place();
    const resizeObserver = new ResizeObserver(() => {
      place();
      render();
    });
    resizeObserver.observe(parent);

    const dispose = () => {
      resizeObserver.disconnect();
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      uniformsRef.current = null;
    };

    if (reduced) {
      render();
      return dispose;
    }

    let targetFocus = 0;
    const onMouseMove = (event: MouseEvent) => {
      targetFocus = (event.clientX / window.innerWidth) * 2 - 1;
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) targetFocus = (touch.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    let frameId = 0;
    let isVisible = true;
    const started = performance.now();

    const animate = (now: number) => {
      if (!isVisible) {
        frameId = 0;
        return;
      }
      frameId = requestAnimationFrame(animate);
      uniforms.uTime.value = (now - started) / 1000;
      uniforms.uFocus.value += (targetFocus - uniforms.uFocus.value) * POINTER_FOLLOW;
      render();
    };
    frameId = requestAnimationFrame(animate);

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === isVisible) return;
        isVisible = entry.isIntersecting;
        if (isVisible && !frameId) frameId = requestAnimationFrame(animate);
        else if (!isVisible && frameId) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        }
      },
      { threshold: 0.01 },
    );
    visObserver.observe(parent);

    return () => {
      cancelAnimationFrame(frameId);
      visObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      dispose();
    };
  }, []);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (uniforms) applyTheme(uniforms, theme);
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_top,transparent,black_18%)]"
    />
  );
}
