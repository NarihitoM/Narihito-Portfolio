export interface TestimonialSocial {
  type: string;
  url: string;
}

export interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  context: string;
  profilePic: string | null;
  url: string | null;
  socials: TestimonialSocial[];
  type: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface CursorTestimonialsResponse {
  data: Testimonial[];
  nextCursor: string | null;
  total: number;
  clientsRepresented: number;
}
