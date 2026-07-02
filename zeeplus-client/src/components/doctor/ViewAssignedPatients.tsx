import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useAppointment } from "@/hooks/useAppointment";

export function ViewAssignedPatients() {
  const { appointments } = useAppointment();
  const list = appointments.filter((a) => a.doctorId);
  return (
    <div>
      <PageHeader title="Assigned Patients" />
      <div className="grid gap-3">
        {list.length === 0 && (
          <p className="text-muted-foreground">No patients assigned.</p>
        )}
        {list.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-5">
              <div className="font-semibold">{a.patientName}</div>
              <div className="text-sm text-muted-foreground">
                {a.reason} · {a.date} {a.time}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
