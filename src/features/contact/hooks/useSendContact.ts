import { useMutation } from "@tanstack/react-query";
import { contactApi } from "../api/contactApi";
import type { ContactFormData } from "../types/types";

export function useSendContact() {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactApi.send(data),
  });
}
