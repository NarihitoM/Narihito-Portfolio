import { CertificatesPage } from "@/features/certificates/components/CertificatesPage";
import { SmoothScrollProvider } from "@/shared/components/layout/SmoothScrollProvider";

export default function CertificatesRoute() {
  return (
    <SmoothScrollProvider>
      <CertificatesPage />
    </SmoothScrollProvider>
  );
}
