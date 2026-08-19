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
    icon: Mail,
    title: "Smart Email Generator",
    subtitle: "Turn a few key points into a polished, ready-to-send workplace email.",
  },
  {
    id: "planner",
    label: "Task Planner",
    hint: "Prioritized scheduling",
    icon: CalendarClock,
    title: "AI Task Planner",
    subtitle: "Convert a raw task list into a realistic, priority-ranked schedule.",
  },
  {
    id: "notes",
    label: "Notes Summarizer",
    hint: "Actions & decisions",
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
        const Icon = tool.icon;
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
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && (
              <span className="min-w-0">
                <span className="block truncate font-medium">{tool.label}</span>
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
          "hidden shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Workflow className="size-4" />
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-semibold tracking-tight">ProcureFlow AI</span>
          )}
        </div>
        {nav}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="m-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
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
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-sidebar">
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
        <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4 sm:px-6">
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5 text-muted-foreground" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
              {current.title}
            </h1>
            <p className="truncate text-xs text-muted-foreground">{current.subtitle}</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {active === "email" && <EmailGenerator />}
          {active === "planner" && <TaskPlanner />}
          {active === "notes" && <NotesSummarizer />}
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
