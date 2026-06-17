import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { VerifyAppointmentCode } from "@/components/hospitalAdmin/VerifyAppointmentCode";

export const Route = createFileRoute("/admin/verify-appointment")({
  component: () => (
    <AppShell allow={["admin"]}>
      <VerifyAppointmentCode />
    </AppShell>
  ),
});
