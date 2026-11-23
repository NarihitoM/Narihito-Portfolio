import api from "@/shared/lib/api";
import type { FeedbackFormData } from "../types/types";

export const feedbackApi = {
  send: (data: FeedbackFormData) => api.post("/public/feedback", data, { timeout: 30000 }).then((r) => r.data),
  verifyEmail: (email: string) =>
    api.post<{ deliverable: boolean }>("/public/verify-email", { email }).then((r) => r.data.deliverable),
};
