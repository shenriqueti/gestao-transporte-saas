# Data Model: Student Payment Management

## Student (`alunos`)

Existing operational record referenced by financial entries.

| Field | Type | Rules |
|---|---|---|
| `id` | identifier | Existing primary key |
| `nome` | text | Used for display and financial snapshot |
| `escola` | text | Used for display and financial snapshot |

Deleting a student must not cascade-delete financial entries.

## Monthly Charge (`mensalidades`)

Represents one charge for one student and one monthly competence.

| Field | Type | Rules |
|---|---|---|
| `id` | identifier | Primary key |
| `aluno_id` | identifier, nullable | References `alunos.id`; nullable after operational deletion |
| `aluno_nome` | text | Required snapshot used by history |
| `escola` | text | Required snapshot used by history |
| `competencia` | date/month value | Required month and year; normalized to the first day of the month |
| `valor` | decimal | Greater than zero, currency precision of two decimals |
| `dia_vencimento` | integer | Inclusive range 1–31 |
| `status` | enum | `Pendente` or `Pago`; `Vencida` is derived for pending charges |
| `data_pagamento` | date, nullable | Required when status is `Pago` |
| `valor_pago` | decimal, nullable | Required when status is `Pago`, greater than zero |
| `pago_em_atraso` | boolean | Derived from payment date and effective due date |
| `created_at` | timestamp | Creation audit timestamp |
| `updated_at` | timestamp | Last change timestamp |

### Constraints

- Unique `(aluno_id, competencia)` while `aluno_id` is present.
- `competencia` must represent a valid month and year.
- The effective due date is the requested day capped at the last day of the competence month.
- A pending charge cannot have payment fields populated.
- A paid charge must have payment date and received value.
- Financial entries remain queryable when `aluno_id` becomes null.

## State transitions

| Current state | Action | Next state |
|---|---|---|
| Pending, before due date | Time passes | Pending |
| Pending, after effective due date | Query | Derived Vencida |
| Pending or derived Vencida | Valid payment registration | Paid |
| Paid | Normal query | Paid |

The MVP does not include cancellation, refund, partial payment, or reopening a
paid charge.
