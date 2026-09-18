# Research: User Authentication with Supabase Auth

## Server-side token validation

- Read the `Authorization` header using the standard token scheme on protected requests.
- Validate the supplied access token with the existing Supabase client before student
  handlers execute.
- A custom JWT verifier or backend session store would duplicate Supabase responsibilities.

## Browser authentication

- Use Supabase Auth email/password sign-in.
- Provision accounts manually in the Supabase dashboard; exclude public signup.
- Let Supabase manage session restoration, refresh, logout, and expiration.

## Error handling

- Missing, malformed, expired, or revoked credentials return `401` with a generic body.
- Authentication-provider outages return `503` without exposing provider details.
- Authentication errors never include credentials, token values, or user-enumeration data.
