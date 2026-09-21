# Modelo de dados: Gestão de Motoristas e Veículos

## `motoristas`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID | Identificador principal |
| `nome` | text | Obrigatório, sem espaços excedentes |
| `telefone` | text | Obrigatório, com validação normalizada |
| `documento` | text | Valor obrigatório para exibição |
| `documento_normalizado` | text | Valor obrigatório para comparação única |
| `ativo` | boolean | Padrão true |
| `created_at` / `updated_at` | timestamptz | Timestamps de auditoria |

## `veiculos`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID | Identificador principal |
| `placa` | text | Valor obrigatório para exibição |
| `placa_normalizada` | text | Valor obrigatório para comparação única |
| `modelo` | text | Obrigatório, sem espaços excedentes |
| `ano` | integer | Valor informativo opcional, sem validação de faixa |
| `capacidade` | integer | Positiva |
| `ativo` | boolean | Padrão true |
| `created_at` / `updated_at` | timestamptz | Timestamps de auditoria |

## `alocacoes_rota`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID | Identificador principal |
| `rota_id` | UUID | Referencia `rotas`; linhas históricas permanecem |
| `motorista_id` / `veiculo_id` | UUID nullable | Referenciam registros com `ON DELETE SET NULL` |
| `motorista_nome` / `motorista_telefone` | text nullable | Snapshots |
| `veiculo_placa` / `veiculo_modelo` | text nullable | Snapshots |
| `veiculo_capacidade` | integer nullable | Snapshot usado na exibição histórica |
| `inicio_em` | timestamptz | Obrigatório |
| `fim_em` | timestamptz nullable | Nulo significa alocação atual |
| `created_by` | UUID nullable | Identificador do operador autenticado |

### Invariantes

- Existe no máximo uma alocação atual por rota.
- Uma alocação atual referencia apenas motorista, veículo e rota ativos.
- Linhas históricas nunca são excluídas fisicamente por desativação operacional.
- A desativação de um motorista ou veículo define `fim_em` nas alocações vigentes que o utilizam.
- Uma rota pode não ter alocação atual e deve ser exibida como incompleta.
- Alertas de capacidade comparam a quantidade atual de passageiros com `veiculo_capacidade`.
