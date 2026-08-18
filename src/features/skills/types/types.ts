export interface Tool {
  name: string;
  icon: string;
  note: string;
  frequency: string;
  proficiency: number;
}

export interface Category {
  eyebrow: string;
  note: string;
  tools: Tool[];
}
