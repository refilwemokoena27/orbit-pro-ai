# ProcureFlow AI

A modern, AI-powered productivity dashboard built for supply chain and procurement professionals. ProcureFlow AI combines three essential workplace tools into one responsive workspace: a smart email generator, an AI task planner, and a meeting notes summarizer.

**Live demo:** [orbit-pro-ai.lovable.app](https://orbit-pro-ai.lovable.app)

---

## Features

### 📧 Smart Email Generator
Turn a few bullet points into a complete, professional workplace email. Choose the recipient type (supplier, internal team, or management) and tone (formal, friendly, or persuasive), and the AI drafts a ready-to-send message with a subject line, greeting, body, and closing.

### 📅 AI Task Planner / Scheduler
Paste a raw task list and select a timeframe (today or this week). The AI prioritizes tasks by urgency, groups them realistically, and explains the rationale behind the schedule.

### 📝 Meeting Notes Summarizer
Paste lengthy meeting notes and get a structured output with a concise summary, clear action items (with owners when mentioned), and a list of decisions and deadlines.

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19, full-stack SSR/SSG)
- **Router:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS v4 with a neutral, professional SaaS palette
- **UI Components:** Radix UI primitives + shadcn/ui conventions
- **AI:** Lovable AI Gateway (`google/gemini-3.7-flash`) via `createServerFn`
- **Icons:** Lucide React
- **Build Tool:** Vite 8

---

## Getting Started

### Prerequisites

- Node.js (preferably managed with [nvm](https://github.com/nvm-sh/nvm))
- npm or a compatible package manager

### Install & Run

```sh
git clone <repository-url>
cd <repository-name>
npm install
npm run dev
```

The dev server starts at `http://localhost:8080`.

### Build for Production

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

---

## Project Structure

```text
src/
├── components/procure/    # Core tool UI components
│   ├── EmailGenerator.tsx
│   ├── TaskPlanner.tsx
│   └── NotesSummarizer.tsx
├── components/ui/         # Shared shadcn/ui components
├── lib/
│   ├── ai.functions.ts    # Server function for AI generation
│   └── utils.ts           # Tailwind/class utilities
├── routes/
│   ├── __root.tsx         # Root layout
│   ├── index.tsx          # Dashboard with sidebar navigation
│   └── api/               # Public/server API routes
├── styles.css             # Global Tailwind v4 theme tokens
└── start.ts               # App entry + server function middleware
```

---

## AI Behavior

All three tools share the following guidelines:

- Generate structured, professional output without follow-up questions.
- Avoid placeholders such as `[Name]` — produce a complete draft from the provided context.
- Stay neutral rather than hallucinating facts when input is vague.
- Surface a friendly error when required input is missing.
- Display a persistent disclaimer: **“AI-generated content may not always be accurate. Please review before use.”**

---

## Deployment

This project is deployed through Lovable. Connect GitHub in the Lovable editor to enable two-way sync: every change in Lovable pushes to GitHub, and commits pushed to GitHub sync back into Lovable.

---

## License

This project was built with [Lovable](https://lovable.dev). The code is yours to modify, deploy, and extend.
