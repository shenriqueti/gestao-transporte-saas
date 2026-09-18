# Implementation Plan: User Authentication with Supabase Auth

**Branch**: `002-user-authentication` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

## Summary

Implement email/password authentication with Supabase Auth and enforce server-side
token validation on the student API. The browser authenticates through Supabase,
sends the current access token in the `Authorization` header using the standard token
scheme, and restores or clears its session according to Supabase Auth state. Express
validates the token before `/api/alunos` handlers execute.

## Technical Context

**Language/Version**: JavaScript, Node.js 24 LTS  
**Dependencies**: Express 5, `@supabase/supabase-js` 2.x, browser Fetch API  
**Storage**: Supabase Auth sessions and existing PostgreSQL `alunos` table  
**Testing**: Repeatable HTTP and browser validation from `quickstart.md`; no new test framework  
**Performance**: Successful login reaches the protected area within 10 seconds in 95% of normal attempts  
**Constraints**: `401` for invalid authentication, `503` for provider unavailability, no secret logging, no public signup

## Constitution Check

- Operação real: PASS — authentication unlocks passenger workflows.
- Dados confiáveis: PASS — authorization is checked before data handlers.
- Qualidade: PASS WITH LIMITATION — manual HTTP/browser scenarios are repeatable.
- Segurança e privacidade: PASS — tokens and secrets are excluded from logs and files.
- Evolução incremental: PASS — reuse the existing Supabase client and add focused middleware.

## Project Structure

```text
src/
├── config/supabase.js
├── middleware/authMiddleware.js
├── routes/alunoRoutes.js
├── public/login.html
├── public/protected.html
├── public/auth.css
├── public/auth.js
├── public/api-client.js
└── server.js
```

Login and logout use the Supabase browser client directly rather than duplicated
Express authentication endpoints. The middleware protects the student route boundary.
