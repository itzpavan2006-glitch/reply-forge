const steps = [
  { n: "01", title: "Describe the situation", body: "Drop in the brief, the budget, or paste the client's message. A few lines is enough." },
  { n: "02", title: "Pick a tone", body: "Professional, Friendly, Premium, Concise. Switch any time." },
  { n: "03", title: "Send with confidence", body: "Copy, export to PDF, or come back later — every draft is saved." },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary/40 border-y border-border">
      <div className="container py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="text-sm text-accent font-medium">How it works</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 tracking-tight text-balance">
              Three steps to a sent draft.
            </h2>
          </div>
          <ol className="lg:col-span-8 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-2xl bg-card border border-border p-6 shadow-soft">
                <div className="font-display text-3xl text-muted-foreground/60">{s.n}</div>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}