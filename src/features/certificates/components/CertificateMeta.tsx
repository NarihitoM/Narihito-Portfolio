import type { Certificate } from "../types/types";

export function CertificateMeta({
  certificate,
  divider = true,
  showId = true,
  className = "",
}: {
  certificate: Certificate;
  divider?: boolean;
  showId?: boolean;
  className?: string;
}) {
  const rows = [
    { label: "ISSUER", value: certificate.issuer },
    { label: "ISSUED", value: certificate.issueDate },
    { label: "EXPIRES", value: certificate.expiryDate },
    { label: "ID", value: showId ? certificate.credentialId : "" },
  ].filter((row) => row.value);

  return (
    <div className={`flex flex-col gap-2 ${divider ? "border-t border-border-glow-soft pt-4" : ""} ${className}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-4">
          <span className="w-[64px] shrink-0 pt-px font-mono text-[10px] tracking-[2px] text-text-muted">{row.label}</span>
          <span className="min-w-0 break-words font-mono text-[12px] leading-[1.5] text-text-secondary">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
