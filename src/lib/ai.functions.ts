import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GLOBAL_RULES = `You are ProcureFlow AI, an assistant for a supply chain and procurement professional.
Rules:
- Always produce structured, professional, workplace-appropriate output.
- Never ask follow-up questions. Never request clarification. Always produce the best possible output from what is given.
- Never use placeholders like [Name], [Company] or [Date]. Write naturally without them.
- Never fabricate facts, numbers, names or deadlines. If uncertain, stay neutral and general.
- Output plain text only (no markdown code fences, no bold markers).`;

const EmailInput = z.object({
  kind: z.literal("email"),
  recipientType: z.string(),
  purpose: z.string(),
  keyPoints: z.string(),
  tone: z.string(),
});

const PlannerInput = z.object({
  kind: z.literal("planner"),
  tasks: z.string(),
  timeframe: z.string(),
});

const NotesInput = z.object({
  kind: z.literal("notes"),
  notes: z.string(),
});

const Input = z.discriminatedUnion("kind", [EmailInput, PlannerInput, NotesInput]);
type Input = z.infer<typeof Input>;

function buildPrompt(data: Input): string {
  if (data.kind === "email") {
    return `Write one complete professional email.
Recipient type: ${data.recipientType}
Purpose: ${data.purpose || "(not specified — infer a reasonable professional purpose from the key points)"}
Key points: ${data.keyPoints || "(none provided — write a brief, courteous message aligned with the purpose)"}
Tone: ${data.tone}

Format exactly:
Subject: <concise subject line>

<greeting line>

<body: 2-4 short paragraphs, clear and structured; use short bullet lines only if the key points are a list>

<professional closing and sign-off>

Adapt wording and warmth to the ${data.tone} tone and to a ${data.recipientType} audience.`;
  }

  if (data.kind === "planner") {
    return `Turn this task list into a realistic, prioritized schedule for the timeframe: ${data.timeframe}.

Tasks (one per line):
${data.tasks}

Rules:
- Order by urgency and any deadlines stated in the task text, NOT by input order.
- Never invent deadlines. Only mention a deadline if the task text contains one.
- ${data.timeframe === "This Week" ? "Group by weekday (Monday to Friday), distributing work realistically." : "Group into Morning, Midday and Afternoon blocks for today."}
- For each task show: task name — Priority: High/Medium/Low — Why: one short rationale.

Format:
<Group heading>
- <task> — Priority: <level> — Why: <short reason>

End with a short line "Focus first:" naming the single most urgent task.`;
  }

  return `Summarize these meeting notes.

NOTES:
${data.notes}

Output exactly these three sections with these headings:

Summary
<2-4 sentences, concise and professional>

Action Items
- <action> (Owner: <name if mentioned, otherwise "Owner not specified">)

Decisions & Deadlines
- <decision or deadline>

Rules:
- Extract only what is present in the notes. Do not fabricate anything.
- If no deadlines are mentioned, write exactly: No deadlines specified
- If there are no action items, write: No action items identified`;
}

export const generateAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          { role: "system", content: GLOBAL_RULES },
          { role: "user", content: buildPrompt(data) },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      let message = body;
      try {
        message = JSON.parse(body)?.error?.message ?? JSON.parse(body)?.message ?? body;
      } catch {
        /* keep raw body */
      }
      if (res.status === 429) throw new Error("Too many requests right now. Please try again shortly.");
      if (res.status === 402)
        throw new Error(message || "AI credits are exhausted. Please add credits to continue.");
      throw new Error(message || `AI request failed (${res.status}).`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("The AI returned an empty response. Please try again.");
    return { text };
  });
