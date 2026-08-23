export interface ProjectCard {
  projectimg: string;
  title: string;
  year: string;
  category: string;
  role: string;
  status: string;
  description: string;
  url: string;
  github: string;
  featured: boolean;
  chips: string[];
}

export interface FeaturedProject {
  projectimg: string;
  eyebrow: string;
  title: string;
  description: string;
  url: string;
  github: string;
  chips: string[];
  meta: {
    year: string;
    role: string;
    stack: string;
    status: string;
  };
}

export interface FilterTag {
  label: string;
  count: number;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PagedProjectsResponse {
  data: RawProject[];
  featured: RawProject | null;
  categories: { label: string; count: number }[];
  meta: PageMeta;
}

export interface RawProject {
  projectimg: string;
  title: string;
  year: string;
  category: string;
  role: string;
  status: string;
  description: string;
  url: string;
  github: string;
  featured: boolean;
  chips: { name: string }[];
}
