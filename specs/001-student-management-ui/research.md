# Research: Student Management Mobile Interface

## Decision: Use a server-served vanilla web interface

- **Decision**: Add HTML, CSS, and browser JavaScript under `src/public/`, served by
  the existing Express process.
- **Rationale**: The repository has no frontend application or build system. This
  keeps the first delivery small, mobile-friendly, and easy to operate.
- **Alternatives considered**: A separate SPA or frontend framework was rejected for
  this feature because it would add build, deployment, and dependency overhead before
  the core passenger workflow is validated.

## Decision: Preserve the existing passenger API contract

- **Decision**: The interface consumes `GET /api/alunos` and `POST /api/alunos`.
- **Rationale**: These routes already represent the backend source of truth and the
  documented payload fields match the registration workflow.
- **Alternatives considered**: Duplicating storage in browser state was rejected
  because it would violate the data integrity principle.

## Decision: Authentication is an integration boundary

- **Decision**: The UI must require the existing authentication mechanism before
  exposing passenger data or registration. The frontend must send the existing
  authenticated session or token rather than implementing a second login system.
- **Rationale**: Passenger and responsible-contact data is sensitive, and the
  constitution requires least-privilege access.
- **Current repository note**: The visible Express entry point does not currently
  show an authentication middleware. Implementation must connect to the project's
  existing authentication boundary if it is supplied outside the files currently
  present; if no such boundary exists, the feature cannot be considered complete
  until access protection is established.

## Decision: Explicit loading, empty, success, and error states

- **Decision**: Every API operation has a visible state and preserves form values on
  failed registration.
- **Rationale**: Mobile users need clear recovery guidance and must never see a
  success message for an unconfirmed write.

## Decision: Manual validation with repeatable scenarios

- **Decision**: Use the repository's available start command and a documented browser
  validation guide for this feature.
- **Rationale**: `package.json` currently exposes a placeholder test script, so adding
  an unrequested test framework would expand scope. The plan records the gap for
  follow-up.
