import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppointment } from "@/hooks/useAppointment";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountsStore } from "@/store/userAccountsStore";
import { toast } from "sonner";

export function BookAppointment() {
  const { add } = useAppointment();
  const { email, name } = useAuthStore();
  const { users } = useUserAccountsStore();
  const currentUser = users.find((u) => u.email === email);
  const [form, setForm] = useState({ date: "", time: "", reason: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = "APT-" + Math.floor(1000 + Math.random() * 9000);
    add({
      id: crypto.randomUUID(),
      code,
      patientId: currentUser?.id ?? "",
      patientName: currentUser?.name ?? name,
      date: form.date,
      time: form.time,
      reason: form.reason,
      status: "PENDING",
    });
    toast.success(`Appointment booked: ${code}`);
    setForm({ date: "", time: "", reason: "" });
  };

  return (
    <div>
      <PageHeader title="Book Appointment" subtitle="Schedule a visit with our specialists." />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="d">Date</Label>
                <Input
                  id="d"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="t">Time</Label>
                <Input
                  id="t"
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="r">Reason</Label>
              <Textarea
                id="r"
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Describe the reason for your visit"
              />
            </div>
            <Button type="submit" className="w-fit" disabled={!currentUser}>
              Book appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
