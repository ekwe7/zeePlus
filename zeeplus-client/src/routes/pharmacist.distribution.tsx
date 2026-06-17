import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ManageDrugDistribution } from "@/components/pharmacist/ManageDrugDistribution";

export const Route = createFileRoute("/pharmacist/distribution")({
  component: () => (
    <AppShell allow={["pharmacist"]}>
      <ManageDrugDistribution />
    </AppShell>
  ),
});
