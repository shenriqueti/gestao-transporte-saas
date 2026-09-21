# Quickstart: Student Management Mobile Interface

## Prerequisites

- Node.js 24 LTS (Node.js 20 or newer is acceptable according to the repository README).
- A configured `.env` with the existing Supabase connection values.
- The backend database contains the `alunos` table.
- A valid user session for the existing authentication mechanism.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3333/` in a browser with a mobile-sized viewport.

## Validation scenarios

1. **Authenticated access**: unauthenticated access is blocked or redirected by the
   existing authentication boundary; authenticated access can load the interface.
2. **List success**: existing passenger records appear with readable labels and no
   horizontal scrolling.
3. **Empty list**: with no records, the interface shows an explanatory empty state.
4. **Registration success**: submit a valid payload, observe success feedback, and
   confirm the new passenger appears after refresh.
5. **Validation failure**: submit missing or invalid required fields; the request is
   not sent and entered values remain visible.
6. **API failure**: make the list or registration request fail; the interface shows a
   recovery-oriented error and does not report success.
7. **Scope boundary**: passenger details can be consulted, but no editing controls
   are provided.
