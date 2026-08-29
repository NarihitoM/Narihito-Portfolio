import api from "@/shared/lib/api";
import type { ChatFeedbackType, ChatMessage, NavDirective } from "../types/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const chatbotApi = {
  async sendFeedback(messageId: string, message: string, type: ChatFeedbackType, userMessage?: string) {
    await api.post("/public/chat-feedback", { messageId, message, type, userMessage });
  },

  async stream(
    message: string,
    history: ChatMessage[],
    onChunk: (text: string) => void,
  ): Promise<{ nav: NavDirective | null; suggestions: string[] }> {
    const res = await fetch(`${BASE_URL}/chatbot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });

    if (!res.ok || !res.body) {
      throw new Error("Request failed");
    }

    let nav: NavDirective | null = null;
    const navHeader = res.headers.get("X-Nav-Directive");
    if (navHeader) {
      try {
        nav = JSON.parse(navHeader) as NavDirective;
      } catch {
        nav = null;
      }
    }

    let suggestions: string[] = [];
    const suggestionsHeader = res.headers.get("X-Suggestions");
    if (suggestionsHeader) {
      try {
        suggestions = JSON.parse(suggestionsHeader) as string[];
      } catch {
        suggestions = [];
      }
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }

    return { nav, suggestions };
  },

  async transcribe(blob: Blob): Promise<string> {
    const form = new FormData();
    form.append("audio", blob, "audio.webm");

    const res = await fetch(`${BASE_URL}/chatbot/transcribe`, { method: "POST", body: form });
    if (!res.ok) throw new Error("Transcription failed");

    const data = (await res.json()) as { text: string };
    return data.text;
  },
};
