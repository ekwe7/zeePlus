import { Link, useLocation } from "@tanstack/react-router";
import { useRole } from "@/hooks/useRole";
import type { Role } from "@/constants/roles";

type Item = { label: string; to: string };

const MENUS: Record<Role, Item[]> = {
  patient: [
    { label: "Dashboard", to: "/patient/dashboard" },
    { label: "Book Appointment", to: "/patient/book-appointment" },
    { label: "My Appointments", to: "/patient/my-appointments" },
    { label: "Consult Doctor", to: "/patient/consult" },
    { label: "Generate OTP", to: "/patient/generate-otp" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Manage Users", to: "/admin/users" },
    { label: "Verify Appointment", to: "/admin/verify-appointment" },
    { label: "Assign Doctor", to: "/admin/assign-doctor" },
    { label: "Manage Appointments", to: "/admin/manage-appointments" },
    { label: "Claims", to: "/admin/claims" },
    { label: "Reports", to: "/admin/reports" },
    { label: "Eligibility", to: "/admin/eligibility" },
    { label: "Fraud Alerts", to: "/admin/fraud-alerts" },
  ],
  doctor: [
    { label: "Dashboard", to: "/doctor/dashboard" },
    { label: "Medication", to: "/doctor/medication" },
    { label: "Upload Prescription", to: "/doctor/prescription/upload" },
    { label: "Upgrade Prescription", to: "/doctor/prescription/upgrade" },
    { label: "Consultation", to: "/doctor/consultation" },
  ],
  pharmacist: [
    { label: "Dashboard", to: "/pharmacist/dashboard" },
    { label: "Inventory", to: "/pharmacist/inventory" },
    { label: "Dispense", to: "/pharmacist/dispense" },
    { label: "Verify OTP", to: "/pharmacist/verify-otp" },
    { label: "Distribution", to: "/pharmacist/distribution" },
  ],
};

export function Sidebar() {
  const { role } = useRole();
  const location = useLocation();
  if (!role) return null;
  const items = MENUS[role];

  return (
    <aside className="w-60 shrink-0 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
      <div className="mb-4 px-2 text-xs uppercase tracking-wider opacity-70">Menu</div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const active = location.pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/30"
              }`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
