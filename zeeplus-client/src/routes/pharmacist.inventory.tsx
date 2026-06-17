import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ManageStockInventory } from "@/components/pharmacist/ManageStockInventory";

export const Route = createFileRoute("/pharmacist/inventory")({
  component: () => (
    <AppShell allow={["pharmacist"]}>
      <ManageStockInventory />
    </AppShell>
  ),
});
