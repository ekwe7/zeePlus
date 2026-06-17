import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const PatientDashboard = () => {
  const { id: patientId } = useAuthStore();
  const appointments = useAppointmentStore((state) =>
    state.appointments.filter((apt) => apt.patientId === patientId),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Dashboard" subtitle="Welcome back! Here is your health overview." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Appointments" value={appointments.length} />
        <StatCard label="Pending Actions" value={0} />
        <StatCard label="Messages" value={0} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Appointments</h2>
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No appointments found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {appointments.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <div className="font-semibold">{apt.reason}</div>
                    <div className="text-sm text-muted-foreground">
                      {apt.date} at {apt.time}
                    </div>
                  </div>
                  <Badge
                    variant={
                      apt.status === "CONFIRMED"
                        ? "default"
                        : apt.status === "PENDING"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {apt.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
