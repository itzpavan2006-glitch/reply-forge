import { ReactNode } from "react";
import SiteHeader from "./Siteheader";
import SiteFooter from "./Sitefooter";
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}