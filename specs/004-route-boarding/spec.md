# Feature Specification: Gestão de rotas e embarque

**Feature Branch**: `feature/rotas-embarque`
**Created**: 2026-09-18
**Status**: Draft
**Input**: User description: "Gestão de rotas e controle diário de embarque dos alunos"

## Clarifications

### Session 2026-09-18

- Q: Um mesmo aluno poderá ser associado a várias rotas ativas ao mesmo tempo? → A: Sim. O aluno pode pertencer a várias rotas, sem duplicidade dentro da mesma rota.
- Q: O registro diário deve ser controlado apenas por rota e data, ou deve diferenciar ida e volta? → A: Uma única operação diária por rota, sem distinção entre ida e volta.
- Q: Quando um aluno for removido do cadastro, por quanto tempo o histórico de embarques deve ser preservado? → A: Indefinidamente, sem exclusão automática.

## User Scenarios & Testing

### User Story 1 - Organizar rotas e passageiros (Priority: P1)

Como responsável pela operação, quero criar rotas e associar alunos cadastrados a cada rota em uma ordem definida, para organizar o atendimento diário e saber quais passageiros pertencem a cada percurso.

**Why this priority**: Sem uma rota configurada e seus passageiros associados, não é possível executar nem acompanhar o embarque diário.

**Independent Test**: Criar uma rota, adicionar dois alunos existentes e alterar a ordem deles; ao consultar a rota, os alunos devem aparecer na sequência definida.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado e existem alunos cadastrados, **When** cria uma rota com nome e descrição válidos, **Then** a rota aparece na lista de rotas disponíveis.
2. **Given** que uma rota existe, **When** associa um aluno à rota, **Then** o aluno aparece como passageiro da rota e não pode ser associado duas vezes à mesma rota.
3. **Given** que uma rota possui vários alunos, **When** o usuário altera a ordem dos passageiros, **Then** a nova ordem é preservada ao reabrir a rota.
4. **Given** que o usuário tenta salvar uma rota sem nome, **When** confirma o cadastro, **Then** o sistema rejeita a operação e informa o campo obrigatório.

---

### User Story 2 - Controlar embarque diário (Priority: P1)

Como motorista ou responsável pela operação, quero abrir a lista de uma rota para uma data e marcar o estado de cada aluno, para registrar quem embarcou, faltou ou não utilizará o transporte naquele dia.

**Why this priority**: O registro diário de embarque é a principal evidência da execução da rota e reduz dúvidas sobre a presença dos alunos.

**Independent Test**: Selecionar uma rota e uma data, marcar alunos com estados diferentes e atualizar a tela; cada estado deve permanecer associado ao aluno e à data correta.

**Acceptance Scenarios**:

1. **Given** que uma rota possui passageiros, **When** o usuário abre a lista para uma data, **Then** todos os passageiros aparecem com estado inicial "Pendente".
2. **Given** que um passageiro está pendente, **When** o usuário marca "Embarcou", **Then** o registro é salvo e mostra a hora do registro.
3. **Given** que um passageiro está pendente, **When** o usuário marca "Faltou" ou "Não utilizará", **Then** o estado correspondente é salvo e fica visível na lista diária.
4. **Given** que o usuário já registrou o embarque de um aluno para uma data, **When** consulta a mesma rota novamente, **Then** o estado registrado é recuperado sem criar um segundo registro.
5. **Given** que a data selecionada está no futuro, **When** o usuário consulta a lista, **Then** os passageiros aparecem como `Pendente`; **When** tenta registrar um estado, **Then** o sistema impede o registro e informa que o embarque só pode ser confirmado para a data atual ou passada.

---

### User Story 3 - Consultar histórico operacional (Priority: P2)

Como responsável pela operação, quero consultar o histórico de embarques por rota, aluno e período, para revisar faltas e confirmar a execução do transporte.

**Why this priority**: O histórico permite acompanhamento e prestação de contas, mas depende das rotas e registros diários das histórias anteriores.

**Independent Test**: Registrar embarques em pelo menos duas datas e filtrar por rota, aluno e período; apenas os registros compatíveis devem ser exibidos.

**Acceptance Scenarios**:

1. **Given** que existem registros de embarque em datas diferentes, **When** o usuário informa um período, **Then** o histórico exibe somente registros dentro do período.
2. **Given** que existem registros de vários alunos, **When** o usuário filtra por aluno, **Then** o histórico exibe somente os registros daquele aluno.
3. **Given** que não existem registros para os filtros informados, **When** a consulta é realizada, **Then** o sistema mostra uma mensagem clara de nenhum resultado.

### Edge Cases

- Uma rota não pode ter dois passageiros com a mesma posição; ao reordenar, o sistema deve ajustar a sequência sem perder passageiros.
- Um aluno removido do cadastro não deve apagar o histórico de embarques já realizado; os registros históricos devem manter o nome do aluno no momento do registro.
- Um aluno pode pertencer a várias rotas ativas; a associação duplicada dentro da mesma rota deve ser rejeitada.
- Rotas sem passageiros devem poder ser criadas, mas a lista diária deve informar que não há alunos associados.
- Rotas desativadas não aparecem na operação ativa, mas permanecem consultáveis no histórico; uma rota desativada pode ser reativada por edição.
- Repetir uma ação de embarque para o mesmo aluno e data deve atualizar o estado existente, sem duplicar o registro.
- Usuários sem sessão válida não podem consultar rotas, passageiros ou histórico.
- Falhas de conexão ou indisponibilidade do serviço devem apresentar erro compreensível, sem perder dados já salvos.

