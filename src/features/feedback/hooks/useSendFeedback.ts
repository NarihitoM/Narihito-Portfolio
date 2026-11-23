import { useMutation } from "@tanstack/react-query";
import { feedbackApi } from "../api/feedbackApi";
import type { FeedbackFormData } from "../types/types";

export function useSendFeedback() {
  return useMutation({
    mutationFn: (data: FeedbackFormData) => feedbackApi.send(data),
  });
}
