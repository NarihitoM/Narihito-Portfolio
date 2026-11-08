import api from "@/shared/lib/api";
import type { Certificate, CursorCertificatesResponse } from "../types/types";

export const certificatesApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Certificate[] }>("/public/certificates", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listCursor: ({ cursor, limit = 6, issuer, signal }: { cursor?: string; limit?: number; issuer?: string; signal?: AbortSignal }) =>
    api
      .get<CursorCertificatesResponse>("/public/certificates/paged", {
        params: { cursor, limit, ...(issuer && issuer !== "All" ? { issuer } : {}) },
        signal,
      })
      .then((r) => r.data),
};
