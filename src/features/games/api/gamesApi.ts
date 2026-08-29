import api from "@/shared/lib/api";
import type { CursorGamesResponse, Game } from "../types/types";

export const gamesApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Game[] }>("/public/games", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listCursor: (cursor?: string, limit = 6) =>
    api
      .get<CursorGamesResponse>("/public/games/paged", { params: { cursor, limit } })
      .then((r) => r.data),
};
