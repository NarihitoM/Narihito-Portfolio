export const FEEDBACK_CATEGORIES = ["SUGGESTION", "BUG", "DESIGN", "OTHER"] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export interface FeedbackFormData {
  name: string;
  email: string;
  category: FeedbackCategory;
  message: string;
}
