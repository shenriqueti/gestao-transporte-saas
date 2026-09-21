# Plano de implementação: Gestão de Motoristas e Veículos

**Branch**: `feature/motoristas-veiculos` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Entrada**: Especificação em `/specs/005-driver-vehicle-management/spec.md`

## Resumo

Adicionar cadastros autenticados de motoristas e veículos e uma alocação
histórica por rota, reutilizando o servidor Express, o cliente Supabase e a
interface protegida existentes. A escala consumirá os vínculos atuais e
calculará alertas de capacidade sem apagar alocações anteriores.

## Contexto técnico

**Linguagem/versão**: JavaScript, Node.js 24

**Dependências principais**: Express 5, Supabase JS 2.x, HTML/CSS/JavaScript

**Armazenamento**: PostgreSQL via Supabase

**Testes**: `node --check`, `git diff --check`, verificações de API e quickstart no navegador autenticado

**Plataforma-alvo**: servidor Linux e navegadores web responsivos para celular

**Tipo de projeto**: aplicação web autenticada com API REST

**Metas de desempenho**: Carregar a escala operacional e as associações atuais em uma interação utilizável para o conjunto esperado de dados de transporte escolar.

**Restrições**: Preservar histórico, normalizar identificadores únicos, rejeitar associações inativas, evitar exposição de dados pessoais sem autenticação e manter as convenções atuais de API/interface.

**Escala/escopo**: Uma interface autenticada de operação, três novos conceitos persistidos e associações com rotas e passageiros existentes.

## Verificação da constituição

*GATE: Deve passar antes da pesquisa da Fase 0 e ser reavaliado após o design da Fase 1.*

| Critério | Resultado | Evidência |
|------|--------|----------|
| Valor operacional | APROVADO | A feature conclui a associação de rotas e a preparação da escala diária. |
| Integridade e auditoria dos dados | APROVADO | Identificadores únicos normalizados e histórico imutável de alocações estão previstos. |
| Qualidade da validação | APROVADO | Validação da API, checks de sintaxe, diff e quickstart no navegador estão incluídos. |
| Segurança e privacidade | APROVADO | O middleware de autenticação continua obrigatório; campos sensíveis permanecem protegidos. |
| Simplicidade e entrega incremental | APROVADO | O acesso direto ao Supabase segue os módulos existentes sem framework ou camada adicional. |

## Estrutura do projeto

### Documentação da feature

```text
specs/[###-feature]/
├── plan.md              # Plano de implementação
├── research.md          # Resultado da Fase 0
├── data-model.md        # Resultado da Fase 1
├── quickstart.md        # Resultado da Fase 1
├── contracts/           # Resultado da Fase 1
└── tasks.md             # Resultado da Fase 2
```

### Código-fonte (raiz do repositório)

```text
src/
├── routes/
│   ├── motoristaRoutes.js
│   ├── veiculoRoutes.js
│   └── alocacaoRoutes.js
├── public/
│   ├── protected.html
│   ├── auth.js
│   └── auth.css
└── server.js
supabase/
└── migrations/

```

**Decisão estrutural**: Estender a aplicação Express existente. Manter
motoristas, veículos e alocações de rota em módulos autenticados focados,
adicionar suas tabelas em uma migração e integrar a página protegida atual em
vez de criar um frontend separado.

## Complexity Tracking

> **Preencher somente se houver violações da constituição que precisem de justificativa**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | The feature fits the existing application structure. |

## Resumo da Fase 0: Pesquisa

As decisões de pesquisa estão registradas em [research.md](./research.md). Não
há esclarecimentos técnicos ou de produto pendentes.

## Resumo da Fase 1: Design

- [data-model.md](./data-model.md) defines motorists, vehicles, and historical
  route allocations.
- [contracts/motoristas-veiculos-api.md](./contracts/motoristas-veiculos-api.md)
  defines authenticated CRUD, allocation, and history endpoints.
- [quickstart.md](./quickstart.md) defines end-to-end validation scenarios,
  including duplicate normalization, inactive records, history, capacity, and
  mobile behavior.

**Verificação da constituição após o design**: APROVADA. O design preserva o
histórico operacional, mantém dados sensíveis atrás da autenticação, usa
validação explícita e não adiciona camada arquitetural desnecessária.
