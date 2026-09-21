# Feature Specification: Gestão de Motoristas e Veículos

**Feature Branch**: `feature/motoristas-veiculos`
**Created**: 2026-09-21
**Status**: Cancelada — substituída pelo modelo em que o usuário autenticado é o próprio motorista
**Entrada**: Descrição do usuário: "Cadastro e gestão de motoristas e veículos associados às rotas"

## Cenários de uso e testes

### História de usuário 1 - Cadastrar motorista (Prioridade: P1)

Um coordenador precisa cadastrar e consultar motoristas que operam o transporte escolar, mantendo os dados necessários para contato e operação.

**Why this priority**: Sem motoristas identificados, a coordenação não consegue saber quem é responsável por cada rota.

**Teste independente**: Cadastrar um motorista válido, consultar a lista e confirmar que seus dados aparecem corretamente.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado, **When** informa nome, telefone e documento válidos, **Then** o motorista é cadastrado e aparece na lista.
2. **Given** que um campo obrigatório está vazio ou duplicado, **When** o usuário tenta salvar, **Then** o sistema rejeita o cadastro e informa o que deve ser corrigido.
3. **Given** que um motorista não está mais disponível, **When** o usuário o desativa, **Then** ele deixa de aparecer como opção para novas associações, sem perder seu histórico.
4. **Given** que um motorista está alocado a uma rota, **When** ele é desativado, **Then** a alocação vigente é encerrada automaticamente e a rota fica sinalizada como incompleta.

---

### História de usuário 2 - Cadastrar veículo (Prioridade: P1)

Um coordenador precisa registrar os veículos disponíveis, incluindo identificação, capacidade e situação operacional.

**Why this priority**: A capacidade e a identificação do veículo são essenciais para planejar rotas com segurança.

**Teste independente**: Cadastrar um veículo válido, consultar sua lista e confirmar os dados de identificação e capacidade.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado, **When** informa placa, modelo, capacidade e ano válidos, **Then** o veículo é cadastrado e aparece na lista.
2. **Given** que a placa já está cadastrada ou a capacidade é inválida, **When** o usuário tenta salvar, **Then** o sistema rejeita a operação com mensagem clara.
3. **Given** que um veículo está indisponível, **When** o usuário o desativa, **Then** ele não pode ser escolhido para novas associações e seu histórico é preservado.
4. **Given** que um veículo está alocado a uma rota, **When** ele é desativado, **Then** a alocação vigente é encerrada automaticamente e a rota fica sinalizada como incompleta.

---

### História de usuário 3 - Associar equipe e veículo à rota (Prioridade: P1)

Um coordenador precisa vincular um motorista e um veículo a cada rota ativa para saber quem executará a operação diária.

**Why this priority**: A associação transforma os cadastros em uma escala operacional utilizável junto ao controle de embarques.

**Teste independente**: Selecionar uma rota ativa, associar motorista e veículo disponíveis e recarregar a rota para confirmar a associação.

**Acceptance Scenarios**:

1. **Given** uma rota ativa e opções disponíveis, **When** o coordenador associa motorista e veículo, **Then** a rota mostra os responsáveis atuais.
2. **Given** que motorista ou veículo está inativo, **When** o coordenador tenta associá-lo, **Then** o sistema impede a operação e informa a indisponibilidade.
3. **Given** que a rota já possui equipe e veículo, **When** o coordenador substitui um deles, **Then** a nova associação passa a ser exibida e a anterior permanece no histórico operacional.
4. **Given** uma rota desativada, **When** o coordenador tenta alterar sua associação, **Then** o sistema impede a alteração até que a rota seja reativada.

---

### História de usuário 4 - Consultar escala operacional (Prioridade: P2)

Um coordenador precisa visualizar as rotas com motorista, veículo, capacidade e quantidade de passageiros para identificar rapidamente a operação do dia.

**Why this priority**: A visão consolidada reduz consultas manuais antes da saída dos veículos.

**Teste independente**: Abrir a visão de escala e confirmar que cada rota exibe sua equipe, veículo, capacidade e passageiros associados.

**Acceptance Scenarios**:

1. **Given** rotas com e sem associações, **When** o coordenador consulta a escala, **Then** cada rota informa claramente os dados presentes e os itens pendentes.
2. **Given** um veículo cuja capacidade é menor que a quantidade de passageiros da rota, **When** a escala é consultada, **Then** o sistema destaca a incompatibilidade sem ocultar a rota.

