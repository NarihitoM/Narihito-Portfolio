"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { chatbotApi } from "../api/chatbotApi";
import { scrollToTarget } from "@/shared/lib/lenis";
import type { ChatMessage } from "../types/types";

const HEADER_OFFSET = -72;

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content: "Hey, I'm Narihito's assistant. Ask me anything about his skills, experience, or projects.",
};

const HISTORY_LIMIT = 10;
const MAX_ATTEMPTS = 3;

const NAV_ALLOWLIST = new Set([
  "/",
  "/#about", "/about",
  "/#skills", "/skills",
  "/#experience", "/experience",
  "/#projects", "/projects",
  "/#testimonials", "/testimonials",
  "/#events", "/events",
  "/#contact",
]);

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const history = messages.slice(-HISTORY_LIMIT);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
      { id: crypto.randomUUID(), role: "assistant", content: "" },
    ]);
    setError(false);
    setIsSending(true);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const { nav, suggestions } = await chatbotApi.stream(trimmed, history, (chunk) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + chunk };
            return next;
          });
        });

        const showNavPill = nav && NAV_ALLOWLIST.has(nav.path);
        if (showNavPill || suggestions.length) {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              ...next[next.length - 1],
              nav: showNavPill ? nav! : undefined,
              suggestions,
            };
            return next;
          });
        }
        break;
      } catch (err) {
        const isConnectionError = err instanceof TypeError;
        if (isConnectionError || attempt === MAX_ATTEMPTS) {
          setError(true);
          setMessages((prev) => prev.slice(0, -1));
          break;
        }
        // backend responded but something went wrong mid-reply — retry silently instead
        // of surfacing a scary error for what's usually a transient model/stream hiccup.
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: "" };
          return next;
        });
      }
    }

    setIsSending(false);
  };

  const goTo = (path: string) => {
    if (pathname === "/") {
      scrollToTarget(path === "/" ? 0 : path.replace(/^\/#?/, "#"), HEADER_OFFSET);
    } else {
      router.push(path);
    }
  };

  return { messages, isSending, error, send, goTo };
}
