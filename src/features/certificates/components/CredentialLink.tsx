import type { Certificate } from "../types/types";

export function CredentialLink({ certificate, className = "" }: { certificate: Certificate; className?: string }) {
  if (!certificate.credentialUrl) return null;

  return (
    <a
      href={certificate.credentialUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Verify ${certificate.title} credential`}
      className={`group inline-flex h-10 items-center justify-center gap-1.5 self-start rounded-[4px] border border-border-glow-soft px-4 font-mono text-[11px] tracking-[1.5px] text-text-primary transition-[color,border-color,background-color,transform] duration-150 ease-out hover:border-violet hover:bg-fill-glow-soft hover:text-violet active:scale-95 ${className}`}
    >
      VERIFY CREDENTIAL
      <span className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
    </a>
  );
}
