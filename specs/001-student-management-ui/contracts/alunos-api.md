# Passenger API Contract

## Authentication

All operations used by the interface require the existing authenticated session or
token. The frontend must not expose credentials or create a parallel authentication
flow.

## List passengers

`GET /api/alunos`

### Success

- Status: `200`
- Body: JSON array of passenger objects.

### Failure

- Non-2xx status.
- Body may contain `{ "error": "..." }`.

## Register passenger

`POST /api/alunos`

### Request body

```json
{
  "nome": "Nome do Aluno",
  "escola": "Nome da Escola",
  "valor": 350.00,
  "vencimento": 10,
  "turma": "101",
  "professora": "Nome da Professora",
  "responsavel": "Nome do Responsável",
  "telefone": "21999999999"
}
```

### Success

- Status: `201`
- Body: an object containing a success `message` and the created `data`.

### Failure

- Non-2xx status.
- Body may contain `{ "error": "..." }`.

The UI must only show success after receiving the successful response and must
preserve form values when the request fails.
