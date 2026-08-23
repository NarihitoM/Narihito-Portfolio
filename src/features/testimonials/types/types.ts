export interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  context: string;
  profilePic: string | null;
  url: string | null;
  type: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PagedTestimonialsResponse {
  data: Testimonial[];
  clientsRepresented: number;
  meta: PageMeta;
}
