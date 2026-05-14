import { useState } from "react";
import { z } from "zod";
import PageShell from "@/components/layouts/pageshell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setForm({ name: "", email: "", message: "" });
    toast.success("Thanks — we'll get back within one business day.");
  };

  return (
    <PageShell>
      <section className="container py-20 md:py-28 grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-sm text-accent font-medium">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight mt-2 text-balance">
            Say hello.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-md">
            Questions, feature ideas, agency pricing — we read every message.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href="mailto:hello@replyforge.app" className="hover:text-foreground">hello@replyforge.app</a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <Button type="submit" disabled={sending} className="w-full rounded-full">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </PageShell>
  );
}