---
description: "Lista de tarefas para a interface mobile de gestão de passageiros"
---

# Tasks: Student Management Mobile Interface

**Input**: Artefatos de design em `/specs/001-student-management-ui/`

**Pré-requisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/alunos-api.md` e `quickstart.md`

**Testes automatizados**: Não incluídos; a especificação não solicitou TDD nem
um novo framework de testes. A validação manual reproduzível está no `quickstart.md`.

## Formato

`[ID] [P?] [Story] Descrição`

- **[P]**: pode ser executada em paralelo, sem depender de outra tarefa.
- **[Story]**: história de usuário relacionada.
- Cada tarefa informa os caminhos exatos dos arquivos envolvidos.

## Fase 1: Preparação

**Objetivo**: Preparar a estrutura mínima da aplicação web sem alterar o contrato
existente da API.

- [ ] T001 Criar a estrutura de frontend estático em `src/public/index.html`,
  `src/public/styles.css` e `src/public/app.js`, conforme o plano.
- [ ] T002 [P] Documentar no código e na configuração como o frontend será servido
  pelo Express, mantendo a porta e as variáveis de ambiente existentes.

---

## Fase 2: Fundamentos

**Objetivo**: Estabelecer serving, autenticação, cliente HTTP e estados comuns antes
de implementar as histórias.

- [ ] T003 Atualizar `src/server.js` para servir `src/public/` e manter `/api` e a
  rota de saúde existentes funcionando.
- [ ] T004 Implementar em `src/public/app.js` o cliente de requisições para
  `GET /api/alunos` e `POST /api/alunos`, tratando respostas não-2xx sem afirmar
  sucesso indevidamente.
- [ ] T005 Integrar `src/public/app.js` com o mecanismo de autenticação existente,
  enviando a sessão ou token vigente e bloqueando a interface quando o usuário não
  estiver autenticado; não criar um login paralelo.
- [ ] T006 [P] Definir em `src/public/styles.css` tokens visuais, tipografia,
  espaçamento, foco visível e breakpoints mobile-first sem expor dados sensíveis.
- [ ] T007 [P] Definir em `src/public/index.html` a estrutura semântica base,
  regiões de status acessíveis e navegação entre listagem, detalhes e cadastro.

**Checkpoint**: O Express serve a interface, a autenticação é respeitada e o cliente
possui estados de carregamento e erro reutilizáveis.

---

## Fase 3: História 1 - Visualizar a lista de passageiros (P1) 🎯 MVP

**Objetivo**: Permitir que um operador autenticado consulte passageiros em uma lista
legível e utilizável no celular.

**Teste independente**: Com a API contendo registros, abrir a interface em viewport
de celular e confirmar que os passageiros são exibidos sem rolagem horizontal; repetir
com resposta vazia, carregando e com erro.

- [ ] T008 [P] [US1] Criar em `src/public/index.html` o cabeçalho, container da
  lista, controles de atualização e estados de carregamento, vazio e erro.
- [ ] T009 [P] [US1] Implementar em `src/public/styles.css` cards ou linhas
  responsivas para nome, escola, turma, responsável, telefone, valor e vencimento,
  incluindo comportamento para textos longos.
- [ ] T010 [US1] Implementar em `src/public/app.js` o carregamento inicial de
  `GET /api/alunos`, renderizando registros, estado vazio e mensagem de recuperação
  quando a API falhar.
- [ ] T011 [US1] Adicionar em `src/public/app.js` atualização explícita da lista após
  carregamento e após cadastro confirmado, sem manter uma cópia local como fonte de
  verdade.
- [ ] T012 [US1] Validar manualmente a história 1 seguindo os cenários 1, 2, 3 e 6
  de `specs/001-student-management-ui/quickstart.md` em viewport móvel e desktop.

**Checkpoint**: A listagem autenticada é independente e operacional.

---

## Fase 4: História 2 - Cadastrar passageiro pelo celular (P1)

**Objetivo**: Permitir cadastro rápido, validado e confirmado de um passageiro.

**Teste independente**: Preencher os campos válidos, enviar, confirmar a resposta de
sucesso e verificar o novo registro na lista; repetir com campos ausentes ou inválidos.

- [ ] T013 [P] [US2] Criar em `src/public/index.html` o formulário de cadastro com
  `nome`, `escola`, `valor`, `vencimento`, `turma`, `professora`, `responsavel` e
  `telefone`, usando labels e tipos de campo adequados.
- [ ] T014 [P] [US2] Estilizar em `src/public/styles.css` o formulário para uso com
  uma mão em telas pequenas, com alvos de toque adequados, foco visível e mensagens
  de validação próximas aos campos.
- [ ] T015 [US2] Implementar em `src/public/app.js` validação client-side dos campos
  obrigatórios e dos valores numéricos antes de chamar `POST /api/alunos`.
- [ ] T016 [US2] Implementar em `src/public/app.js` submissão para `POST /api/alunos`,
  estado de envio, confirmação somente após status `201` e tratamento de erro sem
  apagar os valores preenchidos.
- [ ] T017 [US2] Após sucesso em `src/public/app.js`, limpar o formulário somente
  depois da confirmação, atualizar a lista pelo backend e posicionar o usuário em uma
  visão que mostre o registro criado.
- [ ] T018 [US2] Validar manualmente a história 2 seguindo os cenários 4 e 5 de
  `specs/001-student-management-ui/quickstart.md`, incluindo falha de API e prevenção
  de duplo envio.

**Checkpoint**: Cadastro autenticado, validado e refletido pelo backend.

---

## Fase 5: História 3 - Consultar detalhes do passageiro (P2)

**Objetivo**: Permitir consulta detalhada sem oferecer edição ou exclusão na primeira
versão.

**Teste independente**: Selecionar um passageiro da lista e confirmar que seus dados
são apresentados em uma visão adequada para celular, sem controles de alteração.

- [ ] T019 [P] [US3] Criar em `src/public/index.html` a região ou painel de detalhes
  associado a cada passageiro, incluindo uma forma clara de retornar à lista.
- [ ] T020 [P] [US3] Estilizar em `src/public/styles.css` o painel de detalhes para
  telas pequenas e leitores de tela, preservando quebra de textos longos.
- [ ] T021 [US3] Implementar em `src/public/app.js` abertura dos detalhes a partir da
  lista usando os dados confirmados pelo backend, com tratamento para registro
  indisponível ou incompleto.
- [ ] T022 [US3] Garantir em `src/public/index.html` e `src/public/app.js` que não
  existam ações de editar ou excluir passageiros nesta versão.
- [ ] T023 [US3] Validar manualmente a história 3 em viewport móvel, incluindo retorno
  à lista e ausência de controles de alteração.

**Checkpoint**: Consulta de detalhes funciona sem ampliar o escopo para manutenção.

---

## Fase 6: Polimento e preocupações transversais

**Objetivo**: Concluir acessibilidade, segurança operacional, documentação e validação.

- [ ] T024 [P] Revisar `src/public/index.html` para semântica, labels, ordem de foco,
  mensagens de status e navegação por teclado.
- [ ] T025 [P] Revisar `src/public/styles.css` para ausência de rolagem horizontal
  em larguras móveis, contraste adequado e estados de foco.
- [ ] T026 [P] Revisar `src/public/app.js` para não registrar credenciais, tokens ou
  dados pessoais em logs e para não mascarar erros de autenticação ou API.
- [ ] T027 Atualizar `README.md` com a forma de abrir a interface, autenticação
  necessária e os cenários de validação do `quickstart.md`.
- [ ] T028 Executar todos os cenários de `specs/001-student-management-ui/quickstart.md`
  e registrar qualquer bloqueio de autenticação, contrato da API ou responsividade
  antes de considerar a entrega completa.

---

## Dependências e ordem de execução

### Dependências das fases

- **Preparação (Fase 1)**: inicia imediatamente.
- **Fundamentos (Fase 2)**: depende da Fase 1 e bloqueia as histórias.
- **Histórias 1, 2 e 3**: dependem da Fase 2.
- **Polimento (Fase 6)**: depende das histórias que forem entregues.

### Dependências entre histórias

- **US1 (P1)**: pode iniciar após a Fase 2; é o MVP recomendado.
- **US2 (P1)**: pode iniciar após a Fase 2; compartilha o cliente API com US1.
- **US3 (P2)**: pode iniciar após a Fase 2; usa os registros renderizados por US1.

### Ordem dentro de cada história

Estrutura e estilos podem ser feitos em paralelo quando marcados com `[P]`.
Integração e validação dependem da estrutura correspondente. A lista e o cadastro
devem ser validados antes da consulta de detalhes.

## Oportunidades de execução paralela

- T006 e T007 podem executar em paralelo após T001.
- T008 e T009 podem executar em paralelo após T003–T007.
- T013 e T014 podem executar em paralelo após T003–T007.
- T019 e T020 podem executar em paralelo após T003–T007.
- T024, T025 e T026 podem executar em paralelo após as três histórias.
- US1 e US2 podem ser desenvolvidas em paralelo após os fundamentos.

## Estratégia de implementação

1. Entregar o MVP com fundamentos e US1: acesso autenticado e lista confiável.
2. Adicionar US2 para completar o ciclo operacional de cadastro.
3. Adicionar US3 para consulta detalhada sem edição.
4. Executar o polimento e todos os cenários do quickstart.

