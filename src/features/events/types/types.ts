export interface Event {
  id: string;
  image: string;
  title: string;
  duration: string;
  description: string;
  type?: string;
  host?: string;
  pinned?: boolean;
}

export interface CursorEventsResponse {
  data: Event[];
  nextCursor: string | null;
  total: number;
  totalAll?: number;
  featured?: Event[];
  types?: EventFilter[];
}

export interface EventFilter {
  label: string;
  count: number;
}
