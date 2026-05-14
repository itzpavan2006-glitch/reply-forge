declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  env: { get: (key: string) => string | undefined };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_BASE = `You are ReplyForge, an expert assistant for freelancers, agencies and small businesses.
You write polished client-facing communication. Output clean plain text (no markdown headers like ###, no asterisks for bold).
Use short paragraphs and, where helpful, simple line-led sections like "Overview", "Scope", "Timeline", "Investment", "Next steps".
Always sound human, confident and concrete. Never use placeholders like [Name] unless the user provided one.`;

interface ProposalPayload {
  kind: "proposal";
  tone: string;
  service: string;
  client: string;
  details: string;
  budget: string;
  timeline: string;
  sender: string;
}

interface ReplyPayload {
  kind: "reply";
  tone: string;
  replyType: string;
  message: string;
  context: string;
  sender: string;
}

type GeneratePayload = ProposalPayload | ReplyPayload;

function buildUserPrompt(payload: GeneratePayload): string {
  const tone = payload.tone || "Professional";
  if (payload.kind === "proposal") {
    return `Write a ${tone.toLowerCase()} client proposal.

Service type: ${payload.service || "Not specified"}
Client / company: ${payload.client || "Not specified"}
Project details: ${payload.details || "Not specified"}
Budget: ${payload.budget || "Not specified"}
Timeline: ${payload.timeline || "Not specified"}
Sender name: ${payload.sender || "(leave a single placeholder line at the end for signature)"}

Structure: short opening, Overview, Scope of work, Timeline, Investment, Next steps, sign-off.
Keep it under 350 words.`;
  }
  return `Write a ${tone.toLowerCase()} reply to a client message.

Reply type: ${payload.replyType || "General reply"}
Original client message:
"""${payload.message || ""}"""
Context / what I want to say: ${payload.context || "Not specified"}
Sender name: ${payload.sender || ""}

Be direct, kind, and end with a clear next step. Under 200 words.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = (await req.json()) as GeneratePayload;
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = buildUserPrompt(payload);

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_BASE,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (resp.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI request failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const content: string = data?.content?.[0]?.text ?? "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});