import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PatientDashboard } from "@/components/patient/PatientDashboard";

export const Route = createFileRoute("/patient/dashboard")({
  component: () => (
    <AppShell allow={["patient"]}>
      <PatientDashboard />
    </AppShell>
  ),
});
