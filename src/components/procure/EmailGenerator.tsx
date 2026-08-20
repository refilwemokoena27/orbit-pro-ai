import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Wand2 } from "lucide-react";
import { generateAi } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OutputPanel, type RefineMode } from "./OutputPanel";

const TEMPLATES = [
  {
    label: "PO Follow-up",
    emoji: "📦",
    recipientType: "Supplier",
    tone: "Formal",
    purpose: "Follow up on the status of purchase order 4821",
    keyPoints:
      "Order was confirmed three weeks ago\nDelivery date has not been communicated\nRequest a firm dispatch date\nAsk for tracking details once shipped",
  },
  {
    label: "Payment Reminder",
    emoji: "💳",
    recipientType: "Supplier",
    tone: "Formal",
    purpose: "Remind the supplier that an invoice remains unpaid on our account",
    keyPoints:
      "Invoice was submitted without a valid PO reference\nPayment run happens every Friday\nRequest a corrected invoice to release payment\nOffer a call if anything is unclear",
  },
  {
    label: "Supplier Delay",
    emoji: "⏳",
    recipientType: "Supplier",
    tone: "Persuasive",
    purpose: "Escalate a delayed shipment and agree a recovery plan",
    keyPoints:
      "Shipment is past the agreed delivery window\nDelay is affecting production planning\nRequest a partial shipment of critical items\nAsk for a written recovery plan this week",
  },
  {
    label: "Internal Update",
    emoji: "📣",
    recipientType: "Internal Team",
    tone: "Friendly",
    purpose: "Share a weekly procurement status update with the team",
    keyPoints:
      "Two supplier contracts renewed\nOne shipment delayed, recovery plan in progress\nCost savings tracking slightly ahead of target\nFlag actions needed from the team",
  },
] as const;

export function EmailGenerator() {
  const run = useServerFn(generateAi);
  const [recipientType, setRecipientType] = useState("Supplier");
  const [tone, setTone] = useState("Formal");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyTemplate = (t: (typeof TEMPLATES)[number]) => {
    setRecipientType(t.recipientType);
    setTone(t.tone);
    setPurpose(t.purpose);
    setKeyPoints(t.keyPoints);
    setActiveTemplate(t.label);
    setError(null);
  };

  const generate = async () => {
    if (!purpose.trim() && !keyPoints.trim()) {
      setError("Please add an email purpose or a few key points so we know what to write.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await run({
        data: { kind: "email" as const, recipientType, purpose, keyPoints, tone },
      });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refine = async (mode: RefineMode) => {
    if (!output.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await run({ data: { kind: "refine" as const, mode, text: output } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Email details</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Supplier communication, PO follow-ups, negotiations and internal updates.
        </p>

        <div className="mt-5">
          <Label className="text-xs text-muted-foreground">Quick templates</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => applyTemplate(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
                  activeTemplate === t.label
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-muted/40 text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="mr-1">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient type</Label>
              <Select value={recipientType} onValueChange={setRecipientType}>
                <SelectTrigger id="recipient">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Internal Team">Internal Team</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Follow up on delayed purchase order 4821"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keypoints">Key points</Label>
            <Textarea
              id="keypoints"
              rows={7}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"Delivery was due last week\nNeed a revised delivery date\nAsk about partial shipment"}
            />
          </div>

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full transition-transform active:scale-95 sm:w-auto"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </div>
      </section>

      <OutputPanel
        title="Generated email"
        description="Editable draft — review before sending."
        value={output}
        onChange={setOutput}
        loading={loading}
        error={error}
        emptyHint="Enter details to generate a professional email"
        placeholder="Pick a quick template or add your purpose and key points, then generate."
        onRegenerate={generate}
        onRefine={refine}
      />
    </div>
  );
}
