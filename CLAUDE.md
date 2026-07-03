# CLAUDE.md

## Project Identity
Project: ScholarIQ
Goal: Build a production-quality AI-powered Learning Intelligence Platform suitable as a flagship portfolio project.
Builder: RJ — a CS student building his FIRST full-stack app while learning web
dev alongside. This is Project 1 from his SDE roadmap. Knowledge wiki lives at
`~/Desktop/second-brain` (see `wiki/projects/project-1-fullstack.md`).

## LEARNING-FIRST RULE (most important — overrides speed)
RJ is learning by building. For every meaningful piece of code:
- Explain WHAT it does and WHY, in plain terms, before or right after writing it.
- Prefer teaching RJ to write it over writing it for him; when you do write it,
  make sure he can explain it back.
- If something is over his head, slow down — do not skip.
- The bar: **RJ must be able to defend every line in an interview.** A project he
  can't explain is worse than no project. Comprehension > build speed.

## Scope decisions (2026-07-03)
- **AI integration DEFERRED.** Build the full-stack core first (auth + study-session
  CRUD + simple dashboard). AI coach / quizzes / flashcards / RAG come later.
- **Lean MVP first:** auth → study-session CRUD → simple dashboard → deploy. Ship
  that, then add features as "ongoing." Do NOT build the whole PRD before shipping.
- Keep the frontend library set minimal at first (React + Router + a data-fetch
  layer). Add Tailwind/TanStack Query/Recharts/etc. only when actually needed —
  don't front-load 9 new libraries on day one.

## Core Principles
- Learning and explainability over raw speed (see Learning-First Rule).
- Prefer maintainability and simple, readable code.
- Keep frontend and backend loosely coupled.
- Never expose API keys.
- Always validate inputs.
- Write tests for new business logic.
- Use conventional commits.

## Tech Stack
Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router
- React Hook Form
- Zod
- Recharts

Backend:
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT
- bcrypt

AI (DEFERRED — not part of the first shippable version):
- Claude API (Anthropic) — switched from Gemini to match RJ's resume/wiki and the
  AI-native companies he's targeting; use the latest capable Claude model.
- Structured JSON outputs
- Prompt builder service
- (Future) RAG

## Coding Standards
- Small reusable components.
- Meaningful names.
- Type hints everywhere in Python.
- No business logic in React components.
- Services handle AI orchestration.
- Repository pattern where appropriate.
- Keep controllers thin.

## Definition of Done
- Feature works end-to-end.
- Tests pass.
- Documentation updated.
- API documented.
- Error handling added.
- Responsive UI verified.

## AI Rules (for the deferred AI phase)
Frontend -> FastAPI -> Database Context -> Prompt Builder -> Claude -> JSON -> Frontend.
Never call the LLM directly from the frontend; the API key stays server-side.
