"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const parent = canvas.parentElement!;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.IcosahedronGeometry(1.5, 3);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0x8a8a8a,
      transparent: true,
      opacity: 0.55,
    });
    const sphere = new THREE.LineSegments(wireframe, material);
    scene.add(sphere);

    let targetX = 0;
    let targetY = 0;
    let frameId = 0;

    const handlePointer = (nx: number, ny: number) => {
      targetY = nx * 0.6;
      targetX = ny * 0.4;
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      handlePointer(nx, ny);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const rect = parent.getBoundingClientRect();
      const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
      handlePointer(nx, ny);
    };

    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return;
      const nx = THREE.MathUtils.clamp(event.gamma / 45, -1, 1);
      const ny = THREE.MathUtils.clamp((event.beta - 45) / 45, -1, 1);
      handlePointer(nx, ny);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("deviceorientation", onDeviceOrientation);

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!reduced) {
        sphere.rotation.y += 0.0015;
        sphere.rotation.x += 0.0004;
        sphere.rotation.y += (targetY - sphere.rotation.y) * 0.03;
        sphere.rotation.x += (targetX - sphere.rotation.x) * 0.03;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      wireframe.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
