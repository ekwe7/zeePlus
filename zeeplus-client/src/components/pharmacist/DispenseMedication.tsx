import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function DispenseMedication() {
  const [rx, setRx] = useState("");
  return (
    <div>
      <PageHeader
        title="Dispense"
        subtitle="Hand off medication to the patient."
      />
      <Card className="max-w-xl">
        <CardContent className="grid gap-3 p-6">
          <Label>Prescription ID</Label>
          <Input
            value={rx}
            onChange={(e) => setRx(e.target.value)}
            placeholder="RX-…"
          />
          <Button
            className="w-fit"
            onClick={() => toast.success(`Dispensed ${rx || "prescription"}`)}
          >
            Dispense
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
