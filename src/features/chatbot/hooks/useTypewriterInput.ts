import { useCallback, useEffect, useRef, useState } from "react";

const GHOST_HOLD_MS = 200;
const GHOST_FADE_MS = 100;

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
  const timersRef = useRef<number[]>([]);
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

  const processQueueRef = useRef<() => void>(() => {});

  const processQueue = useCallback(() => {
    if (processingRef.current) return;
    const next = queueRef.current.shift();
    if (next === undefined) return;
    processingRef.current = true;

    const base = fullRef.current;
    setGhost({ text: next, left: measure(base) });
    requestAnimationFrame(() => setGhostVisible(true));

    timersRef.current.push(
      window.setTimeout(() => {
        fullRef.current = base + next;
        setInputState(fullRef.current);
        setGhostVisible(false);
        timersRef.current.push(
          window.setTimeout(() => {
            setGhost(null);
            processingRef.current = false;
            processQueueRef.current();
          }, GHOST_FADE_MS),
        );
      }, GHOST_HOLD_MS),
    );
  }, [measure]);

  useEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);

  const setFromUser = useCallback((value: string) => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
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

  const getFullText = useCallback(() => fullRef.current + queueRef.current.join(""), []);

  return { input, ghost, ghostVisible, setFromUser, setFont, appendTyped, getFullText };
}
