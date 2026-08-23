import { useCallback, useRef, useState } from "react";

const CHAR_MS = 16;
const FLASH_MS = 300;

export function useTypewriterInput() {
  const [input, setInput] = useState("");
  const [justHeard, setJustHeard] = useState(false);
  const fullRef = useRef("");
  const pendingRef = useRef("");
  const typingRef = useRef(false);
  const flashTimeoutRef = useRef<number | undefined>(undefined);

  const step = useCallback(() => {
    if (!pendingRef.current.length) {
      typingRef.current = false;
      return;
    }
    const char = pendingRef.current[0];
    pendingRef.current = pendingRef.current.slice(1);
    setInput((prev) => prev + char);
    window.setTimeout(step, CHAR_MS);
  }, []);

  const setFromUser = useCallback((value: string) => {
    setInput(value);
    fullRef.current = value;
    pendingRef.current = "";
    typingRef.current = false;
  }, []);

  const appendTyped = useCallback(
    (text: string) => {
      const needsSpace = fullRef.current.length > 0 && !fullRef.current.endsWith(" ");
      const toAdd = (needsSpace ? " " : "") + text;
      fullRef.current += toAdd;
      pendingRef.current += toAdd;

      setJustHeard(true);
      window.clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = window.setTimeout(() => setJustHeard(false), text.length * CHAR_MS + FLASH_MS);

      if (!typingRef.current) {
        typingRef.current = true;
        step();
      }
    },
    [step],
  );

  return { input, justHeard, setFromUser, appendTyped };
}
