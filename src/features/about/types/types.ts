export interface Principle {
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

export type Interest = string;

export interface RawPrinciple {
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
