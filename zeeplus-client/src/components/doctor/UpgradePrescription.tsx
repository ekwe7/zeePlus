import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function UpgradePrescription() {
  const [id, setId] = useState("");
  return (
    <div>
      <PageHeader
        title="Upgrade Prescription"
        subtitle="Modify dosage or change medication."
      />
      <Card className="max-w-xl">
        <CardContent className="grid gap-3 p-6">
          <Label>Prescription ID</Label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="RX-…"
          />
          <Button
            className="w-fit"
            onClick={() => toast.success(`Prescription ${id || "—"} upgraded`)}
          >
            Upgrade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
