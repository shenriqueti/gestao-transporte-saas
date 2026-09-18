# Research: Student Payment Management

## Decision: Reutilizar a API Express e o cliente Supabase existentes

**Rationale**: O projeto já possui middleware server-side para validar sessões,
cliente HTTP no navegador e acesso ao PostgreSQL pelo Supabase. Reutilizar esse
fluxo reduz superfície de segurança e mantém a experiência de autenticação
consistente.

**Alternatives considered**: Criar um serviço separado ou um framework de
frontend. Foram rejeitados por aumentarem acoplamento e complexidade sem valor
necessário para o MVP.

## Decision: Usar uma tabela própria de mensalidades com unicidade por aluno e competência

**Rationale**: A cobrança é um registro financeiro distinto do cadastro operacional
do aluno. Uma restrição de unicidade no armazenamento, além da validação da API,
evita duplicidade em requisições concorrentes.

**Alternatives considered**: Reaproveitar os campos `valor` e `vencimento` de
`alunos`. Isso não suporta histórico mensal, pagamentos nem preservação após
remoção do aluno.

## Decision: Representar status derivado de vencimento sem sobrescrever a cobrança

**Rationale**: A mensalidade persistirá como `Pendente` ou `Pago`; a API e a
interface calcularão `Vencida` quando uma cobrança pendente ultrapassar a data
de vencimento. Assim, o sistema conserva o estado financeiro original e evita
rotinas de alteração em massa.

**Alternatives considered**: Gravar `Vencida` permanentemente por tarefa agendada.
Isso cria uma dependência operacional desnecessária e pode deixar estados
defasados.

## Decision: Preservar histórico com vínculo opcional e snapshot do aluno

**Rationale**: Como a remoção operacional de aluno não pode apagar o histórico,
as mensalidades terão `aluno_id` anulável e guardarão nome/escola no momento da
cobrança. A listagem continua legível mesmo quando o registro de `alunos` não
existir.

**Alternatives considered**: Impedir qualquer exclusão de aluno ou apagar em
cascata. A primeira quebra o fluxo operacional atual; a segunda viola a
rastreabilidade financeira.

## Decision: Registrar um pagamento integral por mensalidade no MVP

**Rationale**: A especificação limita a primeira versão a uma quitação por
competência. O registro terá valor recebido, data e atraso, deixando
parcelamento e pagamentos parciais para uma evolução explícita.

**Alternatives considered**: Criar múltiplos lançamentos de pagamento desde o
início. Isso exigiria regras adicionais de saldo, estorno e conciliação fora do
escopo atual.
