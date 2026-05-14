import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const { user, signOut } = useAuth();
  const nav2 = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-smooth",
        scrolled ? "bg-background/80 backdrop-blur border-b border-border" : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground grid place-items-center font-display font-semibold">R</div>
          <span className="font-display text-xl font-semibold tracking-tight">ReplyForge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                cn("text-muted-foreground hover:text-foreground transition-smooth", isActive && "text-foreground")
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav2("/dashboard")}>Dashboard</Button>
              <Button variant="outline" size="sm" onClick={async () => { await signOut(); nav2("/"); }}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav2("/auth")}>Log in</Button>
              <Button size="sm" onClick={() => nav2("/auth?mode=signup")}>Get started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}