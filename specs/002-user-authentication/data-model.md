# Data Model: User Authentication

## Authenticated User

Represents an account provisioned in Supabase Auth and allowed to use the application.

| Field | Source | Notes |
|---|---|---|
| `id` | Supabase Auth | Stable provider user identifier |
| `email` | Supabase Auth | Login identifier; never exposed in error details |
| `created_at` | Supabase Auth | Provider-managed creation timestamp |

Public account creation is not part of this feature.

## Auth Session

Represents the provider-managed browser session.

| State | Meaning | Transition |
|---|---|---|
| Unauthenticated | No valid provider session | Login succeeds |
| Authenticated | Access token is valid | Token expires, is revoked, or user logs out |
| Expired/revoked | Session cannot authorize API calls | User signs in again |

The browser restores a valid session after reload and after reopening the browser on
the same device, subject to the provider's normal session expiration and revocation.

## Access Token

The short-lived bearer credential issued by Supabase Auth. It is sent only in the
`Authorization` header for protected API requests and must never be written to logs,
source files, or user-facing error messages.

## Authorization scope

All authenticated users have the same access to list and create student records in
this version. Role-specific permissions are deferred.
