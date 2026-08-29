export interface GameLink {
  type: string;
  url: string;
}

export interface Game {
  id: string;
  name: string;
  pic: string;
  description: string;
  type: string;
  links: GameLink[];
}

export interface CursorGamesResponse {
  data: Game[];
  nextCursor: string | null;
  total: number;
}
