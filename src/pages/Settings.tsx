import AppShell from "@/components/app/Appshell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  return (
    <AppShell>
      <section className="px-4 md:px-8 py-8 max-w-3xl space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-accent font-medium">
            Settings
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mt-1">
            Account
          </h1>
        </div>
        <Card className="rounded-2xl p-6 shadow-soft">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
              <p className="mt-1">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Name</p>
              <p className="mt-1">{user?.user_metadata?.full_name || "—"}</p>
            </div>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}