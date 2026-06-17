import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { GenerateReports } from "@/components/hospitalAdmin/GenerateReports";

export const Route = createFileRoute("/admin/reports")({
  component: () => (
    <AppShell allow={["admin"]}>
      <GenerateReports />
    </AppShell>
  ),
});
