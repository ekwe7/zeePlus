import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppointment } from "@/hooks/useAppointment";
import { toast } from "sonner";

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

export function ManageAppointments() {
  const { appointments, update, remove } = useAppointment();
  return (
    <div>
      <PageHeader
        title="Manage Appointments"
        subtitle="Approve, complete, or remove bookings."
      />
      <div className="grid gap-3">
        {appointments.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            No appointments found.
          </p>
        ) : (
          appointments.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{a.code}</span>
                    <Badge variant={statusVariants[a.status]}>{a.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {a.patientName} · {a.date} {a.time}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        update(a.id, { status: "CONFIRMED" });
                        toast.success("Confirmed");
                      }}
                    >
                      Confirm
                    </Button>
                  )}
                  {a.status === "CONFIRMED" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          update(a.id, { status: "COMPLETED" });
                          toast.success("Completed");
                        }}
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          update(a.id, { status: "NO_SHOW" });
                          toast.warning("Marked as No Show");
                        }}
                      >
                        No Show
                      </Button>
                    </>
                  )}
                  {a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        update(a.id, { status: "CANCELLED" });
                        toast.error("Cancelled");
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      remove(a.id);
                      toast.success("Removed from view");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
