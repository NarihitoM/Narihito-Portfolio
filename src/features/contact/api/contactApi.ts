import api from "@/shared/lib/api";
import type { ContactFormData } from "../types/types";

export const contactApi = {
  send: (data: ContactFormData) =>
    api.post("/public/contact", data).then((r) => r.data),
};
