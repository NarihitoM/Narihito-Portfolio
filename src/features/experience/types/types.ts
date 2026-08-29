export interface Duty {
  index: string;
  text: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Role {
  id: string;
  period: string;
  type: string;
  title: string;
  org: string;
  desc: string;
  duties: Duty[];
  impact: Metric[];
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
  metrics: Metric[];
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
  dates: string;
  role: string;
  company: string;
  description: string;
}
