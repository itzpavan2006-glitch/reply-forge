import { useMemo, useState } from "react";
import AppShell from "@/components/app/Appshell";
import { useClients } from "@/hooks/useclients";
import Pipeline from "@/components/crm/pipeline";
import ClientDrawer from "@/components/crm/clientdrawer";
import NewClientDialog from "@/components/crm/Newclientdialouge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function CRM() {
  const { data: clients = [], isLoading } = useClients();
  const [openId, setOpenId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      clients.filter((c) =>
        [c.name, c.company, c.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [clients, q]
  );

  const totalValue = filtered.reduce(
    (s, c) => s + Number(("value" in c ? (c as Record<string, unknown>)["value"] : 0) || 0),
    0
  );

  const won = filtered.filter((c) => (c.stage as string) === "won").length;

  return (
    <AppShell>
      <section className="px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent font-medium">CRM</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mt-1">
              Pipeline
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {filtered.length} clients · ${totalValue.toLocaleString()} in pipeline · {won} won
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search clients…"
                className="pl-9 h-9 w-56 rounded-full bg-secondary/60 border-transparent"
              />
            </div>
            <NewClientDialog
              trigger={
                <Button size="sm" className="rounded-full">
                  <Plus className="h-4 w-4 mr-1.5" /> New client
                </Button>
              }
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading pipeline…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <h3 className="font-display text-xl">No clients yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first lead to start building your pipeline.
            </p>
            <div className="mt-4 inline-block">
              <NewClientDialog
                trigger={
                  <Button className="rounded-full">
                    <Plus className="h-4 w-4 mr-1.5" /> Add a client
                  </Button>
                }
              />
            </div>
          </div>
        ) : (
          <Pipeline clients={filtered} onOpen={(id) => setOpenId(id)} />
        )}
      </section>

      <ClientDrawer
        clientId={openId}
        open={!!openId}
        onOpenChange={(b) => !b && setOpenId(null)}
      />
    </AppShell>
  );
}