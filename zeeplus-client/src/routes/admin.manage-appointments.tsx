import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ManageAppointments } from "@/components/hospitalAdmin/ManageAppointments";

export const Route = createFileRoute("/admin/manage-appointments")({
  component: () => (
    <AppShell allow={["admin"]}>
      <ManageAppointments />
    </AppShell>
  ),
});
