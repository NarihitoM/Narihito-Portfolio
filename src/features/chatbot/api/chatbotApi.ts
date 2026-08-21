import api from "@/shared/lib/api";
import type { ChatFeedbackType, ChatMessage } from "../types/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const chatbotApi = {
  async sendFeedback(message: string, type: ChatFeedbackType) {
    await api.post("/public/chat-feedback", { message, type });
  },

  async stream(message: string, history: ChatMessage[], onChunk: (text: string) => void) {
    const res = await fetch(`${BASE_URL}/chatbot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });

    if (!res.ok || !res.body) {
      throw new Error("Request failed");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  },
};
