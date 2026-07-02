import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-bold">
            M
          </div>
          <span className="font-semibold tracking-tight">MediFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/sign-in">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground text-3xl font-bold">
          M
        </div>
        <h1 className="text-5xl font-semibold tracking-tight">
          Healthcare, simplified.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          MediFlow connects patients, doctors, and pharmacists on one secure
          platform.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register">
            <Button size="lg">Get started</Button>
          </Link>
          <Link to="/sign-in">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-3 text-2xl">🏥</div>
            <h3 className="font-semibold">Book Appointments</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedule visits with your doctor at your convenience.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-3 text-2xl">💊</div>
            <h3 className="font-semibold">Manage Medications</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Track prescriptions and medication history in one place.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-3 text-2xl">🔒</div>
            <h3 className="font-semibold">Secure & Private</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your health data is protected with role-based access control.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MediFlow — Healthcare Management Platform
        <span className="mx-2">·</span>
        {/* <Link to="/admin/auth" className="hover:underline">Admin portal</Link> */}
      </footer>
    </div>
  );
}
