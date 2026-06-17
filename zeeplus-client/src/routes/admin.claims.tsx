import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { MonitorClaims } from "@/components/hospitalAdmin/MonitorClaims";

export const Route = createFileRoute("/admin/claims")({
  component: () => (
    <AppShell allow={["admin"]}>
      <MonitorClaims />
    </AppShell>
  ),
});
