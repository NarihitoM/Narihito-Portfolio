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
