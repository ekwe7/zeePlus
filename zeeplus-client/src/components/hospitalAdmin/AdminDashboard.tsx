import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useUserAccountsStore } from "@/store/userAccountsStore";
import { useReports } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AdminDashboard = () => {
  const appointments = useAppointmentStore((state) => state.appointments);
  const users = useUserAccountsStore((state) => state.users);
  const { claims } = useReports();

  const pendingAppointments = appointments.filter(
    (a) => a.status === "PENDING",
  );
  const activeStaff = users.filter(
    (u) => u.role === "doctor" || u.role === "pharmacist",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of hospital operations and users."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Patients"
          value={users.filter((u) => u.role === "patient").length}
        />
        <StatCard label="Active Staff" value={activeStaff.length} />
        <StatCard label="Total Appointments" value={appointments.length} />
        <StatCard
          label="Pending Claims"
          value={claims.filter((c) => c.status === "PENDING").length}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No appointments recorded.
              </p>
            ) : (
              <ul className="space-y-3">
                {appointments.slice(0, 5).map((apt) => (
                  <li
                    key={apt.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <div className="font-medium">{apt.patientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {apt.date}
                      </div>
                    </div>
                    <Badge
                      variant={
                        apt.status === "PENDING" ? "secondary" : "default"
                      }
                    >
                      {apt.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Database Connectivity</span>
                <Badge variant="default" className="bg-green-600">
                  Stable
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Auth Service</span>
                <Badge variant="default" className="bg-green-600">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Notification Queue</span>
                <Badge variant="default" className="bg-green-600">
                  Idle
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
