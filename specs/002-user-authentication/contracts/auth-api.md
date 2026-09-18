# Authentication and Protected API Contract

## Login

The browser uses Supabase Auth email/password sign-in. No public account creation
endpoint exists in this feature.

## Protected requests

Protected requests include the current Supabase access token in the HTTP
`Authorization` header using the standard token scheme. The backend validates it with
Supabase Auth before accessing student data.

Missing, malformed, expired, revoked, or otherwise invalid credentials return `401
Unauthorized` with a generic JSON body. The body contains no credentials, token
values, email-existence information, or provider internals.

If the authentication provider cannot be consulted, return `503 Service Unavailable`
and do not run the student handler.

## Authenticated student API

For valid credentials, existing contracts remain unchanged: `GET /api/alunos` returns
`200` and the passenger array, while `POST /api/alunos` returns `201` and the
created-record response. All authenticated users share list/create access in this version.

## Logout and restoration

Logout clears the Supabase-managed browser session and returns to login. Reloading or
reopening the browser with a valid session restores access; expired or revoked
sessions require authentication before protected data is shown.
