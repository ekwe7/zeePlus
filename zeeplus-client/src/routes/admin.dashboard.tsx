import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AdminDashboard } from "@/components/hospitalAdmin/AdminDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  component: () => (
    <AppShell allow={["admin"]}>
      <AdminDashboard />
    </AppShell>
  ),
});
