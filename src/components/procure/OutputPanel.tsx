import { useState } from "react";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface OutputPanelProps {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  placeholder: string;
  minRows?: number;
}

export function OutputPanel({
  title,
  description,
  value,
  onChange,
  loading,
  error,
  placeholder,
  minRows = 16,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={copy} disabled={!value || loading}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}

      <div className="relative mt-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={minRows}
          placeholder={placeholder}
          className="resize-y whitespace-pre-wrap font-normal leading-relaxed"
        />
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-card/85 backdrop-blur-[1px]">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5" /> Generating…
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
