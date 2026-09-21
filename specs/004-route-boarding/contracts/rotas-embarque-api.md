# Contrato da API de rotas e embarque

Todos os endpoints exigem `Authorization: Bearer <token>` e retornam JSON. Erros usam `{ "error": "mensagem" }`.

## Rotas

### `GET /api/rotas`

Retorna rotas ativas ordenadas por nome. Cada item inclui `id`, `nome`, `descricao`, `ativa` e quantidade de passageiros.

### `POST /api/rotas`

Request:

```json
{ "nome": "Rota Centro", "descricao": "Manhã" }
```

Retorna `201` com a rota criada. Nome vazio retorna `400`.

### `PUT /api/rotas/:id`

Atualiza nome, descrição ou situação ativa. Retorna `200`; rota inexistente retorna `404`.

### `DELETE /api/rotas/:id`

Desativa a rota sem apagar seus passageiros ou histórico. Retorna `204`; a reativação ocorre por `PUT` com `ativa: true`.

## Passageiros

### `GET /api/rotas/:id/alunos`

Retorna os alunos associados ordenados por `ordem`, incluindo snapshots e identificador da associação.

### `POST /api/rotas/:id/alunos`

Request:

```json
{ "aluno_id": "uuid" }
```

Adiciona o aluno ao final da ordem. Duplicidade na mesma rota retorna `409`.

### `DELETE /api/rotas/:id/alunos/:alunoId`

Remove a associação operacional sem remover o aluno nem o histórico. Retorna `204`.

### `PUT /api/rotas/:id/alunos/ordem`

Request:

```json
{ "aluno_ids": ["uuid-1", "uuid-2"] }
```

Exige exatamente os alunos atualmente associados, sem repetição. Retorna a lista reordenada.

## Embarque diário

### `GET /api/rotas/:id/embarques?data=AAAA-MM-DD`

Retorna todos os passageiros da rota para a data, com estado existente ou `Pendente`. Consultas futuras são permitidas; somente a confirmação para data futura retorna `400`.

### `PUT /api/rotas/:id/embarques/:alunoId`

Request:

```json
{ "data": "AAAA-MM-DD", "status": "Embarcou" }
```

Cria ou atualiza o registro idempotentemente. Estados aceitos: `Pendente`, `Embarcou`, `Faltou`, `Não utilizará`. A data deve ser hoje ou anterior. Retorna `200`.

## Histórico

### `GET /api/embarques?rota_id=&aluno_id=&data_inicio=&data_fim=`

Retorna registros filtrados por rota, aluno e intervalo inclusivo de datas, mantendo snapshots históricos.
