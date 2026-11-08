export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
  skills?: string[];
  pinned?: boolean;
}

export interface CertificateFilter {
  label: string;
  count: number;
}

export interface CursorCertificatesResponse {
  data: Certificate[];
  nextCursor: string | null;
  total: number;
  totalAll?: number;
  featured?: Certificate[];
  issuers?: CertificateFilter[];
}
