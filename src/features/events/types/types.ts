export interface Event {
  id: string;
  image: string;
  title: string;
  duration: string;
  description: string;
}

export interface CursorEventsResponse {
  data: Event[];
  nextCursor: string | null;
  total: number;
}