## Requirements

### Functional Requirements

- **FR-001**: O sistema MUST permitir que usuários autenticados criem, editem, listem e removam rotas.
- **FR-001a**: Remover uma rota MUST desativá-la sem apagar passageiros ou histórico, e editar uma rota MUST permitir reativá-la.
- **FR-002**: O sistema MUST exigir um nome não vazio para cada rota e permitir uma descrição opcional.
- **FR-003**: O sistema MUST permitir associar alunos existentes a uma rota e remover associações sem apagar o cadastro do aluno.
- **FR-004**: O sistema MUST impedir que o mesmo aluno seja associado mais de uma vez à mesma rota, mas MUST permitir sua associação a várias rotas ativas.
- **FR-005**: O sistema MUST permitir definir e alterar a ordem dos passageiros de uma rota.
- **FR-006**: O sistema MUST exibir uma lista diária por rota e data contendo todos os passageiros associados à rota.
- **FR-007**: O sistema MUST iniciar novos registros diários no estado "Pendente".
- **FR-008**: O sistema MUST permitir os estados "Pendente", "Embarcou", "Faltou" e "Não utilizará".
- **FR-009**: O sistema MUST permitir registrar ou atualizar um único estado de embarque por aluno, rota e data.
- **FR-010**: O sistema MUST registrar a data e hora em que um embarque foi confirmado e o usuário autenticado responsável pela ação.
- **FR-010a**: O responsável pelo embarque MUST ser armazenado pelo identificador estável do usuário autenticado, sem armazenar token ou credencial.
- **FR-011**: O sistema MUST impedir novos registros para datas futuras.
- **FR-011a**: O sistema MUST permitir consultar listas futuras, exibindo registros como `Pendente`, mas MUST impedir confirmações para datas futuras.
- **FR-012**: O sistema MUST preservar o histórico de embarque mesmo quando o aluno for removido operacionalmente do cadastro.
- **FR-013**: O sistema MUST permitir consultar o histórico por rota, aluno e intervalo de datas.
- **FR-014**: O sistema MUST mostrar estados de carregamento, nenhum resultado e erro de forma compreensível na interface.
- **FR-015**: O sistema MUST restringir todas as operações de rotas, embarques e histórico a usuários autenticados.
- **FR-016**: O sistema MUST funcionar adequadamente em telas móveis usadas durante a operação da rota.
- **FR-017**: O sistema MUST evitar expor dados pessoais desnecessários em mensagens de erro e registros operacionais.

### Key Entities

- **Rota**: Percurso operacional identificado por nome, descrição opcional e situação ativa.
- **Passageiro da rota**: Associação entre uma rota e um aluno, com posição na sequência de atendimento e snapshot mínimo para histórico.
- **Registro diário de embarque**: Estado de um aluno em uma rota para uma data específica, com estado operacional, data/hora de confirmação e responsável pelo registro.
- **Histórico de embarque**: Conjunto consultável de registros diários preservados para auditoria operacional.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Um usuário autenticado consegue criar uma rota e associar pelo menos cinco alunos em até 3 minutos, sem instruções externas.
- **SC-002**: Um usuário consegue registrar o estado diário de 20 passageiros em até 2 minutos usando uma tela móvel.
- **SC-002a**: Em cinco medições com 20 passageiros, pelo menos quatro devem concluir o registro dos estados em até 2 minutos usando uma tela móvel.
- **SC-003**: Em uma validação com pelo menos 30 registros diários, 100% dos registros permanecem associados à rota, aluno e data corretos após recarregar a aplicação.
- **SC-004**: 100% das tentativas de duplicar uma associação ou registro diário são rejeitadas ou convertidas em atualização do registro existente, sem duplicidade persistida.
- **SC-005**: Consultas de histórico com filtros por rota, aluno e período retornam somente resultados compatíveis e exibem estado vazio quando não houver correspondências.
- **SC-006**: O histórico de embarques permanece disponível após a remoção operacional de um aluno em 100% dos cenários validados.

## Assumptions

- A autenticação existente será reutilizada e haverá um único nível operacional autorizado no MVP.
- O controle será feito por rota e data, sem rastreamento GPS, cálculo de distância, navegação ou otimização automática de percurso.
- "Embarcou", "Faltou" e "Não utilizará" serão estados manuais; o sistema não inferirá presença automaticamente.
- A data e hora do registro serão determinadas pelo relógio do sistema no momento da confirmação.
- O MVP controlará uma operação diária por rota; não haverá distinção entre ida e volta nesta primeira versão.
- Alunos já cadastrados serão a fonte para associação às rotas.
- O histórico será preservado indefinidamente, com um snapshot suficiente para identificar o aluno mesmo após sua remoção operacional.
