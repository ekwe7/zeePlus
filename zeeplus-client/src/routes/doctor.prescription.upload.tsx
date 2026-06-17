import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { UploadPrescription } from "@/components/doctor/UploadPrescription";

export const Route = createFileRoute("/doctor/prescription/upload")({
  component: () => (
    <AppShell allow={["doctor"]}>
      <UploadPrescription />
    </AppShell>
  ),
});
