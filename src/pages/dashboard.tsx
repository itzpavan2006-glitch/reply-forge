import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/components/app/Appshell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Sparkles, Trash2, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { exportTextAsPdf } from "@/lib/exportpdf";

type Gen = {
  id: string;
  kind: "proposal" | "reply";
  tone: string;
  title: string;
  content: string;
  created_at: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<Gen[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("generations")
      .select("id,kind,tone,title,content,created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Gen[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("generations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((p) => p.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  return (
    <AppShell>
      <section className="px-4 md:px-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm text-accent font-medium">Welcome back</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mt-1">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Hi"} 👋
            </h1>
            <p className="text-muted-foreground mt-2">Your saved drafts live here. Open any to copy or export.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="rounded-full">
              <Link to="/generate?kind=proposal"><FileText className="h-4 w-4 mr-2" />New proposal</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/generate?kind=reply"><MessageSquare className="h-4 w-4 mr-2" />New reply</Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {items.map((g) => (
              <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="rounded-2xl p-6 shadow-soft hover:shadow-card transition-smooth">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="rounded-full">
                      {g.kind === "proposal" ? <FileText className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                      {g.kind}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">{g.tone}</Badge>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(g.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold line-clamp-1">{g.title || "Untitled"}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                    {g.content}
                  </p>
                  <div className="mt-5 flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => { navigator.clipboard.writeText(g.content); toast.success("Copied"); }}>
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => exportTextAsPdf(g.title, g.content)}>
                      <Download className="h-3.5 w-3.5 mr-1.5" /> PDF
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full ml-auto text-destructive hover:text-destructive" onClick={() => onDelete(g.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card/40">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-accent-soft text-accent grid place-items-center">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="font-display text-2xl font-semibold mt-5">No drafts yet</h3>
      <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Generate your first proposal or client reply — it'll appear here.</p>
      <div className="mt-6 flex gap-3 justify-center">
        <Button asChild className="rounded-full"><Link to="/generate?kind=proposal">New proposal</Link></Button>
        <Button asChild variant="outline" className="rounded-full"><Link to="/generate?kind=reply">New reply</Link></Button>
      </div>
    </div>
  );
}