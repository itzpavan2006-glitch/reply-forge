import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "@/components/layouts/pageshell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Copy, Download, Save, Sparkles, Loader2 } from "lucide-react";
import { exportTextAsPdf } from "@/lib/exportpdf";

const TONES = ["Professional", "Friendly", "Premium", "Concise"];

type Kind = "proposal" | "reply";

interface GenerateResponse {
  content?: string;
  error?: string;
}

export default function Generate() {
  const [params, setParams] = useSearchParams();
  const initial: Kind =
    params.get("kind") === "reply" ? "reply" : "proposal";
  const [kind, setKind] = useState<Kind>(initial);
  const clientId = params.get("client");
  const [tone, setTone] = useState("Professional");
  const { user } = useAuth();
  const nav = useNavigate();

  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [details, setDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [sender, setSender] = useState(
    user?.user_metadata?.full_name ?? ""
  );

  const [replyType, setReplyType] = useState("General reply");
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const switchKind = (k: Kind) => {
    setKind(k);
    setOutput("");
    setParams({ kind: k });
  };

  const onGenerate = async () => {
    if (kind === "proposal" && !details.trim())
      return toast.error("Add some project details");
    if (kind === "reply" && !message.trim() && !context.trim())
      return toast.error(
        "Paste the client's message or describe what you want to say"
      );

    setLoading(true);
    setOutput("");

    try {
      const payload =
        kind === "proposal"
          ? { kind, tone, client, service, details, budget, timeline, sender }
          : { kind, tone, replyType, message, context, sender };

      const { data, error } = await supabase.functions.invoke("generate", {
        body: payload,
      });

      if (error) throw error;

      const result = data as GenerateResponse;

      if (result?.error) throw new Error(result.error);

      setOutput(result?.content ?? "");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Generation failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!output) return;
    setSaving(true);

    const title =
      kind === "proposal"
        ? `Proposal · ${client || service || "Untitled"}`
        : `Reply · ${replyType}`;

    const inputs =
      kind === "proposal"
        ? { client, service, details, budget, timeline, sender }
        : { replyType, message, context, sender };

    const { error } = await supabase.from("generations").insert({
      user_id: user!.id,
      kind,
      tone,
      title,
      content: output,
      inputs,
      client_id: clientId,
    });

    setSaving(false);

    if (error) return toast.error(error.message);

    if (clientId) {
      await supabase.from("client_activities").insert({
        user_id: user!.id,
        client_id: clientId,
        type: "generation",
        body: title,
      });
    }

    toast.success("Saved to your dashboard");
    nav(clientId ? "/crm" : "/dashboard");
  };

  return (
    <PageShell>
      <section className="container py-12 md:py-16">
        <div className="mb-8">
          <p className="text-sm text-accent font-medium">Generate</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mt-1">
            Draft a {kind === "proposal" ? "proposal" : "client reply"}.
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
            <Tabs
              value={kind}
              onValueChange={(v) => switchKind(v as Kind)}
            >
              <TabsList className="grid grid-cols-2 w-full rounded-full">
                <TabsTrigger value="proposal" className="rounded-full">
                  Proposal
                </TabsTrigger>
                <TabsTrigger value="reply" className="rounded-full">
                  Reply
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {kind === "proposal" ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Client / company">
                      <Input
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="Northwind Studio"
                      />
                    </Field>
                    <Field label="Service type">
                      <Input
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        placeholder="Brand identity"
                      />
                    </Field>
                  </div>
                  <Field label="Project details">
                    <Textarea
                      rows={5}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="What's the brief? Goals, deliverables, anything they mentioned…"
                    />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Budget">
                      <Input
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="$4,800"
                      />
                    </Field>
                    <Field label="Timeline">
                      <Input
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        placeholder="4 weeks"
                      />
                    </Field>
                  </div>
                  <Field label="Your name">
                    <Input
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Reply type">
                    <Select value={replyType} onValueChange={setReplyType}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "General reply",
                          "Inquiry response",
                          "Handle objection",
                          "Negotiate",
                          "Follow-up",
                          "Decline politely",
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Client's message (optional)">
                    <Textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Paste what the client wrote…"
                    />
                  </Field>
                  <Field label="What you want to say">
                    <Textarea
                      rows={4}
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Bullet points or rough notes — we'll polish it."
                    />
                  </Field>
                  <Field label="Your name">
                    <Input
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </Field>
                </>
              )}

              <Button
                onClick={onGenerate}
                disabled={loading}
                className="w-full rounded-full shadow-glow"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft min-h-[420px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Draft</h3>
              {output && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      navigator.clipboard.writeText(output);
                      toast.success("Copied");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      exportTextAsPdf(
                        kind === "proposal"
                          ? `Proposal - ${client || service}`
                          : `Reply - ${replyType}`,
                        output
                      )
                    }
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" /> PDF
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={onSave}
                    disabled={saving}
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    {saving ? "Saving" : "Save"}
                  </Button>
                </div>
              )}
            </div>

            {loading && !output && (
              <div className="flex-1 grid place-items-center text-muted-foreground">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 mx-auto animate-spin text-accent" />
                  <p className="mt-3 text-sm">
                    Crafting a {tone.toLowerCase()} {kind}…
                  </p>
                </div>
              </div>
            )}

            {!loading && !output && (
              <div className="flex-1 grid place-items-center text-center text-muted-foreground">
                <div>
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-accent-soft text-accent grid place-items-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm max-w-xs">
                    Fill out the brief, pick a tone, and your draft will appear
                    here.
                  </p>
                </div>
              </div>
            )}

            {output && (
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground"
              >
                {output}
              </motion.pre>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}