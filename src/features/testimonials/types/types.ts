export interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  context: string;
  profilePic: string | null;
  url: string | null;
}

export interface Stat {
  value: string;
  label: string;
}
