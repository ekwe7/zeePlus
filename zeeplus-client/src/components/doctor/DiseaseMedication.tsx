import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const DB: Record<string, string[]> = {
  Hypertension: ["Amlodipine 5mg", "Lisinopril 10mg"],
  Diabetes: ["Metformin 500mg", "Insulin Glargine"],
  Migraine: ["Sumatriptan 50mg", "Propranolol 40mg"],
};

export function DiseaseMedication() {
  const [disease, setDisease] = useState("");
  const meds = DB[disease] ?? null;
  return (
    <div>
      <PageHeader title="Disease → Medication" subtitle="Quick reference for common conditions." />
      <Card className="max-w-xl">
        <CardContent className="grid gap-3 p-6">
          <Label>Disease</Label>
          <Input
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            placeholder="Hypertension, Diabetes, Migraine…"
          />
          <Button className="w-fit" onClick={() => {}}>
            Lookup
          </Button>
          {meds && (
            <ul className="list-disc pl-5 text-sm">
              {meds.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
          {disease && !meds && (
            <p className="text-sm text-muted-foreground">No suggestions for "{disease}".</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
