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
