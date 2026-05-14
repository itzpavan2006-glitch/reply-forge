import PageShell from "@/components/layouts/pageshell";
import PricingPreview from "@/components/landing/Pricingpreview";
import { Check, Minus } from "lucide-react";

const rows = [
  ["Generations / month", "5", "Unlimited", "Unlimited"],
  ["All tones", true, true, true],
  ["Saved history", true, true, true],
  ["PDF export", false, true, true],
  ["Brand voice presets", false, false, true],
  ["Team seats", "1", "1", "5"],
  ["Priority support", false, false, true],
] as const;

export default function Pricing() {
  return (
    <PageShell>
      <section className="container pt-16 pb-4">
        <div className="max-w-2xl">
          <p className="text-sm text-accent font-medium">Pricing</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight mt-2 text-balance">
            Pick a plan that grows with you.
          </h1>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready. Cancel any time.</p>
        </div>
      </section>
      <PricingPreview />

      <section className="container pb-24">
        <h2 className="font-display text-3xl font-semibold mb-8">Compare features</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Feature</th>
                <th className="p-4 font-medium">Free</th>
                <th className="p-4 font-medium">Pro</th>
                <th className="p-4 font-medium">Agency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-4 text-muted-foreground">{r[0]}</td>
                  {r.slice(1).map((cell, j) => (
                    <td key={j} className="p-4 text-center">
                      {typeof cell === "boolean" ? (
                        cell ? <Check className="h-4 w-4 text-accent mx-auto" /> : <Minus className="h-4 w-4 text-muted-foreground/50 mx-auto" />
                      ) : <span className="font-medium">{cell}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}