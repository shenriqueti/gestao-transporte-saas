# Mensalidades API Contract

All endpoints require the same authenticated bearer session used by
`/api/alunos`. Errors return `{ "error": "Mensagem para o usuário." }`.

## `GET /api/mensalidades`

Lists charges. Optional query parameters:

- `aluno_id`: filter by student
- `competencia`: month in `YYYY-MM` format
- `status`: `Pendente`, `Vencida`, or `Pago`

`200 OK`:

```json
[
  {
    "id": "uuid",
    "aluno_id": "uuid",
    "aluno_nome": "Ana Silva",
    "escola": "Escola Central",
    "competencia": "2026-09-01",
    "valor": 450.00,
    "dia_vencimento": 10,
    "status": "Vencida",
    "data_pagamento": null,
    "valor_pago": null,
    "pago_em_atraso": false
  }
]
```

Invalid filters return `400 Bad Request`. Auth failures return `401`.

## `POST /api/mensalidades`

Creates a pending charge.

Request:

```json
{
  "aluno_id": "uuid",
  "competencia": "2026-09",
  "valor": 450.00,
  "dia_vencimento": 10
}
```

`201 Created` returns the created charge. Invalid data returns `400`; an existing
charge for the same student and competence returns `409`.

## `PUT /api/mensalidades/:id/pagamento`

Registers the single full payment allowed by the MVP.

Request:

```json
{
  "data_pagamento": "2026-09-12",
  "valor_pago": 450.00
}
```

`200 OK` returns the paid charge with `status: "Pago"` and `pago_em_atraso`.
Invalid data or a second payment returns `400`; a missing charge returns `404`.

## Authorization and errors

- Missing, malformed, expired, or revoked session: `401 Unauthorized`.
- Supabase authentication-provider outage: `503 Service Unavailable`.
- Database or unexpected operation failure: `500 Internal Server Error` with a
  generic user-facing message.
- No endpoint exposes access tokens or provider credentials.
