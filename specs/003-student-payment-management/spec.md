# Feature Specification: Student Payment Management

**Feature Branch**: `feature/financeiro`
**Created**: 2026-09-18
**Status**: Draft
**Input**: User description: "Controle de mensalidades e pagamentos dos alunos"

## Clarifications

### Session 2026-09-18

- Q: O pagamento deve ser aceito somente quando o valor recebido for exatamente igual ao valor da mensalidade? → A: Sim, o valor recebido deve ser exatamente igual ao valor da mensalidade.
- Q: O sistema deve impedir o registro de um pagamento com data posterior ao dia atual? → A: Sim, aceitar somente hoje ou datas passadas.

## User Scenarios & Testing

### User Story 1 - Registrar mensalidades dos alunos (Priority: P1)

Como responsável pela gestão financeira do transporte escolar, quero registrar a mensalidade de cada aluno com valor e dia de vencimento para saber o que deve ser cobrado em cada período.

**Why this priority**: Sem uma cobrança registrada não é possível acompanhar pagamentos ou inadimplência.

**Independent Test**: Selecionar um aluno, informar competência, valor e dia de vencimento e confirmar que a mensalidade aparece na lista financeira.

**Acceptance Scenarios**:

1. **Given** um aluno cadastrado e uma competência ainda sem mensalidade, **When** o usuário informa valor e dia de vencimento válidos e salva, **Then** a mensalidade é registrada com status "Pendente".
2. **Given** dados obrigatórios ausentes ou inválidos, **When** o usuário tenta salvar, **Then** o sistema impede o registro e informa os campos que precisam ser corrigidos.
3. **Given** uma mensalidade já registrada para o mesmo aluno e competência, **When** o usuário tenta criar outra, **Then** o sistema impede a duplicidade e mantém o registro original.

---

### User Story 2 - Registrar e consultar pagamentos (Priority: P1)

Como responsável pela gestão financeira, quero marcar uma mensalidade como paga e consultar os pagamentos realizados para acompanhar o recebimento de cada aluno.

**Why this priority**: O controle de recebimentos é o resultado operacional principal da funcionalidade.

**Independent Test**: Abrir uma mensalidade pendente, registrar a data do pagamento e confirmar que o status e o histórico refletem a quitação.

**Acceptance Scenarios**:

1. **Given** uma mensalidade pendente, **When** o usuário registra um pagamento válido, **Then** ela passa a exibir status "Pago", data de pagamento e valor recebido.
2. **Given** uma mensalidade paga, **When** o usuário consulta o histórico do aluno, **Then** o pagamento aparece associado à competência e ao registro da mensalidade.
3. **Given** um pagamento sem data ou cujo valor seja diferente do valor da mensalidade, **When** o usuário tenta confirmar, **Then** o sistema rejeita a operação e explica a correção necessária.

---

### User Story 3 - Identificar pendências financeiras (Priority: P2)

Como responsável pela gestão financeira, quero filtrar mensalidades por situação e período para identificar rapidamente cobranças pendentes ou vencidas.

**Why this priority**: A visualização de pendências orienta a cobrança e reduz esquecimentos.

**Independent Test**: Consultar a lista financeira e aplicar filtros de status e competência, verificando que somente os registros correspondentes são exibidos.

**Acceptance Scenarios**:

1. **Given** mensalidades pendentes, pagas e vencidas, **When** o usuário filtra por status "Pendente", **Then** apenas as mensalidades pendentes são exibidas.
2. **Given** uma mensalidade pendente cujo vencimento já passou, **When** o usuário consulta a situação, **Then** ela é identificada como "Vencida" sem alterar o valor originalmente registrado.
3. **Given** nenhum registro correspondente ao filtro, **When** o usuário realiza a consulta, **Then** o sistema informa que não há mensalidades para os critérios selecionados.

### Edge Cases

