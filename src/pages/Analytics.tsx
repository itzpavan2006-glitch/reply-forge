import { useMemo } from "react";
import AppShell from "@/components/app/Appshell";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClients } from "@/hooks/useclients";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Trophy, FileText, DollarSign } from "lucide-react";

const CLOSED_STAGES = ["won", "lost"] as const;
type ClientStage = "new_lead" | "proposal_sent" | "negotiation" | "won" | "lost";

interface Generation {
  id: string;
  kind: string;
  tone: string;
  created_at: string;
}

function KPI({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  hint?: string;
}) {
  return (
    <Card className="rounded-2xl p-5 shadow-soft border-border">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {value}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </Card>
  );
}

export default function Analytics() {
  const { data: clients = [] } = useClients();

  const { data: gens = [] } = useQuery<Generation[]>({
    queryKey: ["generations-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("id,kind,tone,created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Generation[];
    },
  });

  const totals = useMemo(() => {
    const won = clients.filter((c) => (c.stage as string) === "won");
    const lost = clients.filter((c) => (c.stage as string) === "lost");
    const closed = won.length + lost.length;
    const winRate = closed ? Math.round((won.length / closed) * 100) : 0;

    const pipelineValue = clients
      .filter((c) => !(CLOSED_STAGES as readonly string[]).includes(c.stage as string))
      .reduce((s, c) => s + Number(("value" in c ? (c as Record<string, unknown>)["value"] : 0) || 0), 0);

    const wonValue = won.reduce(
      (s, c) => s + Number(("value" in c ? (c as Record<string, unknown>)["value"] : 0) || 0),
      0
    );

    return { winRate, pipelineValue, wonValue, drafts: gens.length };
  }, [clients, gens]);

  const series = useMemo(() => {
    const buckets: Record<string, number> = {};
    gens.forEach((g: Generation) => {
      const d = new Date(g.created_at);
      const k = `${d.getMonth() + 1}/${d.getDate()}`;
      buckets[k] = (buckets[k] || 0) + 1;
    });
    return Object.entries(buckets)
      .slice(-14)
      .map(([date, count]) => ({ date, count }));
  }, [gens]);

  const funnel: { stage: string; count: number }[] = [
    { stage: "New", count: clients.filter((c) => (c.stage as string) === "new_lead").length },
    { stage: "Sent", count: clients.filter((c) => (c.stage as string) === "proposal_sent").length },
    { stage: "Negotiation", count: clients.filter((c) => (c.stage as string) === "negotiation").length },
    { stage: "Won", count: clients.filter((c) => (c.stage as string) === "won").length },
    { stage: "Lost", count: clients.filter((c) => (c.stage as string) === "lost").length },
  ];

  return (
    <AppShell>
      <section className="px-4 md:px-8 py-8 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-accent font-medium">
            Analytics
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mt-1">
            Business intelligence
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            How your pipeline and AI drafting are performing.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI
            label="Win rate"
            value={`${totals.winRate}%`}
            icon={Trophy}
            hint="Won / closed"
          />
          <KPI
            label="Pipeline value"
            value={`$${totals.pipelineValue.toLocaleString()}`}
            icon={DollarSign}
            hint="Open deals"
          />
          <KPI
            label="Closed-won"
            value={`$${totals.wonValue.toLocaleString()}`}
            icon={TrendingUp}
          />
          <KPI label="AI drafts" value={`${totals.drafts}`} icon={FileText} />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="rounded-2xl p-5 shadow-soft lg:col-span-2">
            <h3 className="font-display text-lg mb-4">Drafting activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--accent))"
                    fill="url(#g)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-2xl p-5 shadow-soft">
            <h3 className="font-display text-lg mb-4">Pipeline funnel</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}