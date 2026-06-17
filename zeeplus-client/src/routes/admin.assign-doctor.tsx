import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AssignDoctorToPatient } from "@/components/hospitalAdmin/AssignDoctorToPatient";

export const Route = createFileRoute("/admin/assign-doctor")({
  component: () => (
    <AppShell allow={["admin"]}>
      <AssignDoctorToPatient />
    </AppShell>
  ),
});
