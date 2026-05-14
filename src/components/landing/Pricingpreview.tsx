import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  { name: "Free", price: "$0", note: "Try it out", features: ["5 generations / mo", "All tones", "Copy to clipboard"], cta: "Start free", href: "/auth?mode=signup", featured: false },
  { name: "Pro", price: "$12", note: "per month", features: ["Unlimited generations", "PDF export", "Saved history & templates", "Priority models"], cta: "Go Pro", href: "/auth?mode=signup", featured: true },
  { name: "Agency", price: "$39", note: "per month", features: ["Everything in Pro", "5 team seats", "Brand voice presets", "Priority support"], cta: "Talk to us", href: "/contact", featured: false },
];

export default function PricingPreview() {
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-2xl mb-14">
        <p className="text-sm text-accent font-medium">Pricing</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 tracking-tight">Simple, honest plans.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border p-7 transition-smooth ${
              t.featured ? "border-foreground bg-foreground text-background shadow-card" : "border-border bg-card shadow-soft hover:shadow-card"
            }`}
          >
            {t.featured && (
              <span className="absolute -top-3 left-7 rounded-full bg-accent text-accent-foreground text-xs px-3 py-1">Most popular</span>
            )}
            <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold">{t.price}</span>
              <span className={t.featured ? "text-background/70 text-sm" : "text-muted-foreground text-sm"}>{t.note}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className={`h-4 w-4 mt-0.5 ${t.featured ? "text-accent" : "text-accent"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-7 w-full rounded-full ${t.featured ? "bg-background text-foreground hover:bg-background/90" : ""}`}
              variant={t.featured ? "default" : "outline"}
            >
              <Link to={t.href}>{t.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}