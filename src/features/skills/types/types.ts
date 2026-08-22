export interface Tool {
  id: string;
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

export interface RawSkillGroup {
  id: string;
  label: string;
  items: { id: string; name: string; proficiency: number }[];
}

export interface LearningItem {
  id: string;
  name: string;
  desc: string;
}
