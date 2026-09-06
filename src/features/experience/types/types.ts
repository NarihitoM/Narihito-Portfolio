export interface Duty {
  index: string;
  text: string;
}

export interface Role {
  id: string;
  period: string;
  type: string;
  title: string;
  org: string;
  desc: string;
  pinned?: boolean;
  duties: Duty[];
  chips: string[];
}

export interface Education {
  id: string;
  year: string;
  name: string;
  org: string;
}

export interface RawRole {
  id: string;
  period: string;
  type: string;
  title: string;
  org: string;
  desc: string;
  pinned?: boolean;
  duties: Duty[];
  chips: { name: string }[];
}

export interface ExperienceResponse {
  roles: RawRole[];
  education: Education[];
}

export interface CursorPage<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

export interface ExperienceEntry {
  id: string;
  dates: string;
  role: string;
  company: string;
  description: string;
}
