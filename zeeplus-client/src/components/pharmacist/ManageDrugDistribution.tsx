import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useInventory } from "@/hooks/useInventory";

export function ManageDrugDistribution() {
  const { items } = useInventory();
  return (
    <div>
      <PageHeader
        title="Drug Distribution"
        subtitle="Allocate stock across wards & branches."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <Card key={i.id}>
            <CardContent className="p-5">
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-muted-foreground">
                In stock: {i.stock} {i.unit}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-muted py-2">
                  Ward A<br />
                  <span className="font-semibold">
                    {Math.floor(i.stock * 0.4)}
                  </span>
                </div>
                <div className="rounded-md bg-muted py-2">
                  Ward B<br />
                  <span className="font-semibold">
                    {Math.floor(i.stock * 0.3)}
                  </span>
                </div>
                <div className="rounded-md bg-muted py-2">
                  Branch
                  <br />
                  <span className="font-semibold">
                    {Math.floor(i.stock * 0.3)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