- O sistema deve rejeitar valores menores ou iguais a zero e dias de vencimento fora do intervalo de 1 a 31.
- Competências devem usar mês e ano válidos; a mesma competência não pode ser cadastrada duas vezes para o mesmo aluno.
- Se o dia de vencimento não existir em determinado mês, a cobrança deve usar o último dia válido daquele mês.
- O sistema deve rejeitar o pagamento quando o valor recebido for diferente do valor da mensalidade.
- O sistema deve rejeitar pagamentos com data posterior ao dia atual.
- Um pagamento feito depois do vencimento deve permanecer como pago e conservar a indicação de atraso.
- Alunos excluídos não devem perder o histórico financeiro já registrado.
- Falhas temporárias ao salvar ou consultar dados devem ser informadas sem apresentar confirmação de sucesso.

## Requirements

### Functional Requirements

- **FR-001**: O sistema MUST permitir selecionar um aluno cadastrado e registrar uma mensalidade para uma competência específica.
- **FR-002**: O sistema MUST exigir valor da mensalidade, competência e dia de vencimento válidos.
- **FR-003**: O sistema MUST iniciar toda nova mensalidade com status "Pendente".
- **FR-004**: O sistema MUST impedir mais de uma mensalidade para o mesmo aluno e competência.
- **FR-005**: O sistema MUST permitir consultar mensalidades por aluno, competência e status.
- **FR-006**: O sistema MUST identificar como "Vencida" uma mensalidade pendente cujo vencimento tenha passado.
- **FR-007**: O sistema MUST permitir registrar o pagamento de uma mensalidade pendente somente quando a data for válida e o valor recebido for exatamente igual ao valor da mensalidade.
- **FR-007a**: O sistema MUST rejeitar pagamentos com data posterior ao dia atual.
- **FR-008**: O sistema MUST atualizar o status para "Pago" após o registro de um pagamento válido.
- **FR-009**: O sistema MUST preservar a data de pagamento, o valor recebido e a indicação de atraso no histórico.
- **FR-010**: O sistema MUST permitir consultar o histórico financeiro de um aluno por competência.
- **FR-011**: O sistema MUST apresentar mensagens claras para validações, duplicidades, falhas de comunicação e ausência de resultados.
- **FR-012**: O sistema MUST restringir o acesso aos registros financeiros a usuários autenticados e autorizados.
- **FR-013**: O sistema MUST manter registros financeiros existentes quando o cadastro operacional do aluno for removido.

### Key Entities

- **Aluno**: Pessoa matriculada no transporte escolar, vinculada às mensalidades e ao histórico de pagamentos.
- **Mensalidade**: Cobrança de um aluno em uma competência, com valor, vencimento, status e dados de pagamento.
- **Pagamento**: Registro da quitação total ou recebida de uma mensalidade, com data, valor e indicação de atraso.
- **Competência**: Mês e ano usados para identificar o período financeiro da mensalidade.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Um usuário autenticado consegue registrar uma mensalidade válida em até 60 segundos.
- **SC-002**: Em uma consulta com até 1.000 mensalidades, 95% dos resultados aparecem para o usuário em até 2 segundos.
- **SC-003**: 100% das tentativas de duplicar a mensalidade do mesmo aluno e competência são bloqueadas.
- **SC-004**: 100% dos pagamentos confirmados exibem status, data e valor coerentes com o registro salvo.
- **SC-005**: Um usuário consegue localizar todas as mensalidades pendentes ou vencidas de uma competência em até três interações.
- **SC-006**: O histórico financeiro de um aluno permanece consultável após a remoção do aluno da lista operacional.

## Assumptions

- A funcionalidade será usada por usuários autenticados que já possuem acesso à gestão de alunos.
- A mensalidade representa uma cobrança recorrente por competência mensal e, nesta versão, será quitada por um único registro de pagamento.
- O valor é informado na moeda corrente do negócio e não há conversão cambial.
- A primeira versão não inclui integração com gateway de pagamento, emissão de boleto, envio automático de cobrança, conciliação bancária ou parcelamento.
- A remoção de um aluno é uma ação operacional e não autoriza apagar ou alterar seu histórico financeiro.
- Regras de acesso seguem as permissões já existentes para usuários autenticados da aplicação.
