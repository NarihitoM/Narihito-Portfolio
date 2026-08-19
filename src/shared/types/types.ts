import type { ReactNode } from "react";

export interface MetaItem {
  key: string;
  value: string;
}

export interface NavEntry {
  direction: string;
  title: string;
  href: string;
}

export interface PageLayoutProps {
  children: ReactNode;
  backLink: string;
  backHref: string;
  breadcrumb: string;
  eyebrow: string;
  title: string;
  deck: string;
  meta: MetaItem[];
  metaLoading?: boolean;
  metaError?: boolean;
  prev: NavEntry;
  next: NavEntry;
}
