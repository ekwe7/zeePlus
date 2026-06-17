import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { DoctorDashboard } from "@/components/doctor/DoctorDashboard";

export const Route = createFileRoute("/doctor/dashboard")({
  component: () => (
    <AppShell allow={["doctor"]}>
      <DoctorDashboard />
    </AppShell>
  ),
});
