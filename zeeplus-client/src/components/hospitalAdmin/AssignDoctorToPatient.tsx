import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useUserAccountsStore } from "@/store/userAccountsStore";
import { useState } from "react";
import { toast } from "sonner";

export function AssignDoctorToPatient() {
  const appointments = useAppointmentStore((state) => state.appointments);
  const update = useAppointmentStore((state) => state.update);
  const users = useUserAccountsStore((state) => state.users);

  const doctors = users.filter((u) => u.role === "doctor");
  const [pick, setPick] = useState<Record<string, string>>({});

  const unassigned = appointments.filter((a) => !a.doctorId);

  return (
    <div>
      <PageHeader title="Assign Doctor" subtitle="Match patients to the right specialist." />
      <div className="grid gap-3">
        {unassigned.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="font-semibold">{a.patientName}</div>
                <div className="text-sm text-muted-foreground">
                  {a.code} · {a.reason}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={pick[a.id] ?? ""}
                  onValueChange={(v) => setPick((p) => ({ ...p, [a.id]: v }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Choose doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.length === 0 ? (
                      <SelectItem value="none" disabled>No doctors found</SelectItem>
                    ) : (
                      doctors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!pick[a.id]}
                  onClick={() => {
                    const docId = pick[a.id];
                    if (!docId) return;
                    const doc = doctors.find((d) => d.id === docId);
                    if (!doc) return;
                    update(a.id, { doctorId: doc.id, doctorName: doc.name, status: "CONFIRMED" });
                    toast.success(`Assigned to ${doc.name}`);
                  }}
                >
                  Assign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {unassigned.length === 0 && (
          <p className="text-muted-foreground">All appointments have an assigned doctor.</p>
        )}
      </div>
    </div>
  );
}
