import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/hooks/useInventory";
import { toast } from "sonner";

export function ManageStockInventory() {
  const { items, update } = useInventory();
  return (
    <div>
      <PageHeader title="Inventory" subtitle="Track and restock medications." />
      <div className="grid gap-3">
        {items.map((i) => {
          const low = i.stock < i.threshold;
          return (
            <Card key={i.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{i.name}</span>
                    {low && <Badge variant="destructive">Low</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {i.category} · expires {i.expiry}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">
                      {i.stock} {i.unit}
                    </div>
                    <div className="text-xs text-muted-foreground">threshold {i.threshold}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      update(i.id, { stock: i.stock + 50 });
                      toast.success("Restocked +50");
                    }}
                  >
                    Restock
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
