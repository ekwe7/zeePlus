import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/components/auth/RegisterPage";
import { useAuthStore } from "@/store/authStore";
import { ROLE_DASHBOARD } from "@/constants/roles";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    const { isAuthenticated, role } = useAuthStore.getState();
    if (isAuthenticated && role) {
      throw redirect({ to: ROLE_DASHBOARD[role] });
    }
  },
  component: RegisterPage,
});
