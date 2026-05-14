import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="container pb-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground text-background p-12 md:p-20 text-center">
        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-balance">
          Your next client reply,<br />already half-written.
        </h2>
        <p className="mt-5 text-background/70 max-w-xl mx-auto text-balance">
          Join freelancers and small teams using ReplyForge to send better client comms, faster.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 px-7">
            <Link to="/auth?mode=signup">Start free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-background/30 text-background hover:bg-background/10 hover:text-background px-7">
            <Link to="/pricing">See pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}