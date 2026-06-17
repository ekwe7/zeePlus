import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminAuthPage } from "@/components/auth/AdminAuthPage";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/admin/auth")({
  beforeLoad: () => {
    const { isAuthenticated, role } = useAuthStore.getState();
    if (isAuthenticated && role === "admin") {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: AdminAuthPage,
});
