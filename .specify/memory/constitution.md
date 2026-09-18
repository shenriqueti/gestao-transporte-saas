<!--
Sync Impact Report
- Version change: uninitialized → 1.0.0
- Modified principles: initial placeholders → I. Produto orientado à operação real; II. Dados confiáveis; III. Qualidade obrigatória; IV. Segurança e privacidade; V. Simplicidade e evolução incremental
- Added sections: Requisitos de Segurança e Operação; Fluxo de Desenvolvimento e Qualidade
- Removed sections: none
- Follow-up TODOs: none
-->

# Gestão de Transporte Escolar SaaS Constitution

## Princípios Fundamentais

### I. Produto orientado à operação real
A funcionalidade do sistema deve resolver o dia a dia do motorista, da coordenação e da equipe financeira. Cada mudança deve reduzir retrabalho, facilitar a operação de rota e melhorar a clareza das informações sobre passageiros, vencimentos e pagamentos.

Racional: o valor do produto está na ação operacional diária, não em recursos isolados. Quando o sistema não melhora a execução real do transporte escolar, a entrega não atende à missão do projeto.

### II. Dados confiáveis e auditáveis
Todos os dados críticos do sistema — alunos, responsáveis, escolas, valores, vencimentos, rotas e pagamentos — devem ser armazenados com consistência, validação e rastreabilidade. Nenhuma regra de negócio pode depender de registros informais ou de ajustes manuais sem histórico.

Racional: decisões financeiras e operacionais exigem precisão. Falhas de integridade geram atraso, cobrança indevida e perda de confiança dos usuários.

### III. Qualidade obrigatória via testes e validação
Cada correção ou funcionalidade nova deve ser validada antes da entrega. Alterações em regras de negócio, integrações ou dados sensíveis exigem testes, checagens manuais e confirmação de comportamento esperado antes de entrar em produção.

Racional: a confiança do cliente depende de previsibilidade. Sistemas de transporte escolar não podem aceitar regressões em regras de cobrança, cadastros e operações críticas sem uma validação explícita.

### IV. Segurança e privacidade
Dados pessoais e de contato de alunos e responsáveis devem ser tratados como sensíveis. Segredos, credenciais e variáveis de ambiente nunca devem ficar expostos em código, logs, commits ou arquivos compartilhados. Acesso e permissões devem seguir o princípio de menor privilégio e de necessidade de uso.

Racional: o sistema lida com informações de pessoas e relacionamento financeiro. A proteção desses dados é parte do produto e não uma etapa opcional.

### V. Simplicidade e evolução incremental
O projeto deve priorizar soluções simples, compreensíveis e mantidas com baixo acoplamento. Funcionalidades complexas só entram quando houver necessidade comprovada, documentação clara e capacidade de suporte contínuo.

Racional: evoluções incrementais reduzem risco operacional, aceleram manutenção e preservam a capacidade do time de entregar valor sem criar dependências frágeis.

## Requisitos de Segurança e Operação

O sistema deve operar em um ambiente controlado, com uso de variáveis de ambiente, conexão segura com infraestrutura de dados e configuração explícita de portas, chaves e endpoints. A operação em produção exige observabilidade mínima sobre erros, disponibilidade e impacto de integrações externas.

Mudanças em regras financeiras, dados de passageiros, permissões de acesso ou integrações com provedores externos devem ser avaliadas como impacto potencial de negócio e não como ajuste técnico isolado. Quando houver risco de regressão, a correção deve incluir validação e comunicação clara de impactos.

## Fluxo de Desenvolvimento e Qualidade

O desenvolvimento deve seguir etapas pequenas e verificáveis: definição da necessidade, implementação com foco na regra de negócio, validação do comportamento e revisão do impacto operacional. A revisão de código deve verificar aderência à constituição, clareza da solução e ausência de riscos ocultos em segurança, dados e desempenho.

Todas as entregas devem ser compatíveis com a visão do produto: melhorar a gestão do transporte escolar com foco em confiabilidade, simplicidade e experiência operacional. Entregas sem evidência de qualidade, segurança ou rastreabilidade não são consideradas completas.

## Governance

Esta constituição define as regras não negociáveis do projeto e prevalece sobre convenções, processos improvisados e decisões pontuais que contradigam os princípios acima. Qualquer mudança no comportamento do produto, nas integrações, nos dados ou na governança precisa ser documentada, revisada e explicitamente aprovada antes de ser aplicada.

A versão do projeto segue SemVer: MAJOR para mudanças incompatíveis ou redefinições da missão, de segurança ou de regras de negócio; MINOR para novas práticas, princípios ou expansões materiais; PATCH para ajustes, correções de redação e clarificações sem mudança de intenção. O controle de versão deve refletir riscos reais de impacto, não apenas alterações de texto.

A conformidade com esta constituição é parte da entrega. Em pull requests, revisão de mudanças e validações operacionais, o time deve confirmar que a alteração respeita os princípios do projeto, não introduz dados sensíveis em repositórios públicos e mantém a operação estável para os usuários finais.

**Version**: 1.0.0 | **Ratified**: 2026-09-18 | **Last Amended**: 2026-09-18
