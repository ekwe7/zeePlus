import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CheckPlanEligibility } from "@/components/hospitalAdmin/CheckPlanEligibility";

export const Route = createFileRoute("/admin/eligibility")({
  component: () => (
    <AppShell allow={["admin"]}>
      <CheckPlanEligibility />
    </AppShell>
  ),
});
