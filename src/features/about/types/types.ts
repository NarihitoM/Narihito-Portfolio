export interface Principle {
  key: string;
  title: string;
  desc: string;
}

export interface Route {
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
  year: string;
  title: string;
  desc?: string;
}

export interface AboutResponse {
  principles: RawPrinciple[];
  routes: RawRoute[];
}
