# Implementation Plan: Student Payment Management

**Branch**: `feature/financeiro` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-student-payment-management/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Adicionar o controle autenticado de mensalidades por aluno e competência, com registro
de vencimento, consulta por filtros, registro de pagamento e preservação do histórico
quando o aluno for removido da operação. A implementação seguirá o padrão Express +
Supabase já usado pelo projeto, com uma tabela financeira própria, validação no
servidor e uma área responsiva integrada à página protegida existente.

## Technical Context

**Language/Version**: JavaScript (Node.js 24)

**Primary Dependencies**: Express 5, Supabase JS 2.x, navegador web sem framework

**Storage**: PostgreSQL via Supabase; tabela financeira relacionada a `alunos`

**Testing**: Validação manual end-to-end, checagem de sintaxe JavaScript e
`git diff --check`; não há suíte automatizada configurada no projeto

**Target Platform**: Navegadores móveis e desktop; servidor Linux com Node.js

**Project Type**: Aplicação web com API e interface responsiva

**Performance Goals**: Exibir consultas de até 1.000 mensalidades em até 2 segundos
em pelo menos 95% das tentativas em condições normais

**Constraints**: Acesso autenticado; validação server-side; sem gateway, boleto,
parcelamento ou conciliação bancária nesta versão; valores positivos e datas
válidas; nenhum segredo no cliente ou nos logs

**Scale/Scope**: Uma tela financeira responsiva, quatro operações de API e até
1.000 mensalidades por consulta no cenário inicial

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Produto orientado à operação real**: PASS — o fluxo reduz o controle manual de
  cobranças e permite identificar pendências diretamente na operação.
- **Dados confiáveis e auditáveis**: PASS — competência única por aluno, estados
  explícitos, valores/data validados e histórico preservado.
- **Qualidade obrigatória**: PASS — o plano inclui validação de sintaxe, cenários
  autenticados e checagens de duplicidade, pagamento e exclusão.
- **Segurança e privacidade**: PASS — todas as rotas financeiras reutilizam o
  middleware de autenticação e não expõem tokens ou credenciais.
- **Simplicidade e evolução incremental**: PASS — a solução reutiliza a estrutura
  atual e não introduz gateway, fila ou framework de frontend.

## Project Structure

### Documentation (this feature)

```text
specs/003-student-payment-management/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── routes/
│   ├── alunoRoutes.js
│   └── mensalidadeRoutes.js
├── middleware/
│   └── authMiddleware.js
├── public/
│   ├── protected.html
│   ├── auth.js
│   ├── api-client.js
│   └── auth.css
└── server.js
```

**Structure Decision**: Manter o monólito web existente. As regras financeiras
ficarão em `src/routes/mensalidadeRoutes.js`; a tela e os filtros serão adicionados
à área protegida atual, reutilizando `api-client.js`, autenticação e estilos.

## Post-Design Constitution Check

- **Produto orientado à operação real**: PASS — os artefatos cobrem cadastro,
  recebimento e identificação de pendências em um fluxo operacional único.
- **Dados confiáveis e auditáveis**: PASS — o modelo define restrição de
  unicidade, transições de estado, validações monetárias e snapshot histórico.
- **Qualidade obrigatória**: PASS — o quickstart contém cenários de sucesso,
  falhas, autenticação, exclusão e responsividade para validação antes da entrega.
- **Segurança e privacidade**: PASS — os contratos exigem autenticação e
  respostas genéricas para falhas, sem expor credenciais.
- **Simplicidade e evolução incremental**: PASS — a solução usa as dependências e
  superfícies existentes e mantém pagamentos parciais e integrações fora do MVP.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | A solução não viola os princípios da constituição. |
