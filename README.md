# ProcureFlow AI

Role & Context

You are building a modern web application for a supply chain and procurement professional who needs to automate repetitive workplace tasks using AI. The user manages supplier relationships, purchase orders, and internal coordination, and requires a single, efficient tool to improve productivity in daily operations.



---



Task

Build a modern, responsive, single-page web application called ProcureFlow AI — an AI-powered productivity dashboard that integrates three core tools into one unified platform using a sidebar navigation layout (NOT separate applications).



---



Core Features (Must Include All 3)



1. Smart Email Generator



Purpose:

Generate professional workplace emails for supplier communication, purchase order follow-ups, negotiation requests, and internal updates.



Inputs:



- Recipient Type (Dropdown: Supplier / Internal Team / Management)

- Email Purpose (Short text input)

- Key Points (Textarea)

- Tone Selector (Formal / Friendly / Persuasive)



Output:



- Complete email draft including:

  - Subject line

  - Greeting

  - Body

  - Professional closing

- Displayed in an editable text box

- Include a “Copy to Clipboard” button



AI Logic & Behavior:



- Transform user input into a clear, structured, professional email

- Adapt tone based on selected option

- Use workplace-appropriate language

- If input is vague, still generate a complete and coherent email

- Do NOT ask follow-up questions

- Do NOT include placeholders like [Name]



---



2. AI Task Planner / Scheduler



Purpose:

Convert a list of tasks into a structured, prioritized daily or weekly schedule.



Inputs:



- Task List (Textarea — one task per line)

- Timeframe Selector (Today / This Week)

- Optional deadlines within tasks



Output:



- Structured schedule grouped by day

- Tasks categorized by priority:

  - High

  - Medium

  - Low

- Include a short reason/rationale for prioritization



AI Logic & Behavior:



- Prioritize tasks based on urgency and deadlines (not input order)

- Organize output clearly for readability

- Ensure realistic and practical scheduling

- Do NOT invent deadlines if not provided



---



3. Meeting Notes Summarizer



Purpose:

Summarize long meeting notes into clear, actionable insights.



Inputs:



- Large textarea for pasting raw meeting notes



Output:

Clearly structured into three sections:



- Summary (2–4 sentences)

- Action Items (bulleted list, include owner if mentioned)

- Decisions & Deadlines (bulleted list)



AI Logic & Behavior:



- Extract key insights accurately

- Keep summary concise and professional

- If no deadlines are mentioned, explicitly state:

  “No deadlines specified”

- Do NOT fabricate information



---



Technical & UX Requirements



- Single-page dashboard layout

- Collapsible sidebar navigation (icons + labels)

- Fully responsive design (mobile + desktop)

- Each feature must have:

  - Clearly separated input section

  - Clearly separated output section

- All AI outputs must:

  - Be in editable text areas

  - Include copy-to-clipboard functionality

- Include loading indicators while AI is generating responses

- Clean, modern, professional SaaS-style UI

  - Neutral color palette

  - Clear typography hierarchy

  - Generous whitespace

  - Similar feel to Notion or Linear



---



Global AI Behavior



- Always generate structured, professional outputs

- Maintain clarity and workplace relevance

- Do NOT hallucinate facts — if uncertain, remain neutral

- Do NOT ask follow-up questions — produce best possible output



---



Edge Case Handling



- If input fields are empty → show a friendly error message

- If notes or tasks are too short → still generate a meaningful result

- Ensure the app never crashes due to missing or minimal input



---



Responsible AI Requirement



Include a persistent, visible disclaimer (footer or banner):



«“AI-generated content may not always be accurate. Please review before use.”»



---



Constraints



- This must be ONE integrated application, not multiple apps

- Do NOT merge all features into one shared input/output

- Keep features functionally distinct within one dashboard

- Do NOT add extra unrelated features beyond the three specified



---



Evaluation Alignment



This project is designed to demonstrate:



- Practical AI implementation

- Strong prompt engineering through structured AI behavior

- Real-world workplace problem solving

- Clean, modern UI/UX design

- Functional and reliable AI-powered tools





Design Style:

Clean, modern, and professional — similar to a SaaS productivity platform.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://orbit-pro-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1776f91d-6418-403a-811c-257f299da2d4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
