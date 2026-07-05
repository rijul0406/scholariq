# Resume entry — ScholarIQ

Copy-paste-ready résumé bullets for this project. Every claim here is true and
defensible as of the current build (deployed, tested, containerized, CI).

**Live:** https://scholariq-eight.vercel.app · **Code:** https://github.com/rijul0406/scholariq

---

## Full version (4 bullets)

**ScholarIQ — Learning Analytics Platform**  · 2026
*React · TypeScript · FastAPI · PostgreSQL · SQLAlchemy · Docker · scholariq-eight.vercel.app · github.com/rijul0406/scholariq*

- Designed, built, and **deployed** a full-stack learning-analytics platform (React/TypeScript SPA + FastAPI/PostgreSQL API) where students log study sessions and goals and visualize their progress — live across Vercel, Render, and Neon.
- Engineered stateless **JWT authentication** with bcrypt password hashing and **ownership-scoped** REST endpoints, ensuring users access only their own data — enforced at the query layer and verified with an automated authorization test suite.
- Modeled a normalized PostgreSQL schema via SQLAlchemy (1:N relationships, cascade deletes) and built **SQL aggregation endpoints** (`GROUP BY`/`SUM`) powering per-subject analytics rendered as interactive charts (Recharts).
- **Containerized** the stack with Docker Compose and wired a **GitHub Actions CI** pipeline running a 16-test pytest suite on every push; cut initial JS bundle ~60% (599→249 KB) via route-based code-splitting.

---

## Compact version (3 bullets, tight space)

**ScholarIQ — Learning Analytics Platform** · *React, TypeScript, FastAPI, PostgreSQL, Docker* · [live](https://scholariq-eight.vercel.app) · [code](https://github.com/rijul0406/scholariq)

- Built & deployed a full-stack study-analytics app (React/TS SPA + FastAPI/PostgreSQL) with JWT auth, per-user data, and a chart-based analytics dashboard.
- Secured every endpoint with bcrypt hashing and ownership scoping, verified by a pytest suite running in GitHub Actions CI.
- Containerized with Docker; deployed live across Vercel, Render, and Neon.

---

## Notes
- Lead with the **live link** in interviews — a working app beats any bullet.
- Every claim is walkable end-to-end (auth flow, aggregation query, CI, code-split).
- Adding the AI Study Coach (roadmap step 11) later unlocks a 5th bullet on LLM
  integration for AI-native roles.
