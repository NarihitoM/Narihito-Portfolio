export interface Principle {
  id: string;
  key: string;
  title: string;
  desc: string;
}

export interface Route {
  id: string;
  year: string;
  title: string;
  desc: string;
}

export interface Interest {
  id: string;
  label: string;
}

export interface RawPrinciple {
  id: string;
  num: string;
  title: string;
  desc: string;
}

export interface RawRoute {
  id: string;
  year: string;
  title: string;
  desc?: string;
}

export interface RawInterest {
  id: string;
  label: string;
}

export interface AboutResponse {
  principles: RawPrinciple[];
  routes: RawRoute[];
  interests: RawInterest[];
}

export interface CursorPage<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

export interface Stats {
  yearsExperience: number;
  projectsCount: number;
  satisfiedRate: number;
}
