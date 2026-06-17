import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { UpgradePrescription } from "@/components/doctor/UpgradePrescription";

export const Route = createFileRoute("/doctor/prescription/upgrade")({
  component: () => (
    <AppShell allow={["doctor"]}>
      <UpgradePrescription />
    </AppShell>
  ),
});
