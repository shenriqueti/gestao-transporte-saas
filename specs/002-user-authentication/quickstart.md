# Quickstart: User Authentication

## Prerequisites

- Node.js 24 LTS.
- Configured `.env` with the existing Supabase URL and anon key.
- Supabase Auth enabled and one test user created manually in the dashboard.
- The `alunos` table available for authenticated API checks.

## Run

```bash
npm install
npm run dev
```

Keep test credentials out of source files, screenshots, logs, and chat messages.

## Validation scenarios

1. Valid login reaches the protected area within 10 seconds under normal conditions.
2. Invalid credentials show a generic message without revealing whether the email exists.
3. Reloading, closing, and reopening the browser on the same device restores a valid
   session until normal provider expiration or revocation.
4. `GET /api/alunos` without the `Authorization` header returns `401` and no data.
5. `POST /api/alunos` without the `Authorization` header returns `401` and creates no record.
6. Protected endpoints accept a valid access token in the `Authorization` header using
   the standard token scheme and preserve their existing success behavior.
7. Logout clears local session state, returns to login, and causes protected requests
   to return `401`.
8. Expired or revoked credentials do not expose data and require login again.
9. An unavailable authentication provider returns `503`, does not run student handlers,
   and is not presented as invalid credentials.
10. No signup or invitation endpoint is exposed.
11. Logs and committed assets contain no passwords, access tokens, private keys, or
    personal data.

## Expected API behavior

- Missing or invalid authentication: `401 Unauthorized`.
- Authentication provider unavailable: `503 Service Unavailable`.
- Authenticated requests preserve the existing `/api/alunos` response contract.
- The public health response contains no student or responsible-contact data.
