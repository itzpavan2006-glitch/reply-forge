import AppShell from "./Appshell";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ComingSoon({
  eyebrow,
  title,
  description,
  features,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <AppShell>
      <section className="px-4 md:px-8 py-12 max-w-4xl">
        <p className="text-xs uppercase tracking-wider text-accent font-medium">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mt-1">
          {title}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl">{description}</p>

        <div className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="rounded-full">
              <Sparkles className="h-3 w-3 mr-1" /> Shipping next
            </Badge>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 rounded-xl bg-secondary/50 px-3 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}