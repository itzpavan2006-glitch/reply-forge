import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container pt-20 pb-24 md:pt-28 md:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-accent" />
            New — Reply generator with tone control
          </div>
          <h1 className="font-display mt-6 text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight text-balance">
            Sound thoughtful.<br />
            <span className="italic text-muted-foreground">In seconds.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl text-balance">
            ReplyForge writes the proposals, replies and follow-ups that win clients —
            crafted with the right tone, every time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7 shadow-glow">
              <Link to="/auth?mode=signup">Start writing free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">No credit card · 5 free generations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <MockupCard />
        </motion.div>
      </div>
    </section>
  );
}

function MockupCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full opacity-60" aria-hidden />
      <div className="relative rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-3 text-xs text-muted-foreground">Proposal · Friendly tone</span>
        </div>
        <div className="p-6 space-y-3 text-sm leading-relaxed">
          <p className="font-display text-lg font-semibold">Hi Maya —</p>
          <p className="text-muted-foreground">
            Thanks for sharing the brief. Here's how I'd approach the brand refresh for Northwind:
          </p>
          <div className="space-y-1">
            <p><span className="text-foreground font-medium">Overview.</span> A 4-week sprint covering audit, identity and a lightweight site refresh.</p>
            <p><span className="text-foreground font-medium">Investment.</span> $4,800 — billed in two milestones.</p>
            <p><span className="text-foreground font-medium">Next steps.</span> A 30-min kickoff next Tuesday works well on my end.</p>
          </div>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Generated in 2.4s</span>
            <span className="text-xs px-2 py-1 rounded-full bg-accent-soft text-accent">AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}