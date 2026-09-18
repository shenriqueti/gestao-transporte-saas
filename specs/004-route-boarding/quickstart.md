# Quickstart: validação de rotas e embarque

## Pré-requisitos

1. Aplicar a migração de rotas e embarques no Supabase.
2. Configurar as mesmas variáveis de ambiente usadas pela aplicação atual.
3. Iniciar o servidor com `npm start`.
4. Acessar a página protegida com uma sessão autenticada e possuir pelo menos dois alunos.

## Cenário 1 — Criar rota e ordenar passageiros

1. Criar uma rota com nome e descrição.
2. Associar dois alunos, confirmando que aparecem na lista.
3. Reordenar os alunos e recarregar a página.
4. Confirmar que a ordem foi preservada.
5. Tentar associar o mesmo aluno novamente e confirmar resposta amigável de duplicidade.

## Cenário 2 — Registrar embarques

1. Selecionar uma rota e a data atual.
2. Confirmar que todos os passageiros aparecem como `Pendente`.
3. Marcar um aluno como `Embarcou`, outro como `Faltou` e outro como `Não utilizará`.
4. Recarregar a lista e confirmar os estados e horários.
5. Repetir uma marcação e confirmar que o registro é atualizado, sem duplicidade.
6. Selecionar uma data futura e confirmar que a consulta mostra os passageiros como `Pendente`.
7. Tentar marcar um passageiro na data futura e confirmar que o sistema impede o registro.

## Cenário 3 — Preservar histórico

1. Registrar um embarque para um aluno.
2. Remover o aluno operacionalmente.
3. Consultar o histórico pela rota e período.
4. Confirmar que o registro permanece com nome e escola do snapshot.

## Cenário 4 — Segurança e filtros

1. Fazer uma requisição sem `Authorization` e confirmar `401`.
2. Filtrar o histórico por rota, aluno e período.
3. Informar filtros sem correspondência e confirmar mensagem de nenhum resultado.
4. Verificar em viewport móvel que a lista e os controles continuam utilizáveis.
