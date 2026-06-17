import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ManageFraudAlerts } from "@/components/hospitalAdmin/ManageFraudAlerts";

export const Route = createFileRoute("/admin/fraud-alerts")({
  component: () => (
    <AppShell allow={["admin"]}>
      <ManageFraudAlerts />
    </AppShell>
  ),
});
