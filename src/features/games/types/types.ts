export interface GameLink {
  type: string;
  url: string;
}

export type GameStatus = "LIVE" | "COMING SOON" | "CANCELLED";

export interface Game {
  id: string;
  name: string;
  pic: string;
  description: string;
  type: string;
  status?: GameStatus;
  pinned?: boolean;
  links: GameLink[];
  chips: { name: string }[];
}

export interface CursorGamesResponse {
  data: Game[];
  nextCursor: string | null;
  total: number;
  favourites?: number;
  featured?: Game[];
}
