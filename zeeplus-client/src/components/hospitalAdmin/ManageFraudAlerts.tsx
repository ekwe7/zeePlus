import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/useReports";
import { formatCurrency } from "@/utils/reportFormatter";
import { toast } from "sonner";

export function ManageFraudAlerts() {
  const { claims, updateClaim } = useReports();
  const flagged = claims.filter((c) => c.status === "FLAGGED");
  return (
    <div>
      <PageHeader title="Fraud Alerts" subtitle="Investigate suspicious claims." />
      <div className="grid gap-3">
        {flagged.length === 0 && <p className="text-muted-foreground">No flagged claims.</p>}
        {flagged.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{c.patientName}</span>
                  <Badge variant="destructive">{c.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {c.plan} · {formatCurrency(c.amount)} · {c.submittedAt}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateClaim(c.id, { status: "APPROVED" });
                    toast.success("Approved");
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    updateClaim(c.id, { status: "REJECTED" });
                    toast.success("Rejected");
                  }}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
