# Pesquisa: Gestão de Motoristas e Veículos

## Decisão: Reutilizar o padrão de rotas autenticadas existente

- **Decisão**: Criar módulos Express protegidos por `authMiddleware` e usar o
  cliente Supabase já configurado.
- **Motivação**: Mantém o mesmo comportamento de autenticação, erros e
  integração usado por alunos, mensalidades e rotas.
- **Alternativas consideradas**: Criar um serviço ou framework separado; rejeitado
  por aumentar acoplamento e contrariar a evolução incremental do projeto.

## Decisão: Usar desativação lógica e snapshots de alocação

- **Decisão**: Motoristas e veículos permanecem armazenados com `ativo`; cada
  alteração de associação encerra a alocação anterior e cria uma nova linha com
  snapshots dos dados exibidos.
- **Motivação**: Preserva a escala histórica mesmo quando um cadastro é
  desativado ou editado.
- **Alternativas consideradas**: Atualizar apenas os IDs na rota; rejeitado porque
  apagaria a rastreabilidade operacional.

- **Regra adicional**: Ao desativar um motorista ou veículo, todas as suas
  alocações vigentes são encerradas automaticamente com `fim_em`. Os snapshots
  permanecem consultáveis e a rota passa a exigir nova associação.

## Decisão: Normalizar documento e placa antes da unicidade

- **Decisão**: Guardar versões normalizadas para comparação e manter os valores
  formatados para exibição.
- **Motivação**: Evita duplicidade por pontuação, espaços ou diferença de caixa.
- **Alternativas consideradas**: Validar somente no navegador; rejeitado porque
  não garante integridade para múltiplos clientes.

## Decisão: Uma alocação vigente por rota

- **Decisão**: Uma rota ativa terá no máximo um motorista e um veículo vigentes;
  substituições encerram a alocação anterior com data/hora.
- **Motivação**: Representa a operação atual sem impedir histórico.
- **Alternativas consideradas**: Permitir várias alocações simultâneas; rejeitado
  porque não há requisito de escala por turno nesta versão.

## Decisão: Substituição consistente da alocação

- **Decisão**: Encerrar a alocação anterior e criar a nova dentro de uma
  operação consistente, sem deixar a rota sem histórico quando uma etapa falhar.
- **Motivação**: Evita estados intermediários e mantém a rastreabilidade exigida
  pela operação.
- **Alternativas consideradas**: Executar as duas alterações sem garantia de
  consistência; rejeitado por risco de histórico incompleto.

## Decisão: Alertar, não bloquear, excesso de lotação

- **Decisão**: A escala calcula e destaca excesso de passageiros, mas permite
  consultar e corrigir a associação.
- **Motivação**: O coordenador precisa enxergar a inconsistência sem perder a
  rota da operação.
- **Alternativas consideradas**: Bloquear a associação; rejeitado porque poderia
  impedir o planejamento enquanto a coordenação resolve a capacidade.
