import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignInPage } from "@/components/auth/SignInPage";
import { useAuthStore } from "@/store/authStore";
import { ROLE_DASHBOARD } from "@/constants/roles";

export const Route = createFileRoute("/sign-in")({
  beforeLoad: () => {
    const { isAuthenticated, role } = useAuthStore.getState();
    if (isAuthenticated && role) {
      throw redirect({ to: ROLE_DASHBOARD[role] });
    }
  },
  component: SignInPage,
});
