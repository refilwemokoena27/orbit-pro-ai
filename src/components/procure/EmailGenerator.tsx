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
import { OutputPanel } from "./OutputPanel";
import { Kbd } from "./Kbd";
import { useHotkey } from "@/hooks/use-hotkey";

export function EmailGenerator() {
  const run = useServerFn(generateAi);
  const [recipientType, setRecipientType] = useState("Supplier");
  const [tone, setTone] = useState("Formal");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Email details</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Supplier communication, PO follow-ups, negotiations and internal updates.
        </p>

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

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {loading ? "Generating…" : "Generate email"}
            </Button>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Kbd combo="Mod+Enter" /> to generate
            </span>
          </div>
        </div>
      </section>

      <OutputPanel
        title="Generated email"
        description="Editable draft — review before sending."
        value={output}
        onChange={setOutput}
        loading={loading}
        error={error}
        placeholder="Your email draft will appear here."
      />
    </div>
  );
}
