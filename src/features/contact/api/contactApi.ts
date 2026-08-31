import api from "@/shared/lib/api";
import type { ContactFormData } from "../types/types";

export const contactApi = {
  send: (data: ContactFormData, signal?: AbortSignal) =>
    api.post("/public/contact", data, { signal }).then((r) => r.data),
};
