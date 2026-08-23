import { useCallback, useRef, useState } from "react";

const GHOST_HOLD_MS = 450;
const GHOST_FADE_MS = 200;

interface Ghost {
  text: string;
  left: number;
}

export function useTypewriterInput() {
  const [input, setInputState] = useState("");
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [ghostVisible, setGhostVisible] = useState(false);
  const fullRef = useRef("");
  const queueRef = useRef<string[]>([]);
  const processingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fontRef = useRef("");

  const setFont = useCallback((font: string) => {
    fontRef.current = font;
  }, []);

  const measure = useCallback((text: string) => {
    if (!fontRef.current) return 0;
    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return 0;
    ctx.font = fontRef.current;
    return ctx.measureText(text).width;
  }, []);

  const processQueue = useCallback(() => {
    if (processingRef.current) return;
    const next = queueRef.current.shift();
    if (next === undefined) return;
    processingRef.current = true;

    const base = fullRef.current;
    setGhost({ text: next, left: measure(base) });
    requestAnimationFrame(() => setGhostVisible(true));

    window.setTimeout(() => {
      fullRef.current = base + next;
      setInputState(fullRef.current);
      setGhostVisible(false);
      window.setTimeout(() => {
        setGhost(null);
        processingRef.current = false;
        processQueue();
      }, GHOST_FADE_MS);
    }, GHOST_HOLD_MS);
  }, [measure]);

  const setFromUser = useCallback((value: string) => {
    queueRef.current = [];
    processingRef.current = false;
    fullRef.current = value;
    setInputState(value);
    setGhost(null);
    setGhostVisible(false);
  }, []);

  const appendTyped = useCallback(
    (text: string) => {
      const tailBase = fullRef.current + queueRef.current.join("");
      const needsSpace = tailBase.length > 0 && !tailBase.endsWith(" ");
      queueRef.current.push((needsSpace ? " " : "") + text);
      processQueue();
    },
    [processQueue],
  );

  return { input, ghost, ghostVisible, setFromUser, setFont, appendTyped };
}
