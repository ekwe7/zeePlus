import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { DispenseMedication } from "@/components/pharmacist/DispenseMedication";

export const Route = createFileRoute("/pharmacist/dispense")({
  component: () => (
    <AppShell allow={["pharmacist"]}>
      <DispenseMedication />
    </AppShell>
  ),
});
