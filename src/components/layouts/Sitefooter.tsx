import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground grid place-items-center font-display font-semibold">R</div>
            <span className="font-display text-xl font-semibold">ReplyForge</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            AI-crafted proposals, replies and follow-ups for freelancers and small teams. Sound thoughtful in seconds.
          </p>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-foreground transition-smooth"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub" className="hover:text-foreground transition-smooth"><Github className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground transition-smooth"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><a href="mailto:hello@replyforge.app" className="hover:text-foreground">hello@replyforge.app</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-5 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} ReplyForge. All rights reserved.</p>
          <p>Crafted for thoughtful operators.</p>
        </div>
      </div>
    </footer>
  );
}