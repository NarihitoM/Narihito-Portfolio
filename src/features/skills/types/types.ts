export interface Tool {
  id: string;
  name: string;
  icon: string;
  note: string;
  frequency: string;
  proficiency: number;
}

export interface Category {
  id: string;
  eyebrow: string;
  note: string;
  tools: Tool[];
  toolsTotal: number;
}

export interface RawSkillItem {
  id: string;
  name: string;
  proficiency: number;
  pinned?: boolean;
}

export interface RawSkillGroup {
  id: string;
  label: string;
  items: RawSkillItem[];
  itemsTotal: number;
}

export interface LearningItem {
  id: string;
  name: string;
  desc: string;
}

export interface CursorPage<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

export interface CursorSlice<T> {
  data: T[];
  nextCursor: string | null;
}
