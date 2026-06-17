import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { UserManagementPanel } from "@/components/hospitalAdmin/UserManagementPanel";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <AppShell allow={["admin"]}>
      <UserManagementPanel />
    </AppShell>
  ),
});
