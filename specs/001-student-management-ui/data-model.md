# Data Model: Student Management Mobile Interface

## Passenger (`aluno`)

Represents a student registered for school transport. The backend remains the source
of truth.

| Field | Required for registration | Description |
|---|---:|---|
| `id` | No | Backend-generated record identifier, when returned |
| `nome` | Yes | Student name |
| `escola` | Yes | School name |
| `valor` | Yes | Transport amount |
| `vencimento` | Yes | Payment due day |
| `turma` | No | Class or group |
| `professora` | No | Teacher name |
| `responsavel` | Yes | Responsible person's name |
| `telefone` | Yes | Responsible person's phone |

## Registration payload

The UI sends the fields accepted by `POST /api/alunos`: `nome`, `escola`, `valor`,
`vencimento`, `turma`, `professora`, `responsavel`, and `telefone`. Client-side
validation prevents missing required values and invalid numeric values; the backend
must still validate and persist the final record.

## Lifecycle

1. A passenger is absent from the list.
2. An authenticated user submits a valid registration.
3. The backend confirms creation.
4. The passenger appears in the refreshed list.

Editing and deletion are outside this feature.
