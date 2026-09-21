---
description: "Task list for driver, vehicle, and route allocation management"
---

# Tarefas: Gestão de Motoristas e Veículos

> Esta feature foi cancelada após a revisão do produto. O usuário autenticado será
> tratado como o próprio motorista; estas tarefas permanecem apenas como histórico.

**Entrada**: Documentos de design em `/specs/005-driver-vehicle-management/`

**Pré-requisitos**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Testes**: Não há framework de testes automatizados configurado; a validação usa os checks de sintaxe, diff, API e navegador autenticado já existentes.

## Fase 1: Preparação (Infraestrutura compartilhada)

**Objetivo**: Preparar a persistência e a separação dos módulos da feature.

- [X] T001 [P] Criar a migração de `motoristas`, `veiculos` e `alocacoes_rota` em `supabase/migrations/20260921000000_create_motoristas_veiculos.sql`, incluindo identificadores normalizados e únicos, flags de atividade, timestamps, referências de rota, snapshots e datas históricas de alocação.
- [X] T002 [P] Criar a estrutura dos módulos de rotas autenticadas em `src/routes/motoristaRoutes.js`, `src/routes/veiculoRoutes.js` e `src/routes/alocacaoRoutes.js`, seguindo as convenções existentes de middleware e erros.
- [X] T003 [P] Adicionar as seções de motoristas, veículos, alocações e escala em `src/public/protected.html`, com regiões de status acessíveis e controles adequados para celular.
- [X] T004 [P] Adicionar estilos responsivos de motoristas, veículos, alocações e alertas de capacidade em `src/public/auth.css`.

---

## Fase 2: Fundação (Pré-requisitos bloqueadores)

**Objetivo**: Estabelecer validação, normalização, autenticação e integração com o servidor antes das histórias.

**CRÍTICO**: Nenhuma história pode começar antes da conclusão desta fase.

- [X] T005 Registrar `motoristaRoutes`, `veiculoRoutes` e `alocacaoRoutes` em `/api` no `src/server.js`, preservando o comportamento autenticado existente.
- [X] T006 Implementar helpers compartilhados de normalização e validação em `src/routes/motoristaRoutes.js`, `src/routes/veiculoRoutes.js` e `src/routes/alocacaoRoutes.js` para nomes sem espaços excedentes, documentos e placas normalizados, telefones válidos, capacidade inteira positiva, ano apenas informativo, registros ativos e rotas ativas.
- [X] T007 Implementar logging operacional consistente e tratamento de erros de banco/provedor nos três módulos, sem registrar documentos, telefones, credenciais ou tokens.
- [X] T008 Verificar as constraints da migração e o comportamento de acesso no Supabase existente, incluindo referências históricas não cascata e exigência do middleware de autenticação.

**Checkpoint**: Persistência, autenticação, validação e registro das rotas prontos.

---

## Fase 3: História 1 - Cadastrar motorista (Prioridade: P1)

**Objetivo**: Permitir que usuários autenticados criem, listem, editem e desativem motoristas sem perder o histórico.

**Teste independente**: Criar um motorista válido, confirmá-lo na lista ativa, rejeitar documento normalizado duplicado, desativá-lo e confirmar que ele não aparece em novas alocações, mantendo os dados históricos.

### Implementação da História 1

- [X] T009 [P] [US1] Implementar `GET /api/motoristas?inativos=true` e `POST /api/motoristas` em `src/routes/motoristaRoutes.js`, retornando ativos por padrão e persistindo `documento_normalizado`.
- [X] T010 [US1] Implementar `PUT /api/motoristas/:id` e `DELETE /api/motoristas/:id` lógico em `src/routes/motoristaRoutes.js`, preservando registros, atualizando `updated_at` e encerrando automaticamente as alocações vigentes do motorista.
- [X] T011 [US1] Adicionar formulário, lista, controles de edição/desativação, filtros de ativos/inativos e estados de carregamento, vazio, duplicidade e validação em `src/public/protected.html`.
- [X] T012 [US1] Implementar carregamento, criação, edição, desativação, tratamento de duplicidade e atualização de motoristas autenticados em `src/public/auth.js`, usando `src/public/api-client.js`.

**Checkpoint**: A História 1 está funcional e testável de forma independente.

---

## Fase 4: História 2 - Cadastrar veículo (Prioridade: P1)

**Objetivo**: Permitir que usuários autenticados gerenciem veículos com placas normalizadas e capacidade validada.

**Teste independente**: Criar veículo válido, confirmar seus dados e status ativo, rejeitar placa normalizada duplicada e capacidade inválida, desativá-lo e confirmar que não pode ser selecionado em novas alocações.

### Implementação da História 2

- [X] T013 [P] [US2] Implementar `GET /api/veiculos?inativos=true` e `POST /api/veiculos` em `src/routes/veiculoRoutes.js`, armazenando placa exibida e normalizada, `modelo` sem espaços excedentes, `ano` informativo e `capacidade` inteira positiva.
- [X] T014 [US2] Implementar `PUT /api/veiculos/:id` e `DELETE /api/veiculos/:id` lógico em `src/routes/veiculoRoutes.js`, preservando registros, referências históricas e encerrando automaticamente as alocações vigentes do veículo.
- [X] T015 [US2] Adicionar formulário, lista, controles de edição/desativação, filtros de ativos/inativos, validação de capacidade, feedback de duplicidade e estados vazios em `src/public/protected.html`.
- [X] T016 [US2] Implementar carregamento, criação, edição, desativação, tratamento de duplicidade e atualização de veículos autenticados em `src/public/auth.js`.

