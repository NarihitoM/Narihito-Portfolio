export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  nav?: NavDirective;
  suggestions?: string[];
}

export type ChatFeedbackType = "like" | "dislike";

export interface NavDirective {
  path: string;
  mode: "auto" | "link";
  label: string;
}