### Edge Cases

- Placas devem ser comparadas de forma normalizada, sem permitir duplicidade por diferenças de formatação.
- Nome, telefone e documento não podem ficar expostos para usuários não autenticados.
- A desativação de motorista ou veículo não deve remover associações e históricos já registrados.
- A desativação de motorista ou veículo deve encerrar automaticamente qualquer alocação vigente que o utilize.
- Uma rota sem motorista ou veículo deve continuar consultável e ser sinalizada como incompleta.
- A capacidade deve ser um número inteiro positivo e a lotação excedente deve gerar alerta.
- O sistema não precisa impedir que a mesma pessoa ou veículo apareça em mais de uma rota; conflitos de agenda ficam fora desta versão.

## Requirements

### Functional Requirements

- **FR-001**: O sistema MUST permitir que usuários autenticados cadastrem, consultem, editem e desativem motoristas.
- **FR-002**: O sistema MUST armazenar nome, telefone, documento identificador e situação ativa do motorista.
- **FR-003**: O sistema MUST impedir duplicidade de motorista pelo documento normalizado.
- **FR-004**: O sistema MUST permitir que usuários autenticados cadastrem, consultem, editem e desativem veículos.
- **FR-005**: O sistema MUST armazenar placa normalizada, modelo, ano, capacidade e situação ativa do veículo.
- **FR-006**: O sistema MUST impedir duplicidade de veículos pela placa normalizada.
- **FR-007**: O sistema MUST validar telefone, documento e capacidade antes de confirmar um cadastro; o ano do veículo é apenas informativo.
- **FR-008**: O sistema MUST permitir associar um motorista e um veículo ativos a uma rota ativa.
- **FR-009**: O sistema MUST impedir novas associações com motoristas ou veículos inativos.
- **FR-010**: O sistema MUST permitir substituir as associações atuais sem apagar o histórico operacional anterior.
- **FR-011**: O sistema MUST impedir alterações de equipe e veículo em rotas desativadas.
- **FR-012**: O sistema MUST exibir uma escala consolidada com rota, motorista, veículo, capacidade e quantidade de passageiros.
- **FR-013**: O sistema MUST alertar quando a quantidade de passageiros superar a capacidade do veículo.
- **FR-014**: O sistema MUST exigir autenticação para todas as operações e não expor dados pessoais em respostas públicas ou logs.
- **FR-015**: O sistema MUST preservar registros e associações históricas quando motoristas ou veículos forem desativados.
- **FR-016**: O sistema MUST encerrar automaticamente as alocações vigentes que utilizem um motorista ou veículo desativado, preservando seus snapshots históricos.

### Key Entities

- **Motorista**: pessoa autorizada a operar uma ou mais rotas, com nome, telefone, documento e situação operacional.
- **Veículo**: unidade usada no transporte, com placa, modelo, ano, capacidade e situação operacional.
- **Alocação de rota**: vínculo histórico entre uma rota, um motorista e um veículo durante um período operacional.
- **Escala operacional**: visão consolidada das rotas, passageiros, equipe, veículo e alertas de capacidade.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Um usuário autenticado consegue cadastrar um motorista ou veículo válido em menos de dois minutos.
- **SC-002**: 100% das associações exibidas para novas operações usam apenas motoristas e veículos ativos.
- **SC-003**: A escala identifica uma rota sem equipe, sem veículo ou acima da capacidade sem exigir consulta adicional em pelo menos 95% dos casos testados.
- **SC-004**: 100% dos registros históricos permanecem consultáveis após a desativação do motorista, veículo ou rota associado.
- **SC-005**: Pelo menos 90% dos usuários conseguem concluir o cadastro e a associação de uma rota na primeira tentativa.

## Assumptions

- O recurso reutiliza a autenticação existente e fica disponível somente para usuários autenticados.
- Cada rota possui no máximo um motorista e um veículo ativos por vez.
- Um motorista ou veículo pode ser associado a mais de uma rota; conflitos de agenda não fazem parte desta versão.
- A associação anterior será preservada como histórico quando houver substituição.
- A desativação de motorista ou veículo encerra automaticamente suas alocações vigentes; a rota permanece disponível para nova associação.
- A gestão de documentos legais, vencimento de CNH, licenciamento e manutenção preventiva fica fora do escopo inicial.
- A capacidade do veículo representa a quantidade máxima de passageiros cadastrados na rota.
