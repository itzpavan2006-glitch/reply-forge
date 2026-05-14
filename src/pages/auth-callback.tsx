import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    // Supabase handles the callback automatically
    // Just redirect to dashboard after a short delay to let session set
    const timer = setTimeout(() => {
      nav("/dashboard", { replace: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [nav]);

  return (
    <div className="min-h-screen grid place-items-center bg-paper">
      <div className="text-sm text-muted-foreground animate-pulse">Logging in…</div>
    </div>
  );
}
