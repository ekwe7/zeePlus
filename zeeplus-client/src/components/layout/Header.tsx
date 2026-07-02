import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { ROLE_LABELS } from "@/constants/roles";
import { Button } from "@/components/ui/button";

export function Header() {
  const { role, name, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: role === "admin" ? "/admin/auth" : "/sign-in" });
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <Link to="/" className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-bold">
          M
        </div>
        <span className="font-semibold tracking-tight">MediFlow</span>
      </Link>
      <div className="flex items-center gap-3">
        {role && (
          <>
            <div className="text-right text-sm">
              <div className="font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">
                {ROLE_LABELS[role]}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
