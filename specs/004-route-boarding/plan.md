# Implementation Plan: Gestão de rotas e embarque

**Branch**: `feature/rotas-embarque` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

## Summary

Implementar o cadastro autenticado de rotas, a associação ordenada de alunos e o controle diário de embarque em uma única operação por rota e data. A solução seguirá o monólito Express/Supabase e a interface JavaScript responsiva já existente, com snapshots de identificação para preservar o histórico indefinidamente após a remoção operacional de um aluno.

## Technical Context

**Language/Version**: JavaScript, Node.js 24
**Primary Dependencies**: Express 5, Supabase JS 2.x, frontend JavaScript puro
**Storage**: PostgreSQL via Supabase
**Testing**: Validação manual end-to-end documentada, `node --check` e `git diff --check`; não há framework de testes configurado
**Target Platform**: Servidor Linux com acesso por navegador em desktop e celular
**Project Type**: Aplicação web monolítica com API autenticada
**Performance Goals**: Lista diária de até 50 passageiros exibida em até 2 segundos em condições normais
**Constraints**: Todas as rotas e registros exigem sessão válida; datas futuras não podem receber embarque; histórico não pode ser apagado por exclusão de aluno
**Scale/Scope**: MVP para uma operação escolar, rotas com dezenas de alunos, sem GPS, navegação, otimização de percurso ou ida/volta separadas

## Constitution Check

* **Produto orientado à operação real**: PASS — prioriza organização da rota e registro rápido no celular.
* **Dados confiáveis e auditáveis**: PASS — unicidade, ordem, estados válidos, snapshots e responsável/data do registro.
* **Qualidade obrigatória**: PASS — cenários end-to-end, checagens sintáticas e validação de integridade serão documentados.
* **Segurança e privacidade**: PASS — middleware de autenticação, mensagens sem dados desnecessários e logs sem informações pessoais.
* **Simplicidade e evolução incremental**: PASS — reutiliza o monólito e limita o MVP a uma operação diária sem GPS.

## Project Structure

```text
specs/004-route-boarding/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── rotas-embarque-api.md

src/
├── routes/
│   ├── alunoRoutes.js
│   ├── mensalidadeRoutes.js
│   └── rotaRoutes.js
├── public/
│   ├── protected.html
│   ├── auth.js
│   └── auth.css
└── server.js

supabase/migrations/
└── 20260918192000_create_rotas_embarques.sql
```

**Structure Decision**: manter a estrutura única existente; a API será adicionada em `src/routes/rotaRoutes.js`, a migração em `supabase/migrations/` e os controles na página protegida existente.

## Phase 0: Research

1. Confirmar o padrão de autenticação e tratamento de erros das rotas atuais.
2. Definir constraints PostgreSQL para associação única, ordem e registro diário idempotente.
3. Definir a estratégia de snapshots para preservar o histórico após exclusão de aluno.
4. Definir o fluxo responsivo de seleção de rota, data e atualização individual de estado.

## Phase 1: Design

1. Criar as tabelas `rotas`, `rota_alunos` e `embarques_diarios`, índices e políticas de exclusão não destrutivas.
2. Implementar contratos de listagem/criação/edição de rotas, associação e ordenação de passageiros.
3. Implementar consulta e atualização idempotente do embarque diário e filtros do histórico.
4. Integrar os formulários, estados e mensagens à página protegida.
5. Executar os cenários do quickstart e atualizar README com a migração e os endpoints.

## Complexity Tracking

Nenhuma violação da constituição identificada; não há complexidade excepcional a justificar.
