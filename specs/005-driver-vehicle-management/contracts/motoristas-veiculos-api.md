# Contrato de API: Motoristas, Veículos e Alocações

Todos os endpoints exigem `Authorization: Bearer <token-da-sessao>`.

## Motoristas

### `GET /api/motoristas?inativos=true`

Retorna motoristas ativos por padrão. O parâmetro opcional inclui registros
inativos.

### `POST /api/motoristas`

Requisição:

```json
{
  "nome": "Ana Souza",
  "telefone": "21999999999",
  "documento": "123.456.789-00"
}
```

Retorna `201`; documento normalizado duplicado retorna `409`.

### `PUT /api/motoristas/:id`

Atualiza os campos e opcionalmente `ativo`.

### `DELETE /api/motoristas/:id`

Desativa o motorista sem excluir o histórico.

## Veículos

### `GET /api/veiculos?inativos=true`

Retorna veículos ativos por padrão.

### `POST /api/veiculos`

Requisição:

```json
{
  "placa": "ABC-1D23",
  "modelo": "Van Escolar",
  "ano": 2024,
  "capacidade": 20
}
```

Retorna `201`; placa normalizada duplicada retorna `409`.

### `PUT /api/veiculos/:id`

Atualiza os campos e opcionalmente `ativo`.

### `DELETE /api/veiculos/:id`

Desativa o veículo sem excluir o histórico.

## Alocação de rota

### `GET /api/rotas/:id/alocacao`

Retorna a alocação atual, a quantidade de passageiros e o alerta de capacidade.

### `PUT /api/rotas/:id/alocacao`

Requisição:

```json
{
  "motorista_id": "uuid",
  "veiculo_id": "uuid"
}
```

A rota, o motorista e o veículo devem estar ativos. A alocação atual anterior é
encerrada antes da criação da nova.

### `GET /api/alocacoes?rota_id=&data_inicio=&data_fim=`

Retorna o histórico de alocações com snapshots e filtros inclusivos de data.
