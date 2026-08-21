"use client";

import { useState } from "react";
import { chatbotApi } from "../api/chatbotApi";
import type { ChatMessage } from "../types/types";

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hey, I'm Narihito's assistant. Ask me anything about his skills, experience, or projects.",
};

const HISTORY_LIMIT = 10;

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(false);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const history = messages.slice(-HISTORY_LIMIT);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);
    setError(false);
    setIsSending(true);

    try {
      await chatbotApi.stream(trimmed, history, (chunk) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });
      });
    } catch {
      setError(true);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  return { messages, isSending, error, send };
}
