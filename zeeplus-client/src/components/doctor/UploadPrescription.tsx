import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function UploadPrescription() {
  const [form, setForm] = useState({ patient: "", disease: "", meds: "" });
  return (
    <div>
      <PageHeader
        title="Upload Prescription"
        subtitle="Issue a new prescription to a patient."
      />
      <Card className="max-w-2xl">
        <CardContent className="grid gap-3 p-6">
          <div className="grid gap-1.5">
            <Label>Patient name</Label>
            <Input
              value={form.patient}
              onChange={(e) => setForm({ ...form, patient: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Disease / diagnosis</Label>
            <Input
              value={form.disease}
              onChange={(e) => setForm({ ...form, disease: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Medications (one per line)</Label>
            <Textarea
              rows={5}
              value={form.meds}
              onChange={(e) => setForm({ ...form, meds: e.target.value })}
            />
          </div>
          <Button
            className="w-fit"
            onClick={() => {
              toast.success("Prescription uploaded");
              setForm({ patient: "", disease: "", meds: "" });
            }}
          >
            Upload
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
