import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ValidateOTP } from "@/components/pharmacist/ValidateOTP";

export const Route = createFileRoute("/pharmacist/verify-otp")({
  component: () => (
    <AppShell allow={["pharmacist"]}>
      <ValidateOTP />
    </AppShell>
  ),
});
