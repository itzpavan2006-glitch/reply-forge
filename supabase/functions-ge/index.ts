declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  env: { get: (key: string) => string | undefined };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_BASE = `
You are ReplyForge, an expert assistant for freelancers, agencies and small businesses.

You write polished client-facing communication.

Output clean plain text only.

Use short paragraphs and helpful sections like:
Overview
Scope
Timeline
Investment
Next Steps

Always sound human, confident and professional.
`;

function buildUserPrompt(payload: Record<string, string>): string {
  const tone = payload.tone || "Professional";

  if (payload.kind === "proposal") {
    return `
Write a ${tone.toLowerCase()} client proposal.

Service type: ${payload.service || "Not specified"}

Client / company:
${payload.client || "Not specified"}

Project details:
${payload.details || "Not specified"}

Budget:
${payload.budget || "Not specified"}

Timeline:
${payload.timeline || "Not specified"}

Sender name:
${payload.sender || "Not specified"}

Structure:
- Short opening
- Overview
- Scope of work
- Timeline
- Investment
- Next steps
- Professional sign-off

Keep it under 350 words.
`;
  }

  return `
Write a ${tone.toLowerCase()} reply to a client.

Reply type:
${payload.replyType || "General"}

Client message:
${payload.message || ""}

Context:
${payload.context || ""}

Sender:
${payload.sender || ""}

Keep it under 200 words.
`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const payload = await req.json();
    const apiKey = Deno.env.get("GROQ_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Groq API key missing" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prompt = buildUserPrompt(payload);

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: SYSTEM_BASE },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Groq API Error:", errorText);
      return new Response(
        JSON.stringify({ error: "Groq request failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "Failed to generate content";

    return new Response(
      JSON.stringify({ content }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Function Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});