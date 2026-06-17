import { Card, CardContent } from "@/components/ui/card";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
}
export function StatCard({ label, value, hint }: Props) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
