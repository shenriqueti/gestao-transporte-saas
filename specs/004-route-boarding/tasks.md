---

description: "Task list for Route and Boarding Management"
---

# Tasks: Gestão de rotas e embarque

**Input**: Design documents from `/specs/004-route-boarding/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Não há framework de testes configurado; a validação usa os cenários manuais do quickstart, `node --check` e `git diff --check`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar os arquivos compartilhados e a estrutura da feature.

- [X] T001 [P] Create the migration scaffold and transaction boundaries in `supabase/migrations/20260918192000_create_rotas_embarques.sql` for the route feature tables.
- [X] T002 [P] Add the authenticated route module entry point in `src/routes/rotaRoutes.js` following the existing middleware and error-handling patterns.
- [X] T003 [P] Add route, daily boarding, and history sections to `src/public/protected.html` while preserving the existing student and finance panels.
- [X] T004 [P] Add responsive route and boarding styles in `src/public/auth.css` for mobile operation.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estabelecer constraints, autenticação, validações e integração compartilhada antes das histórias.

**CRITICAL**: Nenhuma história começa antes desta fase.

- [X] T005 Register `rotaRoutes` under `/api` in `src/server.js` and apply the existing `authMiddleware` to every route, boarding, and history endpoint.
- [X] T006 Implement shared validation helpers in `src/routes/rotaRoutes.js` for non-empty route names, positive passenger order, valid `AAAA-MM-DD` dates, no future boarding dates, and allowed statuses `Pendente`, `Embarcou`, `Faltou`, and `Não utilizará`.
- [X] T007 Implement safe route-operation error responses and operational logging in `src/routes/rotaRoutes.js` without exposing tokens, credentials, or unnecessary personal data.
- [X] T008 Add `apiClient` helpers in `src/public/api-client.js` for route, passenger-order, daily-boarding, and history requests using the authenticated `Authorization` header.

**Checkpoint**: migration structure, authentication, shared validation, client requests, and responsive shell are ready.

---

## Phase 3: User Story 1 - Organizar rotas e passageiros (Priority: P1) 🎯 MVP

**Goal**: Permitir criar, editar, desativar, listar e organizar rotas e seus alunos.

**Independent Test**: Criar uma rota, associar dois alunos, reordená-los, recarregar e confirmar a ordem; tentar duplicar uma associação e confirmar `409`.

### Implementation for User Story 1

- [X] T009 [US1] Create the `rotas` persistence constraints in `supabase/migrations/20260918192000_create_rotas_embarques.sql`, requiring non-empty `nome`, defaulting `ativa` to true, and retaining route records when operationally removed.
- [X] T010 [US1] Create the `rota_alunos` persistence constraints in `supabase/migrations/20260918192000_create_rotas_embarques.sql`, enforcing unique `(rota_id, aluno_id)`, unique `(rota_id, ordem)`, and positive `ordem` while storing `aluno_nome` and `escola` snapshots.
- [X] T011 [US1] Implement `GET /api/rotas`, `POST /api/rotas`, `PUT /api/rotas/:id`, and `DELETE /api/rotas/:id` in `src/routes/rotaRoutes.js`, with `DELETE` deactivating the route without deleting passengers or history.
- [X] T012 [US1] Implement `GET /api/rotas/:id/alunos`, `POST /api/rotas/:id/alunos`, and `DELETE /api/rotas/:id/alunos/:alunoId` in `src/routes/rotaRoutes.js`, allowing an aluno in multiple routes but rejecting duplicate association inside one route.
- [X] T013 [US1] Implement `PUT /api/rotas/:id/alunos/ordem` in `src/routes/rotaRoutes.js`, requiring exactly the currently associated student IDs without repetitions and preserving contiguous order.
- [X] T014 [US1] Integrate route creation/editing/deactivation, student association, duplicate feedback, and passenger reordering in `src/public/auth.js` and `src/public/protected.html`.

**Checkpoint**: US1 is independently usable for route setup and ordered passenger management.

---

## Phase 4: User Story 2 - Controlar embarque diário (Priority: P1)

**Goal**: Registrar um estado único por rota, aluno e data, em uma operação diária sem separar ida e volta.

**Independent Test**: Abrir a rota na data atual, confirmar estados diferentes para passageiros, recarregar, repetir uma marcação e tentar usar uma data futura.

### Implementation for User Story 2

- [X] T015 [US2] Create the `embarques_diarios` persistence constraints in `supabase/migrations/20260918192000_create_rotas_embarques.sql`, enforcing unique `(rota_aluno_id, data_embarque)`, allowed states, stable `confirmado_por`, optional student foreign key, and preservation after student or association removal.
- [X] T016 [US2] Implement `GET /api/rotas/:id/embarques?data=AAAA-MM-DD` in `src/routes/rotaRoutes.js`, returning every route passenger with persisted status or `Pendente`; allow future-date consultation while rejecting only future-date writes.
- [X] T017 [US2] Implement idempotent `PUT /api/rotas/:id/embarques/:alunoId` in `src/routes/rotaRoutes.js`, creating or updating the daily state, storing `confirmado_em` and `confirmado_por`, and preventing duplicate rows.
- [X] T018 [US2] Integrate route/date selection, pending defaults, per-passenger status controls, confirmation time, loading states, and future-date errors in `src/public/auth.js` and `src/public/protected.html`.
- [X] T019 [US2] Ensure mobile boarding controls remain usable for a route with at least 20 passengers in `src/public/auth.css`.

**Checkpoint**: US1 and US2 work independently for route setup and daily boarding control.

---

## Phase 5: User Story 3 - Consultar histórico operacional (Priority: P2)

**Goal**: Consultar registros preservados por rota, aluno e período.

**Independent Test**: Criar registros em duas datas, filtrar por rota/aluno/período e confirmar mensagem de nenhum resultado quando aplicável.

### Implementation for User Story 3

- [X] T020 [US3] Implement `GET /api/embarques?rota_id=&aluno_id=&data_inicio=&data_fim=` in `src/routes/rotaRoutes.js` with inclusive date filters and snapshot fields.
- [X] T021 [US3] Integrate history filters, result rendering, empty state, loading state, and operational errors in `src/public/auth.js` and `src/public/protected.html`.
- [X] T022 [US3] Render responsive history cards/table with route, student snapshot, date, status, confirmation time, and responsible user in `src/public/auth.css`.
- [ ] T023 [US3] Verify that history remains readable after operational student deletion and route deactivation in `src/routes/rotaRoutes.js` and `src/public/auth.js`.

**Checkpoint**: All three user stories are independently demonstrable from the authenticated interface.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validar a feature completa e documentar a operação.

- [X] T024 [P] Update `README.md` with the route/boarding migration, authenticated endpoints, allowed statuses, and mobile workflow.
- [X] T025 [P] Run `node --check` on `src/routes/rotaRoutes.js`, `src/server.js`, `src/public/auth.js`, and `src/public/api-client.js`.
- [X] T026 [P] Run `git diff --check` and inspect the final diff for secrets, tokens, personal data, and unrelated changes.
- [ ] T027 Run every end-to-end scenario in `specs/004-route-boarding/quickstart.md`, including unauthenticated `401`, duplicate association, future consultation versus future write, idempotent update, filters, and indefinite history preservation.
- [ ] T028 Measure SC-002a with five mobile runs of 20 passengers and record the completion times and pass rate in the implementation review.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001–T004 can run in parallel when file ownership is coordinated.
- **Foundational (Phase 2)**: depends on Phase 1 and blocks all user stories.
- **US1 (Phase 3)**: depends on T005–T008 and provides route/passenger data for US2 and US3.
- **US2 (Phase 4)**: depends on US1 passenger associations.
- **US3 (Phase 5)**: depends on US2 daily records.
- **Polish (Phase 6)**: depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: no user-story dependency after the foundational phase; MVP increment.
- **US2 (P1)**: depends on US1 because daily boarding operates on route passengers.
- **US3 (P2)**: depends on US2 because history queries daily boarding records.

### Parallel Opportunities

- T001–T004 can be split by migration, backend route shell, HTML, and CSS ownership.
- T009–T010 can be developed together in the migration; T011–T013 are sequential within the same route module.
- T018 and T019 can proceed in parallel after the API contract is stable.
- T020 and T021 can be developed in parallel after the daily schema is available.
- T024–T026 can run in parallel after implementation; T027 follows their completion.

## Implementation Strategy

1. Complete the migration, authenticated route foundation, and shared validation.
2. Deliver US1 as the MVP: route CRUD, passenger associations, and ordering.
3. Add US2: daily boarding states and idempotent updates.
4. Add US3: filtered operational history and deletion-preservation verification.
5. Run syntax, diff, quickstart, security, and mobile validation before delivery.
