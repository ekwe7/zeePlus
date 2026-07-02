import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { useReports } from "@/hooks/useReports";
import { useAppointment } from "@/hooks/useAppointment";
import { formatCurrency } from "@/utils/reportFormatter";
import { toast } from "sonner";

export function ReportViewer() {
  const { claims } = useReports();
  const { appointments } = useAppointment();
  const total = claims.reduce((s, c) => s + c.amount, 0);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Operational and financial summaries."
        actions={
          <Button onClick={() => toast.success("Report exported")}>
            Export PDF
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Claims" value={claims.length} />
        <StatCard label="Total Value" value={formatCurrency(total)} />
        <StatCard label="Appointments" value={appointments.length} />
      </div>
      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="text-sm text-muted-foreground">
            Detailed breakdowns and CSV exports go here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
