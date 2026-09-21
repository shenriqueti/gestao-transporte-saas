# Quickstart: Gestão de Motoristas e Veículos

## Pré-requisitos

1. Aplicar a migração da feature no Supabase.
2. Aplicar a migração de acesso/cache do PostgREST, se necessário no ambiente.
3. Iniciar o servidor com `npm start`.
4. Entrar na página protegida com usuário autenticado.
5. Possuir uma rota ativa e passageiros associados.

## Cenário 1 — Motorista

1. Criar um motorista com nome, telefone e documento válidos.
2. Confirmar que ele aparece na lista de ativos.
3. Repetir o documento com outra formatação e confirmar `409`.
4. Desativar o motorista e confirmar que ele deixa de aparecer nas opções.
5. Consultar a alocação histórica e confirmar que o snapshot permanece.
6. Se estiver alocado, confirmar que a alocação foi encerrada e a rota ficou incompleta.

## Cenário 2 — Veículo

1. Criar um veículo com placa, modelo, ano e capacidade válidos.
2. Confirmar que a placa é normalizada para impedir duplicidade formatada.
3. Tentar cadastrar capacidade zero e confirmar erro de validação; o ano deve ser aceito como informação sem validação de faixa.
4. Desativar o veículo e confirmar que ele não pode ser usado em nova alocação.
5. Se estiver alocado, confirmar que a alocação foi encerrada e a rota ficou incompleta.

## Cenário 3 — Associar à rota

1. Associar motorista e veículo ativos a uma rota ativa.
2. Confirmar que a rota exibe os dados atuais e a quantidade de passageiros.
3. Substituir motorista ou veículo e confirmar que a alocação anterior foi encerrada.
4. Desativar a rota e confirmar que uma alteração de alocação é rejeitada.

## Cenário 4 — Capacidade e segurança

1. Usar um veículo com capacidade menor que a quantidade de passageiros.
2. Confirmar alerta de lotação sem ocultar a rota.
3. Fazer requisições sem autenticação e confirmar `401`.
4. Consultar a escala em viewport móvel e confirmar que não há rolagem horizontal.
