import PageShell from "@/components/layouts/pageshell";

export default function About() {
  return (
    <PageShell>
      <section className="container py-20 md:py-28 max-w-3xl">
        <p className="text-sm text-accent font-medium">About</p>
        <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight mt-2 text-balance">
          Built for the people behind the work.
        </h1>
        <div className="mt-10 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            ReplyForge started with a simple frustration: spending an hour writing a proposal that should take ten minutes,
            then second-guessing the tone for another twenty.
          </p>
          <p>
            We think client communication is one of the highest-leverage things a small team does. So we built a tool that
            handles the drafting, while keeping you in full control of the tone, the details and the send button.
          </p>
          <p>
            No bloat. No 14-step onboarding. Just a fast, quiet utility you'll actually open every week.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          <Stat n="3.2s" l="Avg first draft" />
          <Stat n="4 tones" l="Match the relationship" />
          <Stat n="100%" l="Yours to edit" />
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="font-display text-4xl font-semibold">{n}</div>
      <div className="text-sm text-muted-foreground mt-1">{l}</div>
    </div>
  );
}