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

const NAV_ALLOWLIST = new Set(["/", "/about", "/skills", "/experience", "/projects", "/events", "/testimonials", "/#contact"]);

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

    try {
      const { nav, suggestions } = await chatbotApi.stream(trimmed, history, (chunk) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });
      });

      const showNavPill = nav && NAV_ALLOWLIST.has(nav.path) && nav.mode !== "auto";
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

      if (nav && NAV_ALLOWLIST.has(nav.path) && nav.mode === "auto") {
        if (pathname === "/") {
          scrollToTarget(nav.path === "/" ? 0 : nav.path.replace(/^\/#?/, "#"), HEADER_OFFSET);
        } else {
          router.push(nav.path);
        }
      }
    } catch {
      setError(true);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  return { messages, isSending, error, send };
}
