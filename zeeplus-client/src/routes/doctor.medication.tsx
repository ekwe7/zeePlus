import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { DiseaseMedication } from "@/components/doctor/DiseaseMedication";

export const Route = createFileRoute("/doctor/medication")({
  component: () => (
    <AppShell allow={["doctor"]}>
      <DiseaseMedication />
    </AppShell>
  ),
});
