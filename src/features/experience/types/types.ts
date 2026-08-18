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
