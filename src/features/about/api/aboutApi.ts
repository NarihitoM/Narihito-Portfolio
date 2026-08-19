import api from "@/shared/lib/api";
import type { AboutResponse } from "../types/types";

export const aboutApi = {
  get: () => api.get<{ data: AboutResponse }>("/public/about").then((r) => r.data.data),
};