**Checkpoint**: A História 2 está funcional e testável de forma independente.

---

## Fase 5: História 3 - Associar equipe e veículo à rota (Prioridade: P1)

**Objetivo**: Associar um motorista e um veículo ativos a uma rota ativa, preservando as alocações anteriores.

**Teste independente**: Associar registros ativos a uma rota ativa, recarregar e confirmar a associação atual, substituir um registro e confirmar o encerramento da alocação anterior, rejeitando inativos e alterações em rota desativada.

### Implementação da História 3

- [X] T017 [US3] Implementar as operações de persistência de `alocacoes_rota` em `src/routes/alocacaoRoutes.js`, encerrando a alocação atual e inserindo um novo snapshot com `inicio_em`, `fim_em` e `created_by` em operação consistente.
- [X] T018 [US3] Implementar `GET /api/rotas/:id/alocacao` e `PUT /api/rotas/:id/alocacao` em `src/routes/alocacaoRoutes.js`, rejeitando rotas, motoristas e veículos inativos com respostas claras `400`/`404`.
- [X] T019 [US3] Implementar `GET /api/alocacoes?rota_id=&data_inicio=&data_fim=` em `src/routes/alocacaoRoutes.js`, com filtros inclusivos de data e snapshots históricos.
- [X] T020 [US3] Adicionar controles de alocação de rota em `src/public/protected.html`, incluindo seletores de motorista e veículo ativos, associação atual, feedback de substituição e histórico.
- [X] T021 [US3] Integrar carregamento, associação, substituição, tratamento de opções inativas e atualização do histórico em `src/public/auth.js`.

**Checkpoint**: A História 3 está funcional de forma independente e preserva o histórico de alocações.

---

## Fase 6: História 4 - Consultar escala operacional (Prioridade: P2)

**Objetivo**: Exibir em cada rota a equipe atual, o veículo, a quantidade de passageiros, a capacidade, o status incompleto e o alerta de lotação.

**Teste independente**: Consultar rotas completas, incompletas e lotadas e confirmar que todos os estados são claros sem ocultar nenhuma rota.

### Implementação da História 4

- [X] T022 [US4] Definir um endpoint único de escala em `src/routes/alocacaoRoutes.js` para retornar alocação atual, quantidade de passageiros, capacidade, ausência de associação e alerta de lotação.
- [X] T023 [US4] Renderizar a escala operacional consolidada e os alertas de capacidade em `src/public/protected.html` e `src/public/auth.css`, preservando uso mobile e textos de status acessíveis.
- [X] T024 [US4] Implementar carregamento da escala, estado vazio, estado de rota incompleta, alerta de lotação e atualização em `src/public/auth.js`.

**Checkpoint**: Todas as histórias são demonstráveis de forma independente pela interface autenticada.

---

## Fase 7: Polimento e preocupações transversais

**Objetivo**: Validar a feature, documentar a operação e proteger os fluxos existentes.

- [X] T025 [P] Atualizar o `README.md` com instruções da migração, endpoints de motoristas e veículos, regras do histórico de alocações, normalização e alertas de capacidade.
- [X] T026 [P] Executar `node --check` em `src/routes/motoristaRoutes.js`, `src/routes/veiculoRoutes.js`, `src/routes/alocacaoRoutes.js`, `src/server.js` e `src/public/auth.js`.
- [X] T027 [P] Executar `git diff --check` e revisar o diff completo em busca de segredos, dados pessoais, alterações não relacionadas e exclusão insegura de histórico.
- [ ] T028 Executar todos os cenários de `specs/005-driver-vehicle-management/quickstart.md`, incluindo `401` sem autenticação, normalização duplicada, registros inativos, encerramento automático, histórico de substituição, desativação de rota, alertas de capacidade e layout mobile.
- [ ] T029 Verificar que os fluxos existentes de alunos, mensalidades, rotas e embarques continuam disponíveis após a integração da nova interface e das novas rotas.

---

## Dependências e ordem de execução

### Dependências entre fases

- **Preparação (Fase 1)**: T001–T004 podem executar em paralelo com coordenação dos arquivos.
- **Fundação (Fase 2)**: Depende da preparação e bloqueia todas as histórias.
- **Histórias**: US1 e US2 podem executar em paralelo após a Fase 2. US3 depende de ambas porque as alocações usam motoristas e veículos ativos. US4 depende de US3.
- **Polimento (Fase 7)**: Depende das histórias desejadas.

### Dependências entre histórias

- **US1 (P1)**: Depende apenas da Fase 2.
- **US2 (P1)**: Depende apenas da Fase 2.
- **US3 (P1)**: Depende de US1 e US2.
- **US4 (P2)**: Depende de US3.

### Oportunidades de paralelismo

- T001–T004 podem executar em paralelo com coordenação dos arquivos.
- T009–T012 e T013–T016 podem ser divididas entre o trabalho de motoristas e veículos após a Fase 2.
- T025–T027 podem executar em paralelo após a implementação.

## Estratégia de implementação

### MVP primeiro

1. Concluir a Fase 1 e a Fase 2.
2. Concluir US1 e US2 em paralelo ou sequencialmente.
3. Concluir US3 para tornar a associação à rota operacional.
4. Parar e validar o MVP: cadastro de motorista e veículo, além da associação à rota.
5. Adicionar US4 para a escala consolidada e os alertas de capacidade.
6. Concluir a Fase 7 e executar o quickstart completo antes da entrega.
