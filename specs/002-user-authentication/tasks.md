---
description: "Lista de tarefas para autenticação de usuários com Supabase Auth"
---

# Tasks: User Authentication with Supabase Auth

**Input**: Artefatos de design em `/specs/002-user-authentication/`

## Fase 1: Preparação

- [X] T001 Criar middleware e os assets `src/public/login.html`,
  `src/public/protected.html`, `src/public/auth.css`, `src/public/auth.js` e
  `src/public/api-client.js`.
- [X] T002 [P] Documentar em `README.md` as variáveis de ambiente sem valores reais.
- [X] T003 [P] Confirmar em `.env.example` que a URL e a chave pública são carregadas
  por ambiente e não são versionadas.

## Fase 2: Fundamentos

- [X] T004 Implementar `src/middleware/authMiddleware.js` para exigir o cabeçalho
  `Authorization` com o esquema padrão de token e validar o token no Supabase.
- [X] T005 Atualizar `src/server.js` e manter a rota pública de saúde sem dados privados.
- [X] T006 Proteger `GET /api/alunos` e `POST /api/alunos` em
  `src/routes/alunoRoutes.js`.
- [X] T007 Retornar `401` para credencial ausente ou inválida e `503` quando o
  provedor estiver indisponível, sempre com corpo genérico.
- [X] T008 [P] Fazer `src/config/supabase.js` falhar explicitamente sem registrar segredos.

## Fase 3: História 1 - Entrar no sistema

- [X] T009 [P] [US1] Criar formulário de login por e-mail e senha em
  `src/public/login.html`, sem cadastro público.
- [X] T010 [P] [US1] Criar estilos responsivos e estados acessíveis em
  `src/public/auth.css`.
- [X] T011 [US1] Implementar login Supabase, validação e envio do token atual no
  cabeçalho `Authorization` com o esquema padrão de token em `src/public/auth.js`.
- [X] T012 [US1] Restaurar sessão após reload e reabertura normal do navegador,
  redirecionando para a área protegida e usando mensagens genéricas.
- [X] T013 [US1] Servir login e área protegida em `src/server.js` sem liberar a API.
- [X] T014 [US1] Validar login válido, inválido e restauração com `quickstart.md`.

## Fase 4: História 2 - Encerrar a sessão

- [X] T015 [P] [US2] Implementar logout em `src/public/auth.js`, limpar estado local
  e redirecionar para `login.html`.
- [X] T016 [P] [US2] Adicionar controle de logout e estado expirado em
  `src/public/protected.html`.
- [X] T017 [US2] Garantir que credenciais ausentes, expiradas, revogadas ou malformadas
  nunca alcancem handlers protegidos.
- [X] T018 [US2] Validar logout, acesso direto após logout e expiração ou revogação.

## Fase 5: História 3 - Proteger dados de alunos

- [X] T019 [P] [US3] Formalizar em `contracts/auth-api.md` cabeçalhos, `401`, `503`,
  corpos genéricos e invariantes das rotas de alunos.
- [X] T020 [US3] Aplicar proteção efetiva e preservar respostas `200` e `201`.
- [X] T021 [US3] Implementar em `src/public/api-client.js` o envio do token no
  cabeçalho `Authorization` com o esquema padrão de token, redirecionamento em `401`
  e tratamento temporário de `503`.
- [X] T022 [US3] Validar GET e POST sem autenticação, com token inválido e válido.
- [X] T023 [US3] Verificar que segredos e dados pessoais não aparecem em logs.

## Fase 6: Polimento

- [X] T024 [P] Revisar scripts para não armazenar ou registrar segredos.
- [X] T025 [P] Revisar middleware para status corretos e falhas explícitas do provedor.
- [X] T026 [P] Atualizar `README.md` com configuração e provisionamento manual.
- [X] T027 Executar todos os cenários de `quickstart.md`.
- [X] T028 Confirmar que os contratos de alunos permanecem íntegros para autenticados.

## Dependências

- Fase 2 depende da Fase 1 e bloqueia as histórias.
- US1, US2 e US3 dependem da Fase 2; US2 também depende de US1.
- Fase 6 depende das histórias implementadas.

## Phase 7: Convergence

- [X] T029 Corrigir `src/public/api-client.js` para enviar o token atual no cabeçalho
  `Authorization` usando o esquema padrão de token, remover a corrupção sintática
  existente e validar o carregamento da área protegida (FR-009, US3/AC3)
  (contradicts).
- [X] T030 Validar o ciclo completo de execução documentado em `README.md` e
  `quickstart.md`, mantendo o servidor ativo durante login, redirecionamento para
  `protected.html` e carregamento dos alunos; registrar uma orientação clara para
  reiniciar o servidor quando o processo for encerrado (SC-001, US1/AC1) (partial).
- [X] T031 Executar cenários de credencial ausente, malformada, inválida, expirada ou
  revogada e indisponibilidade do provedor contra `GET /api/alunos` e
  `POST /api/alunos`, confirmando `401`/`503`, ausência de execução dos handlers e
  mensagens genéricas (FR-010, FR-011, FR-012, SC-003) (partial).
