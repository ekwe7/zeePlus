import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppointment } from "@/hooks/useAppointment";
import { toast } from "sonner";

export function VerifyAppointmentCode() {
  const { appointments } = useAppointment();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const verify = () => {
    const match = appointments.find((a) => a.code.toLowerCase() === code.toLowerCase());
    if (match) {
      setResult(`✔ Valid — ${match.patientName}, ${match.date} ${match.time}`);
      toast.success("Code verified");
    } else {
      setResult("✖ Invalid or unknown code");
      toast.error("Code not found");
    }
  };

  return (
    <div>
      <PageHeader
        title="Verify Appointment Code"
        subtitle="Confirm a patient's appointment before check-in."
      />
      <Card className="max-w-xl">
        <CardContent className="grid gap-3 p-6">
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="APT-1024" />
          <Button className="w-fit" onClick={verify}>
            Verify
          </Button>
          {result && (
            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">{result}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
