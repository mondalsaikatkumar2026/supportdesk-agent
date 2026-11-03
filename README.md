# SupportDesk Agent

An AI-powered customer support triage app. A backend **autonomous agent** reads each support ticket, decides whether it needs extra data, calls mock tools through Gemini function calling, and returns a structured resolution together with a step-by-step **execution trace** shown on the dashboard.

**Author:** Saikat Kumar Mondal
**LinkedIn:** [linkedin.com/in/saikatkumar421](https://www.linkedin.com/in/saikatkumar421/)
**Repository:** [github.com/mondalsaikatkumar2026/supportdesk-agent](https://github.com/mondalsaikatkumar2026/supportdesk-agent)

---

## Features

- Gemini function calling: the model decides which tool to call, or none.
- Two mock tools: `get_order_status(order_id)` and `get_user_tier(user_id)`.
- Structured result: customer response draft, resolution tag (`Auto-Resolve` or `Escalate to Sales`) and reasoning, validated with Zod.
- Expandable **Agent Execution Trace**: tool called, parameters, raw output, reasoning.
- Responsive dashboard with ticket list, status badges (Pending, Processing, Resolved), loading state and result card.
- Register and login using a JWT stored in an `httpOnly` cookie.
- Tool errors, bad parameters and LLM failures return clear error responses without crashing the server.

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS |
| State | Redux Toolkit |
| Database | Neon (PostgreSQL), Prisma |
| LLM | Google Gemini API (free tier), `@google/genai` |
| Validation | Zod |
| Auth | bcryptjs, jose (JWT) |

## How It Works

```
Dashboard UI  ->  API route  ->  Service  ->  Gemini  <->  Mock tools
                                    |
                               Repository (Prisma)  ->  Neon PostgreSQL
```

1. The user clicks **Run AI Triage Agent**.
2. The server sends the ticket and the tool schemas to Gemini.
3. If Gemini requests a tool, the server validates the arguments, runs it and returns the result. This repeats for at most 4 steps.
4. Gemini returns a final JSON answer, which is validated and saved with the full trace.

## Seed Tickets

| Ticket | Customer | Message | Expected behavior |
|---|---|---|---|
| TCK-001 | USR-101 (Order ORD-9012) | "Where is my package #ORD-9012? It was supposed to arrive yesterday." | Calls `get_order_status`, tag Auto-Resolve |
| TCK-002 | USR-204 | "Can you upgrade my account to Enterprise tier?" | Calls `get_user_tier`, tag Escalate to Sales |
| TCK-003 | USR-309 | "How do I update my profile picture?" | No tool call, tag Auto-Resolve |

Mock tool results:

- `get_order_status` returns `{ order_id, status: "In Transit", est_delivery: "Tomorrow" }`
- `get_user_tier` returns `{ user_id, current_tier: "Free", eligible_for_upgrade: true }`

The exact wording of the AI draft can differ between runs. The tool calls and the tag are what to check.

---

## Setup

**Requirements:** Node.js 20.9+ and npm, a free [Neon](https://neon.tech) database, and a free Gemini API key from [Google AI Studio](https://aistudio.google.com).

```bash
git clone https://github.com/mondalsaikatkumar2026/supportdesk-agent.git
cd supportdesk-agent
npm install
```

Create your environment file:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bash
# macOS / Linux
cp .env.example .env
```

Fill in `.env`:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `DIRECT_URL` | No | Neon direct (non-pooler) URL, used for migrations if set |
| `JWT_SECRET` | Yes | Random string of 32+ characters |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `GEMINI_MODEL` | Yes | Gemini model name, for example `gemini-3-flash-preview` |

Generate a `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit `.env`. Only `.env.example` is tracked.

Model names and free-tier access change over time. To list models and test one:

```bash
npx tsx scripts/test-gemini.ts list
npx tsx scripts/test-gemini.ts
```

The second command should print `Model "..." replied: OK`. If it returns `429`, that model has no free quota for your key, so try another.

Set up the database and start the app:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open http://localhost:3000, register an account and open a ticket.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

---

## Using the Dashboard

1. Register or log in.
2. Select a ticket to see its metadata and message.
3. Click **Run AI Triage Agent**. The button is disabled with a spinner and the ticket shows **Processing**.
4. Read the **Agent Result** card.
5. Expand **Agent Execution Trace** to inspect each step.

All registered users act as support agents and share the same tickets. Each run is saved with the user who triggered it, and running a ticket again keeps the earlier results.

---

## API Reference

Every response uses one format:

```json
{ "success": true, "data": {} }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid request data" } }
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Server and database check |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in |
| POST | `/api/auth/logout` | No | Log out |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/tickets` | Yes | List tickets |
| GET | `/api/tickets/:id` | Yes | Ticket details and latest triage result |
| POST | `/api/tickets/:id/triage` | Yes | Run the AI triage agent |

Example body for register and login:

```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "Test@1234" }
```

Login needs only `email` and `password`. Passwords must be 8 to 72 characters and include a letter and a number.

Common error codes: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `TICKET_NOT_FOUND` (404), `ALREADY_PROCESSING` (409), `LLM_RATE_LIMITED` (429), `LLM_ERROR` (502).

### Testing with Postman

Postman keeps the session cookie, so log in first.

1. `GET /api/health` returns `200`.
2. `GET /api/tickets` before login returns `401`.
3. `POST /api/auth/login` returns `200`.
4. `GET /api/tickets` returns 3 tickets.
5. `POST /api/tickets/TCK-001/triage` calls `get_order_status` and returns `AUTO_RESOLVE`.
6. `POST /api/tickets/TCK-002/triage` calls `get_user_tier` and returns `ESCALATE_TO_SALES`.
7. `POST /api/tickets/TCK-003/triage` makes no tool call and returns `AUTO_RESOLVE`.
8. `GET /api/tickets/TCK-999` returns `404`.

---

## Project Structure

```
prisma/                  schema, migrations, seed
scripts/                 Gemini model check
src/
  app/                   pages and API routes
  server/                backend
    config/  db/  middleware/  utils/
    modules/
      auth/              auth schema, repository, service, session
      tickets/           ticket schema, repository, service
      agent/             agent loop, Gemini client, prompt, trace
        tools/           tool schemas, mock tools, registry
  features/              auth, tickets, triage (slices, thunks, components)
  components/ui/         shared UI components
  store/  services/  types/  lib/
```

Backend layers: API route, then service, then repository (Prisma). Routes hold no business logic, and only repositories access the database.

## Security

- Passwords are hashed with bcrypt.
- Sessions use a signed JWT in an `httpOnly`, `sameSite=lax` cookie.
- All input is validated with Zod, and Prisma parameterizes queries.
- Protected routes check authentication on the server.
- The Gemini key stays on the server.
- Secrets live only in the git-ignored `.env`.

## Known Limitations

- No automated unit tests yet. The API was checked with Postman and the UI in the browser.
- No rate limiting on login and register.
- No roles: every registered user can see and triage all tickets.
- Free-tier Gemini models can be rate limited, in which case the API returns `429`.

---

Built by **Saikat Kumar Mondal** · [LinkedIn](https://www.linkedin.com/in/saikatkumar421/)