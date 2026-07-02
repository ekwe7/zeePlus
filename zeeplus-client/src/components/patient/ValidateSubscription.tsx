import { useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { checkEligibility } from "@/utils/eligibilityChecker";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountsStore } from "@/store/userAccountsStore";

export function ValidateSubscription() {
  const email = useAuthStore((s) => s.email);
  const users = useUserAccountsStore((s) => s.users);

  const currentUser = users.find((u) => u.email === email);
  const eligibilityPlan = currentUser?.eligibilityPlan ?? "BASIC";

  const result = useMemo(
    () => checkEligibility(eligibilityPlan),
    [eligibilityPlan],
  );

  return (
    <div>
      <PageHeader
        title="Validate Subscription"
        subtitle="Check if your plan covers a service."
      />
      <Card className="max-w-xl">
        <CardContent className="grid gap-3 p-6">
          <div className="text-sm text-muted-foreground">
            Your plan:{" "}
            <span className="font-semibold text-foreground">
              {eligibilityPlan}
            </span>
          </div>
          <div
            className={`rounded-md border p-4 ${result.eligible ? "border-success/40 bg-success/10 text-success" : "border-destructive/40 bg-destructive/10 text-destructive"}`}
          >
            <div className="font-semibold">{result.plan}</div>
            <div className="text-sm">{result.message}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
