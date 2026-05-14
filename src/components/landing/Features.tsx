import { FileText, MessageSquare, Sliders, Download, History, Zap } from "lucide-react";

const items = [
  { icon: FileText, title: "Proposal generator", body: "Brief in, polished proposal out — scope, timeline, pricing, sign-off." },
  { icon: MessageSquare, title: "Reply assistant", body: "Reply to inquiries, objections and follow-ups without staring at a blank page." },
  { icon: Sliders, title: "Tone control", body: "Professional, Friendly, Premium or Concise — match the relationship." },
  { icon: History, title: "Saved history", body: "Every generation is stored privately so you can reuse and iterate." },
  { icon: Download, title: "Export & copy", body: "Copy to clipboard or export as PDF in one click." },
  { icon: Zap, title: "Fast by default", body: "Built on a fast model — first draft in under three seconds." },
];

export default function Features() {
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-sm text-accent font-medium">Everything you need</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 tracking-tight text-balance">
          The quiet upgrade to your client comms.
        </h2>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:shadow-card hover:-translate-y-0.5"
          >
            <div className="h-10 w-10 rounded-xl bg-accent-soft text-accent grid place-items-center">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}