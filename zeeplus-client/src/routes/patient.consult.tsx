import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ConsultWithDoctor } from "@/components/patient/ConsultWithDoctor";

export const Route = createFileRoute("/patient/consult")({
  component: () => (
    <AppShell allow={["patient"]}>
      <ConsultWithDoctor />
    </AppShell>
  ),
});
