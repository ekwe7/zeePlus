import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "@tanstack/react-router";
import type { Role } from "@/constants/roles";

interface Props {
  children: React.ReactNode;
  allow?: Role[];
}

export function AppShell({ children, allow }: Props) {
  const { isAuthenticated, role } = useAuthStore();

  // Not authenticated — redirect to appropriate auth page
  if (!isAuthenticated || !role) {
    const isAdminRoute = allow?.includes("admin") && allow.length === 1;
    return <Navigate to={isAdminRoute ? "/admin/auth" : "/sign-in"} />;
  }

  // Authenticated but wrong role for this route
  if (allow && !allow.includes(role)) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-destructive">
              You don't have access to this page for the current role.
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
