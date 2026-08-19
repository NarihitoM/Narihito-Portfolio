export interface ProjectCard {
  title: string;
  year: string;
  category: string;
  role: string;
  status: string;
  description: string;
  chips: string[];
}

export interface FeaturedProject {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
  meta: {
    year: string;
    role: string;
    stack: string;
    status: string;
    duration: string;
  };
}

export interface FilterTag {
  label: string;
  count: number;
}

export interface RawProject {
  title: string;
  year: string;
  category: string;
  role: string;
  status: string;
  description: string;
  featured: boolean;
  chips: { name: string }[];
}
