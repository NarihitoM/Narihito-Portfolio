export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type ChatFeedbackType = "like" | "dislike";
