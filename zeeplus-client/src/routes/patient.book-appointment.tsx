import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { BookAppointment } from "@/components/patient/BookAppointment";

export const Route = createFileRoute("/patient/book-appointment")({
  component: () => (
    <AppShell allow={["patient"]}>
      <BookAppointment />
    </AppShell>
  ),
});
