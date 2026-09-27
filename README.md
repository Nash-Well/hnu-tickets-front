# HNU Tickets — Frontend

Web client for the technical support ticket management system. It works against the Go REST API in `../hnu-tickets`.

## Stack

- React 19, TypeScript, Vite
- Mantine 9 (core, form, dates, charts, notifications, modals), Tabler icons
- TanStack Query for server state, React Router for routing, Zod for validation
- Feature-Sliced Design: `app` → `pages` → `widgets` → `features` → `entities` → `shared`

## Getting started

1. Start the backend and load demo data:

   ```sh
   cd ../hnu-tickets
   docker compose up --build -d
   docker compose exec -T postgres psql -U tickets -d tickets < scripts/seed.sql
   ```

2. Install dependencies and run the dev server:

   ```sh
   pnpm install
   pnpm dev
   ```

   The app runs on `http://localhost:5173`. The dev server proxies `/api` to `http://localhost:8080`.

Demo accounts (password `password123`): `admin@example.com`, `specialist@example.com`, `specialist2@example.com`, `user@example.com`, `user2@example.com`.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | API base URL used by the browser | `/api/v1` |
| `API_PROXY_TARGET` | Backend address for the dev proxy | `http://localhost:8080` |

When serving the production build from a different origin than the API, set `VITE_API_BASE_URL` to the absolute API URL and add that origin to the backend `CORS_ALLOWED_ORIGINS`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Type check and production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | Oxlint |
| `pnpm preview` | Preview the production build |

## Roles and features

- **User**: registration, login, dashboard with own ticket summary, ticket creation, own ticket list with search and filters, editing while the ticket is new, comments, history, answering specialist requests, confirming and closing resolved tickets, cancelling.
- **Specialist**: dashboard with assigned work, assigned ticket list, taking tickets into work, requesting information from the user, resolving with a required result description, comments, history.
- **Administrator**: dashboard with statistics, charts and unassigned tickets, all tickets with filters by status, priority, category, specialist and creation date, ticket editing, assignment and reassignment with a least-loaded specialist suggestion, all valid status transitions, user management (create, edit, change role), category management, analytics for any period.

## Backend limitations

The frontend uses only existing endpoints. Documented capabilities without backend support:

- Specialists cannot see unassigned tickets or take them on their own, and cannot change priority; the API restricts both.
- There are no endpoints for deleting users or tickets.
- Users cannot edit their own profile; profile changes are administrator-only.
- Administrators create accounts through the public registration endpoint followed by a role change.
- Ticket history returns user and category identifiers only; names are resolved from data available to the current role.
- The "tickets created per day" chart is computed on the client from the ticket list.
- Role changes take effect after the affected user signs in again, since the role is stored in the access token.
