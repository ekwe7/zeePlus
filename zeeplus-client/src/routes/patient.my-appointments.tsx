import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AppointmentList } from "@/components/patient/AppointmentList";

export const Route = createFileRoute("/patient/my-appointments")({
  component: () => (
    <AppShell allow={["patient"]}>
      <AppointmentList />
    </AppShell>
  ),
});
