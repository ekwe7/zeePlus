import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { GenerateOTPForMedication } from "@/components/patient/GenerateOTPForMedication";

export const Route = createFileRoute("/patient/generate-otp")({
  component: () => (
    <AppShell allow={["patient"]}>
      <GenerateOTPForMedication />
    </AppShell>
  ),
});
