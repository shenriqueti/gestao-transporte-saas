# Data Model: Gestão de rotas e embarque

## `rotas`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID | Chave primária |
| `nome` | text | Obrigatório, não vazio |
| `descricao` | text | Opcional |
| `ativa` | boolean | Padrão `true`; remoção operacional pode desativar |
| `created_at` | timestamptz | Padrão do banco |
| `updated_at` | timestamptz | Atualizado em alterações |

## `rota_alunos`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID | Chave primária |
| `rota_id` | UUID | Obrigatório, referência à rota |
| `aluno_id` | UUID | Referência ao aluno; permite aluno removido sem apagar associação histórica |
| `aluno_nome` | text | Snapshot obrigatório |
| `escola` | text | Snapshot opcional |
| `ordem` | integer | Inteiro positivo e único dentro da rota |
| `created_at` | timestamptz | Padrão do banco |

Constraints: unicidade de `(rota_id, aluno_id)` e `(rota_id, ordem)`. A remoção da associação não remove o aluno.

## `embarques_diarios`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID | Chave primária |
| `rota_id` | UUID | Obrigatório |
| `rota_aluno_id` | UUID | Referência obrigatória à associação original |
| `aluno_id` | UUID | Referência opcional ao aluno removido |
| `aluno_nome` | text | Snapshot obrigatório |
| `escola` | text | Snapshot opcional |
| `data_embarque` | date | Obrigatória |
| `status` | text | `Pendente`, `Embarcou`, `Faltou` ou `Não utilizará` |
| `confirmado_em` | timestamptz | Preenchido quando houver confirmação |
| `confirmado_por` | UUID | Identificador estável do usuário autenticado |
| `created_at` | timestamptz | Padrão do banco |
| `updated_at` | timestamptz | Atualizado em cada alteração |

Constraint: unicidade de `(rota_aluno_id, data_embarque)`. O banco preserva o registro quando aluno ou associação operacional forem removidos; `rota_aluno_id` permanece obrigatório.

## State transitions

`Pendente` → `Embarcou`, `Faltou` ou `Não utilizará`.

Um estado já registrado pode ser atualizado para outro estado permitido na mesma data. Nenhuma transição aceita data futura. `confirmado_em` e `confirmado_por` são atualizados em cada confirmação.

## Relationships

- Uma `rota` possui zero ou muitos `rota_alunos`.
- Um `aluno` pode aparecer em várias `rota_alunos`.
- Uma `rota_aluno` origina registros diários, mas o histórico mantém snapshots próprios.
- Uma `rota` possui zero ou muitos `embarques_diarios`.
