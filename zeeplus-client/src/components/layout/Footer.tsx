export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-3 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} MediFlow — Healthcare Management Platform
    </footer>
  );
}
