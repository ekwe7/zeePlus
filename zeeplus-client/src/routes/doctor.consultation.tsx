import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ConductDoctorConsultation } from "@/components/doctor/ConductDoctorConsultation";

export const Route = createFileRoute("/doctor/consultation")({
  component: () => (
    <AppShell allow={["doctor"]}>
      <ConductDoctorConsultation />
    </AppShell>
  ),
});
