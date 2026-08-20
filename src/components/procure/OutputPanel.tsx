import { useState } from "react";
import {
  Check,
  Copy,
  Eraser,
  LayoutList,
  Loader2,
  Maximize2,
  Minimize2,
  Pencil,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type RefineMode = "improve" | "shorten" | "expand";

interface OutputPanelProps {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  placeholder: string;
  emptyHint: string;
  minRows?: number;
  sectioned?: boolean;
  onRegenerate?: () => void;
  onRefine?: (mode: RefineMode) => void;
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-3 animate-pulse rounded-full bg-gradient-to-r from-muted via-accent to-muted",
        className,
      )}
    />
  );
}

function confidenceFor(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words >= 120) return { level: "High", tone: "text-emerald-600" };
  if (words >= 45) return { level: "Medium", tone: "text-amber-600" };
  return { level: "Low", tone: "text-muted-foreground" };
}

function parseSections(text: string) {
  const headings = ["Summary", "Action Items", "Decisions & Deadlines"];
  const found: { heading: string; body: string }[] = [];
  const lines = text.split("\n");
  let current: { heading: string; body: string[] } | null = null;
  for (const line of lines) {
    const match = headings.find((h) => line.trim().replace(/[:*#]/g, "").trim() === h);
    if (match) {
      if (current) found.push({ heading: current.heading, body: current.body.join("\n").trim() });
      current = { heading: match, body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) found.push({ heading: current.heading, body: current.body.join("\n").trim() });
  return found;
}

export function OutputPanel({
  title,
  description,
  value,
  onChange,
  loading,
  error,
  placeholder,
  emptyHint,
  minRows = 16,
  sectioned = false,
  onRegenerate,
  onRefine,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const hasValue = Boolean(value.trim());
  const confidence = confidenceFor(value);
  const sections = sectioned && hasValue ? parseSections(value) : [];
  const showSections = sectioned && !editing && sections.length > 0;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {hasValue && !loading ? (
          <span
            className={cn(
              "rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium",
              confidence.tone,
            )}
          >
            Confidence: {confidence.level} · review recommended
          </span>
        ) : null}
      </div>

      {/* Action bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copy}
          disabled={!hasValue || loading}
          className="transition-transform active:scale-95"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={!onRegenerate || loading}
          className="transition-transform active:scale-95"
        >
          <RefreshCw className="size-3.5" />
          Regenerate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRefine?.("improve")}
          disabled={!hasValue || loading}
          className="transition-transform active:scale-95"
        >
          <Wand2 className="size-3.5" />
          Improve
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRefine?.("shorten")}
          disabled={!hasValue || loading}
          className="transition-transform active:scale-95"
        >
          <Minimize2 className="size-3.5" />
          Shorten
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRefine?.("expand")}
          disabled={!hasValue || loading}
          className="transition-transform active:scale-95"
        >
          <Maximize2 className="size-3.5" />
          Expand
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          disabled={!hasValue || loading}
          className="text-muted-foreground transition-transform active:scale-95"
        >
          <Eraser className="size-3.5" />
          Clear
        </Button>
        {sectioned && hasValue ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing((e) => !e)}
            className="ml-auto transition-transform active:scale-95"
          >
            {editing ? <LayoutList className="size-3.5" /> : <Pencil className="size-3.5" />}
            {editing ? "Formatted" : "Edit"}
          </Button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 animate-in fade-in slide-in-from-top-1 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}

      <div className="relative mt-4">
        {loading ? (
          <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-5">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Generating AI response...
            </p>
            <div className="space-y-2.5">
              <Shimmer className="w-1/3" />
              <Shimmer className="w-full" />
              <Shimmer className="w-11/12" />
              <Shimmer className="w-4/5" />
            </div>
            <div className="space-y-2.5 pt-2">
              <Shimmer className="w-1/4" />
              <Shimmer className="w-full" />
              <Shimmer className="w-10/12" />
              <Shimmer className="w-2/3" />
            </div>
          </div>
        ) : !hasValue ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
            <Sparkles className="size-5 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">{emptyHint}</p>
            <p className="max-w-xs text-xs text-muted-foreground">{placeholder}</p>
          </div>
        ) : showSections ? (
          <div className="animate-in fade-in space-y-3">
            {sections.map((section) => (
              <article
                key={section.heading}
                className="rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.heading}
                </h3>
                <div className="mt-2 h-px bg-border" />
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={minRows}
            placeholder={placeholder}
            className="resize-y whitespace-pre-wrap rounded-xl p-4 text-sm leading-relaxed transition-shadow focus-visible:shadow-sm"
          />
        )}
      </div>
    </section>
  );
}
