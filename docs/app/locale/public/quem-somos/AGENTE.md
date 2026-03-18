
# Agent Architecture — React / Next.js / TypeScript Stack

This system operates using a 3-layer architecture designed to separate probabilistic AI reasoning from deterministic business logic.

LLMs are probabilistic.  
Business logic must be deterministic.

This architecture enforces that separation.

---

# The 3-Layer Architecture

## 🟢 Layer 1 — Directives (What to do)

Location: `/directives`

Directives are Standard Operating Procedures (SOPs) written in Markdown.

Each directive defines:

- Objective
- Expected inputs
- Services / APIs involved
- Expected output
- Edge cases
- Validation steps
- Recovery instructions

Example:

```
directives/create_booking.md
```

The AI does NOT execute business logic manually.  
It reads the directive and routes execution to deterministic code.

Directives are living documents and must evolve when improvements are discovered.

---

## 🟡 Layer 2 — Orchestration (Decision Layer)

This is the AI’s role.

Responsibilities:

- Read directives
- Determine which service / API route to call
- Validate preconditions
- Handle errors
- Ask for clarification when needed
- Suggest improvements
- Update directives (only when explicitly allowed)

The orchestration layer NEVER:

- Writes directly to the database
- Simulates business logic
- Bypasses API routes
- Handles payments manually
- Replaces backend validation

It routes execution to deterministic systems.

---

## 🔵 Layer 3 — Execution (Deterministic Code)

Execution lives inside the application codebase.

Primary stack:

- React
- Next.js
- TypeScript
- Node.js
- Express / NestJS
- PostgreSQL
- Prisma ORM
- Firebase (for mobile apps)
- Docker (environment isolation)

Execution folders may include:

```
/app
/app/api
/services
/lib
/prisma
/docker
```

All business logic must exist in deterministic code.

The AI never replaces execution logic.

---

# Self-Healing / Self-Annealing Loop

When something breaks:

1. Read the error carefully
2. Identify the affected layer
3. Fix the code
4. Test locally
5. Commit with clear message
6. Update directive if new knowledge was discovered

Example:

Error:
```
PrismaClientInitializationError
```

Possible resolution:

- Check DATABASE_URL
- Check Docker container
- Run:
  npx prisma migrate deploy

After resolution, update directive with:
"If this error occurs, verify X and Y."

The system becomes stronger over time.

---

# Operating Principles

## 1. Business Logic Lives in Code

Authentication, payments, booking systems, financial calculations:
→ Must exist in backend code.

AI assists with structure and reasoning, not execution.

---

## 2. Code is the Source of Truth

If directives and code conflict:

Code wins.  
Directive must be updated.

---

## 3. Environment Isolation

- All secrets in `.env`
- Docker for database isolation
- Prisma migrations versioned
- Never manually alter production database

---

## 4. Structured Logging

Critical flows must log:

- Input
- Output
- Error details
- Execution time

Observability is mandatory.

---

# Security Layer

All production systems must include:

- JWT validation
- Role-based access control
- Input validation (Zod or equivalent)
- Rate limiting
- Sanitization
- Secure headers
- Environment-based configuration

Security is not optional.

---

# Testing Strategy

Minimum standards:

- Unit tests (Vitest or equivalent)
- API tests (Supertest or equivalent)
- Integration tests
- Migration validation
- Manual QA before deployment

No feature is complete without validation.

---

# Version Control Standards

Use semantic commit structure:

- feat:
- fix:
- refactor:
- docs:
- chore:

Every structural change must be committed clearly.

---

# Project Structure Philosophy

Deliverables:
User-facing outputs (deployed apps, dashboards, cloud data).

Intermediates:
Temporary processing artifacts (can be regenerated).

Never depend on manual state.

Everything reproducible.

---

# Strategic Mindset

This system prioritizes:

- Determinism over improvisation
- Architecture over quick hacks
- Process over randomness
- Scalability over shortcuts

AI assists decision-making.

Code executes reliably.

Directives preserve operational intelligence.

The system improves continuously.
