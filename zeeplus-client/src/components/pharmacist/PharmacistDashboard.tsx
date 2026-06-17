import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useInventory } from "@/hooks/useInventory";

export function PharmacistDashboard() {
  const { items } = useInventory();
  const low = items.filter((i) => i.stock < i.threshold).length;
  return (
    <div>
      <PageHeader title="Pharmacy Console" subtitle="Stock and dispense overview." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="SKUs in stock" value={items.length} />
        <StatCard label="Low stock" value={low} hint="Below threshold" />
        <StatCard label="Dispensed today" value={28} />
      </div>
    </div>
  );
}
