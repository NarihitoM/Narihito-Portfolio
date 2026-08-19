export interface Duty {
  index: string;
  text: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Role {
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
  year: string;
  name: string;
  org: string;
}

export interface RawRole {
  period: string;
  type: string;
  title: string;
  org: string;
  desc: string;
  duties: Duty[];
  metrics: Metric[];
  chips: { name: string }[];
}

export interface ExperienceResponse {
  roles: RawRole[];
  education: Education[];
}

export interface ExperienceEntry {
  dates: string;
  role: string;
  company: string;
  description: string;
}
