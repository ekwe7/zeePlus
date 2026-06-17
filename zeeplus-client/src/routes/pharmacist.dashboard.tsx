import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PharmacistDashboard } from "@/components/pharmacist/PharmacistDashboard";

export const Route = createFileRoute("/pharmacist/dashboard")({
  component: () => (
    <AppShell allow={["pharmacist"]}>
      <PharmacistDashboard />
    </AppShell>
  ),
});
