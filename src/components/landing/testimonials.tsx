const quotes = [
  { q: "I used to spend an hour on every proposal. Now it's six minutes — and clients say yes more often.", a: "Léa M.", r: "Brand designer" },
  { q: "The tone toggle is the trick. Premium for new clients, Friendly for repeats. It just sounds like me.", a: "Daniel R.", r: "Studio founder" },
  { q: "We replaced three different templates with ReplyForge. Onboarding is faster and writing is consistent.", a: "Priya S.", r: "Agency lead" },
];

export default function Testimonials() {
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-2xl mb-14">
        <p className="text-sm text-accent font-medium">Loved by operators</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 tracking-tight">Quiet wins, every day.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {quotes.map((q, i) => (
          <figure key={i} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
            <blockquote className="font-display text-lg leading-snug text-balance">"{q.q}"</blockquote>
            <figcaption className="mt-5 text-sm">
              <div className="font-medium">{q.a}</div>
              <div className="text-muted-foreground">{q.r}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}