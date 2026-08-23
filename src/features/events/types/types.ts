export interface Event {
  id: string;
  image: string;
  title: string;
  duration: string;
  description: string;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PagedEventsResponse {
  data: Event[];
  meta: PageMeta;
}
