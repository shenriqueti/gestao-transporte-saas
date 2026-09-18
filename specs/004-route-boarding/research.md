# Research: Gestão de rotas e embarque

## Decisão 1: Reutilizar o monólito autenticado existente

- **Decision**: adicionar uma rota Express autenticada e controles na página protegida existente.
- **Rationale**: o projeto já possui cliente HTTP, middleware Supabase, navegação e estilos responsivos reutilizáveis.
- **Alternatives considered**: criar uma aplicação frontend separada; rejeitada por aumentar acoplamento, configuração e superfície de autenticação.

## Decisão 2: Modelar rota, passageiros e embarques separadamente

- **Decision**: usar uma entidade de rota, uma associação ordenada rota-aluno e um registro diário por rota/aluno/data.
- **Rationale**: permite um aluno em várias rotas, impede duplicidade na mesma rota, preserva a ordem e mantém o histórico independente do cadastro atual.
- **Alternatives considered**: guardar uma lista de IDs dentro da rota; rejeitada por dificultar unicidade, ordenação, filtros e auditoria.

## Decisão 3: Preservar snapshots no histórico

- **Decision**: copiar nome e escola do aluno para a associação e para o registro diário no momento da criação.
- **Rationale**: a exclusão operacional do aluno não pode apagar nem tornar ilegível o histórico indefinido.
- **Alternatives considered**: depender apenas de uma chave estrangeira; rejeitada porque a remoção do aluno quebraria a identificação histórica.

## Decisão 4: Atualização idempotente do embarque

- **Decision**: uma chave única por rota, aluno e data; repetir a ação atualiza o estado existente.
- **Rationale**: evita duplicidade em recarregamentos, cliques repetidos e concorrência simples.
- **Alternatives considered**: inserir eventos separados para cada alteração; rejeitada para o MVP por exigir uma trilha de eventos e uma UX mais complexa.

## Decisão 5: Operação diária única

- **Decision**: o registro usa somente rota e data, sem turno de ida/volta.
- **Rationale**: decisão explícita da clarificação e menor carga operacional no MVP.
- **Alternatives considered**: incluir período/turno; fica para evolução futura caso a operação exija.
