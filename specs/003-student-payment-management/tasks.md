---

description: "Task list for Student Payment Management"
---

# Tasks: Student Payment Management

**Input**: Design documents from `/specs/003-student-payment-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated test framework is configured and tests were not explicitly requested. Validation tasks use the existing syntax, diff, API, and browser workflows.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing web application for the financial feature.

- [X] T001 Document the `mensalidades` Supabase table setup and non-cascading student-history relationship in `specs/003-student-payment-management/data-model.md`
- [X] T002 [P] Add the financial route module entry point at `src/routes/mensalidadeRoutes.js` following the existing authenticated route pattern
- [X] T003 [P] Add the financial section shell and navigation target to `src/public/protected.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared validation, date, persistence, and route wiring before story work.

**CRITICAL**: User story work depends on this phase.

- [X] T004 Create shared monthly-charge validation and effective due-date helpers in `src/routes/mensalidadeRoutes.js`, enforcing positive amounts, valid month/year competence, due day 1–31, and capping nonexistent due days to the competence month's last day
- [X] T005 Implement authenticated `/api/mensalidades` route registration in `src/server.js` using `authMiddleware`
- [X] T006 [P] Implement generic financial error responses in `src/routes/mensalidadeRoutes.js` for validation, duplicate, not-found, authentication, provider, and unexpected database failures without exposing credentials
- [X] T007 [P] Add financial list/form styles and mobile layout rules in `src/public/auth.css`

**Checkpoint**: Shared financial route, validation, authentication, and responsive styling foundations are ready.

---

## Phase 3: User Story 1 - Registrar mensalidades dos alunos (Priority: P1) 🎯 MVP

**Goal**: Allow an authenticated user to create and view one pending monthly charge per student and competence.

**Independent Test**: Select an existing student, save a valid competence, amount, and due day, and verify a pending charge appears; invalid and duplicate submissions must be rejected without changing the original record.

### Implementation for User Story 1

- [X] T008 [US1] Implement `GET /api/mensalidades` in `src/routes/mensalidadeRoutes.js` with optional `aluno_id`, `competencia` (`YYYY-MM`), and persisted `status` (`Pendente`, `Pago`) filters; defer derived `Vencida` filtering to US3
- [X] T009 [US1] Implement `POST /api/mensalidades` in `src/routes/mensalidadeRoutes.js`, snapshotting student name and school, defaulting status to `Pendente`, and enforcing unique `(aluno_id, competencia)` with `409`
- [X] T010 [US1] Add the `mensalidades` persistence constraints documented in `specs/003-student-payment-management/data-model.md`, including `valor > 0`, `dia_vencimento` from 1 through 31, valid competence, and non-cascading student deletion
- [X] T011 [US1] Add the monthly-charge form, student selector, competence, amount, due-day fields, status filters, loading state, empty state, and validation messages to `src/public/protected.html`
- [X] T012 [US1] Implement authenticated list loading, filtering, creation, duplicate handling, and user-facing errors in `src/public/auth.js` using `src/public/api-client.js`

**Checkpoint**: User Story 1 is independently usable for creating and viewing pending charges.

---

## Phase 4: User Story 2 - Registrar e consultar pagamentos (Priority: P1)

**Goal**: Allow an authenticated user to record one exact full payment per pending charge and view its historical details.

**Independent Test**: Open a pending charge, submit a payment with the exact charge value and a date no later than today, and verify it becomes paid with date, amount, and late-payment indicator.

### Implementation for User Story 2

- [X] T013 [US2] Implement `PUT /api/mensalidades/:id/pagamento` in `src/routes/mensalidadeRoutes.js`, accepting only a valid payment date no later than today and `valor_pago` exactly equal to the charge value
- [X] T014 [US2] Prevent second payment updates and invalid state transitions in `src/routes/mensalidadeRoutes.js`, preserving payment date, received value, and `pago_em_atraso`
- [X] T015 [US2] Add payment controls, exact-value validation, future-date validation, paid status, payment date, received value, and late indicator to `src/public/protected.html`
- [X] T016 [US2] Implement payment submission, payment success refresh, duplicate-payment handling, and validation error messages in `src/public/auth.js`

