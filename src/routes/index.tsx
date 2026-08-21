import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  FileText,
  Mail,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  Workflow,
  X,
} from "lucide-react";
import { EmailGenerator } from "@/components/procure/EmailGenerator";
import { TaskPlanner } from "@/components/procure/TaskPlanner";
import { NotesSummarizer } from "@/components/procure/NotesSummarizer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProcureFlow AI — Procurement Productivity Dashboard" },
      {
        name: "description",
        content:
          "AI dashboard for procurement teams: draft supplier emails, prioritize daily tasks and summarize meeting notes in one workspace.",
      },
      { property: "og:title", content: "ProcureFlow AI — Procurement Productivity Dashboard" },
      {
        property: "og:description",
        content:
          "Draft supplier emails, build prioritized schedules and summarize meeting notes with AI — one unified procurement workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    id: "email",
    label: "Email Generator",
    hint: "Supplier & internal emails",
    emoji: "📧",
    icon: Mail,
    title: "Smart Email Generator",
    subtitle: "Turn a few key points into a polished, ready-to-send workplace email.",
  },
  {
    id: "planner",
    label: "Task Planner",
    hint: "Prioritized scheduling",
    emoji: "📅",
    icon: CalendarClock,
    title: "AI Task Planner",
    subtitle: "Convert a raw task list into a realistic, priority-ranked schedule.",
  },
  {
    id: "notes",
    label: "Notes Summarizer",
    hint: "Actions & decisions",
    emoji: "📝",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    subtitle: "Extract a concise summary, action items and decisions from long notes.",
  },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

function Dashboard() {
  const [active, setActive] = useState<ToolId>("email");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = TOOLS.find((t) => t.id === active)!;

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {TOOLS.map((tool) => {
        const isActive = tool.id === active;
        return (
          <button
            key={tool.id}
            onClick={() => {
              setActive(tool.id);
              setMobileOpen(false);
            }}
            title={tool.label}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 active:scale-[0.98]",
              isActive
                ? "bg-primary/10 font-medium text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
            )}
          >
            {isActive && (
              <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-primary" aria-hidden />
            )}
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xs transition-colors group-hover:border-primary/40">
              <span aria-hidden>{tool.emoji}</span>
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block truncate">{tool.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{tool.hint}</span>
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-300 md:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Workflow className="size-4" />
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-semibold tracking-tight">ProcureFlow AI</span>
          )}
        </div>
        {nav}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="m-3 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/70 hover:text-foreground active:scale-[0.98]"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <>
              <PanelLeftClose className="size-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 animate-in fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-sidebar animate-in slide-in-from-left duration-200">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold tracking-tight">ProcureFlow AI</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5 text-muted-foreground" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                ProcureFlow AI
              </h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                Your AI-powered supply chain productivity assistant
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div key={active} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-5 flex items-start gap-3">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-sm"
                aria-hidden
              >
                {current.emoji}
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  {current.title}
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">{current.subtitle}</p>
              </div>
            </div>

            {active === "email" && <EmailGenerator />}
            {active === "planner" && <TaskPlanner />}
            {active === "notes" && <NotesSummarizer />}
          </div>
        </main>

        <footer className="border-t border-border bg-muted/40 px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="size-3.5 shrink-0" />
            AI-generated content may not always be accurate. Please review before use.
          </p>
        </footer>
      </div>
    </div>
  );
}
