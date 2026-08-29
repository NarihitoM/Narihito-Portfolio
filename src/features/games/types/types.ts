export interface Game {
  id: string;
  name: string;
  pic: string;
  description: string;
  url: string | null;
  type: string;
}

export interface CursorGamesResponse {
  data: Game[];
  nextCursor: string | null;
  total: number;
}
