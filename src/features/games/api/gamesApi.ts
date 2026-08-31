import api from "@/shared/lib/api";
import type { CursorGamesResponse, Game } from "../types/types";

export const gamesApi = {
  list: (limit?: number, signal?: AbortSignal) =>
    api
      .get<{ data: Game[] }>("/public/games", { params: limit ? { limit } : undefined, signal })
      .then((r) => r.data.data),

  listCursor: (cursor?: string, limit = 6, signal?: AbortSignal) =>
    api
      .get<CursorGamesResponse>("/public/games/paged", { params: { cursor, limit }, signal })
      .then((r) => r.data),
};
