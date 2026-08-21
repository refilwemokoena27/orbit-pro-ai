import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2 } from "lucide-react";
import { generateAi } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OutputPanel, type RefineMode } from "./OutputPanel";

export function NotesSummarizer() {
  const run = useServerFn(generateAi);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!notes.trim()) {
      setError("Please paste your meeting notes first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await run({ data: { kind: "notes" as const, notes } });
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
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Raw meeting notes</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Paste anything — bullet points, transcript fragments or rough notes.
        </p>

        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={16}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting notes here…"
            />
          </div>

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full transition-transform active:scale-95 sm:w-auto"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            {loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </div>
      </section>

      <OutputPanel
        title="Summary & actions"
        description="Summary, action items and decisions — formatted into sections, fully editable."
        value={output}
        onChange={setOutput}
        loading={loading}
        error={error}
        sectioned
        emptyHint="Paste meeting notes to generate a summary"
        placeholder="Your structured summary, action items and decisions will appear here."
        onRegenerate={generate}
        onRefine={refine}
      />
    </div>
  );
}