**Checkpoint**: User Stories 1 and 2 work independently: charges can be created and paid with auditable details.

---

## Phase 5: User Story 3 - Identificar pendências financeiras (Priority: P2)

**Goal**: Make pending and overdue financial obligations quickly discoverable by student, competence, and status.

**Independent Test**: Load charges containing pending, overdue, and paid records; filter each status and competence and verify only matching records appear, including an explicit no-results message.

### Implementation for User Story 3

- [X] T017 [US3] Add derived `Vencida` status calculation to `GET /api/mensalidades` in `src/routes/mensalidadeRoutes.js` without overwriting persisted charge status or value
- [X] T018 [US3] Ensure status filtering distinguishes derived `Vencida` from persisted `Pendente` in `src/routes/mensalidadeRoutes.js`
- [X] T019 [US3] Implement combined student, competence, and status filter interactions, including derived `Vencida`, with no-results messaging in `src/public/auth.js`
- [X] T020 [US3] Render responsive charge cards/table states for `Pendente`, `Vencida`, and `Pago` in `src/public/protected.html` and `src/public/auth.css`

**Checkpoint**: All three user stories are independently demonstrable from the authenticated interface.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature and update user-facing documentation.

- [X] T021 [P] Update API and setup documentation for financial endpoints and the `mensalidades` table in `README.md`
- [X] T022 [P] Run JavaScript syntax checks on `src/routes/mensalidadeRoutes.js`, `src/server.js`, `src/public/auth.js`, and `src/public/api-client.js`
- [X] T023 [P] Run `git diff --check` and inspect the final diff for secrets, tokens, personal data, and accidental unrelated changes
- [X] T024 Run the end-to-end scenarios in `specs/003-student-payment-management/quickstart.md`, including unauthenticated `401` checks and preservation of history after student deletion (validated: history is preserved after student deletion)
- [X] T025 Performance validation with 1,000 monthly charges waived by product decision because the dataset is unnecessary for the current scope
- [X] T026 Add safe operational logging for financial validation/database failures and authentication-provider availability in `src/routes/mensalidadeRoutes.js`, excluding tokens, credentials, and personal data

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T002 and T003 can run in parallel after T001's documentation context is available.
- **Foundational (Phase 2)**: Depends on Phase 1; T004–T007 can be split across backend and frontend work.
- **User Stories (Phases 3–5)**: Depend on Phase 2. US2 uses the charge shape created by US1; US3 consumes both charge and payment statuses.
- **Polish (Phase 6)**: Depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2; MVP increment.
- **US2 (P1)**: Depends on T008–T012 from US1 because payment controls operate on created charges.
- **US3 (P2)**: Depends on US1 and US2 data/status behavior; it adds the derived `Vencida` status and its filter.

### Parallel Opportunities

- T002, T003, and T007 can be developed in parallel when file ownership is coordinated.
- Backend tasks T008–T010 can proceed separately from UI task T011, then converge at T012.
- Backend payment tasks T013–T014 and UI payment task T015 can proceed in parallel.
- Documentation, syntax checks, diff review, performance validation, and observability review in Phase 6 can run in parallel; quickstart execution follows after implementation.

## Parallel Example: User Story 1

```text
Task A: Implement GET /api/mensalidades and its filter parsing in src/routes/mensalidadeRoutes.js
Task B: Add the monthly-charge form and filter controls in src/public/protected.html
Task C: Add responsive financial styles in src/public/auth.css
```

## Parallel Example: User Story 2

```text
Task A: Implement PUT /api/mensalidades/:id/pagamento in src/routes/mensalidadeRoutes.js
Task B: Add payment controls and status presentation in src/public/protected.html
Task C: Add payment submission handling in src/public/auth.js
```

## Implementation Strategy

1. Complete the database contract, authenticated route foundation, and shared validation.
2. Deliver US1 as the MVP: create, list, filter, and reject invalid/duplicate charges.
3. Add US2 without weakening the charge invariants: exact full payment, no future dates, and immutable payment history.
4. Add US3's derived overdue status and fast filtering.
5. Validate mobile behavior, authorization failures, persistence behavior, documentation, syntax, and diff hygiene.
