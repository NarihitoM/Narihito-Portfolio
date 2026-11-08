import { Chip } from "@/shared/components/ui/Chip";
import type { Certificate } from "../types/types";

export function CertificateSkills({ certificate, className = "" }: { certificate: Certificate; className?: string }) {
  if (!certificate.skills?.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {certificate.skills.map((skill) => (
        <Chip key={skill}>{skill}</Chip>
      ))}
    </div>
  );
}
