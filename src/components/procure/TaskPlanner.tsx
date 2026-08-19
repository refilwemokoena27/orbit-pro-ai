import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, Loader2 } from "lucide-react";
import { generateAi } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
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

export function TaskPlanner() {
  const run = useServerFn(generateAi);
  const [tasks, setTasks] = useState("");
  const [timeframe, setTimeframe] = useState("Today");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!tasks.trim()) {
      setError("Please add at least one task — one per line.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await run({ data: { kind: "planner" as const, tasks, timeframe } });
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
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Your tasks</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          One task per line. Include deadlines inline if you have them.
        </p>

        <div className="mt-5 space-y-4">
          <div className="space-y-2 sm:max-w-56">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tasks">Task list</Label>
            <Textarea
              id="tasks"
              rows={12}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={
                "Chase supplier quote for packaging — due Thursday\nApprove PO 4821\nPrepare vendor scorecard for review\nCall logistics about delayed shipment"
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CalendarClock className="size-4" />
              )}
              {loading ? "Planning…" : "Build schedule"}
            </Button>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Kbd combo="Mod+Enter" /> to generate
            </span>
          </div>
        </div>
      </section>

      <OutputPanel
        title="Prioritized schedule"
        description="Editable plan grouped by time block with priority rationale."
        value={output}
        onChange={setOutput}
        loading={loading}
        error={error}
        placeholder="Your prioritized schedule will appear here."
      />
    </div>
  );
}
