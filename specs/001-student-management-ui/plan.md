# Implementation Plan: Student Management Mobile Interface

**Branch**: `001-student-management-ui` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-student-management-ui/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Add a responsive, mobile-first web interface for authenticated staff to list,
inspect, and register school transport passengers. The interface will be served
by the existing Express application and will consume the existing `/api/alunos`
list and create endpoints. The first version deliberately excludes editing
existing records and reuses the project's existing authentication boundary.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript, Node.js 24 LTS

**Primary Dependencies**: Existing Express 5 API, browser Fetch API, HTML/CSS/vanilla JavaScript

**Storage**: Existing PostgreSQL database through Supabase and `alunos` table

**Testing**: Existing npm test command is currently a placeholder; validation will use
manual browser checks and focused API/request checks until a test runner is introduced

**Target Platform**: Mobile and desktop browsers; Express server runtime

**Project Type**: Web application with Express backend and browser frontend

**Performance Goals**: Initial list view and usable loading state within 2 seconds on a
standard mobile connection when the API responds normally

**Constraints**: No horizontal scrolling at phone widths; no secrets in frontend assets;
do not claim successful writes until the API confirms them; no editing in v1

**Scale/Scope**: One passenger list, passenger detail view, registration form, and
authenticated access flow for the initial operational MVP

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Produto orientado à operação real: PASS — list and registration prioritize daily
  operator workflows on mobile.
- Dados confiáveis e auditáveis: PASS — the backend remains the source of truth and
  the UI renders confirmed API state.
- Qualidade obrigatória via testes e validação: PASS WITH LIMITATION — the existing
  repository has no real test runner, so the plan includes repeatable manual and API
  validation; adding automated tests is a follow-up quality improvement.
- Segurança e privacidade: PASS — authentication is required and no credentials are
  stored in frontend code or browser assets.
- Simplicidade e evolução incremental: PASS — vanilla browser assets are served by
  the existing Express app without introducing a frontend framework or build system.

## Project Structure

### Documentation (this feature)

```text
specs/001-student-management-ui/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── config/
├── routes/
├── server.js
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
```

**Structure Decision**: Keep the current Express API and add a small static frontend
under `src/public/`. The server serves the frontend at `/` while `/api/alunos`
continues to provide the passenger contract. No framework or bundler is needed for
this feature.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | The selected structure uses the existing single Express project. |
