# Quickstart: Student Payment Management

## Prerequisites

- Node.js 24 LTS and project dependencies installed.
- `.env` configured with the existing Supabase URL and key.
- A valid authenticated test user.
- Supabase tables `alunos` and `mensalidades` created according to
  [data-model.md](./data-model.md), with a non-cascading student deletion policy.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3333/`, sign in, and use the protected financial area.

## Validation scenarios

1. Create a monthly charge for an existing student with a valid competence,
   amount, and due day; confirm it appears as `Pendente`.
2. Try to create the same student/competence twice; confirm the second attempt
   is rejected and the first record remains unchanged.
3. Register a valid payment; confirm status, payment date, received amount, and
   late-payment indicator.
4. Try an invalid amount, competence, due day, payment date, or payment amount;
   confirm a clear validation message and no partial record.
5. Filter by student, competence, `Pendente`, `Vencida`, and `Pago`; confirm
   only matching records are displayed.
6. Query a pending charge after its effective due date; confirm it is displayed
   as `Vencida` without changing its original amount or due-day value.
7. Remove the operational student; confirm the financial history remains
   visible using the stored student snapshot.
8. Call each financial endpoint without authentication; confirm `401` and no
   data mutation.
9. Check mobile viewport layout and complete the create, filter, and payment
   flows without horizontal scrolling.
10. Run `git diff --check` and JavaScript syntax checks before delivery.
