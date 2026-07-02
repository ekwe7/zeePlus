import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReports } from "@/hooks/useReports";
import { formatCurrency } from "@/utils/reportFormatter";

const tone: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  APPROVED: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
  FLAGGED: "destructive",
};

export function ClaimsMonitor() {
  const { claims } = useReports();
  return (
    <div>
      <PageHeader title="Claims" subtitle="Monitor insurance claim activity." />
      <div className="grid gap-3">
        {claims.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="font-semibold">{c.patientName}</div>
                <div className="text-sm text-muted-foreground">
                  {c.plan} · {c.submittedAt}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(c.amount)}</div>
                <Badge variant={tone[c.status]}>{c.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
