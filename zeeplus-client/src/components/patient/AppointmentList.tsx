import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppointment } from "@/hooks/useAppointment";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountsStore } from "@/store/userAccountsStore";
import { toast } from "sonner";

const variants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  confirmed: "default",
  pending: "secondary",
  completed: "outline",
  cancelled: "destructive",
};

export function AppointmentList() {
  const email = useAuthStore((s) => s.email);
  const users = useUserAccountsStore((s) => s.users);
  const currentUser = users.find((u) => u.email === email);
  const { getPatientAppointments, update } = useAppointment();
  const appointments = getPatientAppointments(currentUser?.id ?? "");

  return (
    <div>
      <PageHeader
        title="My Appointments"
        subtitle="Track and manage your visits."
      />
      <div className="grid gap-3">
        {appointments.length === 0 && (
          <p className="text-muted-foreground">No appointments yet.</p>
        )}
        {appointments.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{a.code}</span>
                  <Badge variant={variants[a.status]}>{a.status}</Badge>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {a.date} at {a.time} · {a.reason}
                </div>
                {a.doctorName && (
                  <div className="text-sm">Doctor: {a.doctorName}</div>
                )}
              </div>
              {a.status !== "cancelled" && a.status !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    update(a.id, { status: "cancelled" });
                    toast.success("Appointment cancelled");
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
