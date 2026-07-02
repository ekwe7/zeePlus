import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkEligibility } from "@/utils/eligibilityChecker";
import type { EligibilityResult } from "@/utils/eligibilityChecker";
import { useUserAccountsStore } from "@/store/userAccountsStore";

export function PlanEligibilityChecker() {
  const users = useUserAccountsStore((s) => s.users);
  const patients = users.filter((u) => u.role === "patient");

  const [result, setResult] = useState<EligibilityResult | null>(null);

  function handlePatientSelect(patientId: string) {
    const patient = patients.find((p) => p.id === patientId);
    const plan = patient?.eligibilityPlan ?? "BASIC";
    setResult(checkEligibility(plan));
  }

  return (
    <div>
      <PageHeader
        title="Plan Eligibility"
        subtitle="Check coverage for a patient."
      />
      <Card className="max-w-xl">
        <CardContent className="grid gap-3 p-6">
          <Select onValueChange={handlePatientSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {result && (
            <div
              className={`rounded-md border p-4 ${result.eligible ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"}`}
            >
              <div className="font-semibold">
                {result.plan} — {result.coverage}%
              </div>
              <div className="text-sm text-muted-foreground">
                {result.message}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
