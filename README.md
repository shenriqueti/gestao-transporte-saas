# 🚐 Sistema de Gestão para Transporte Escolar (SaaS)

> Sistema moderno de gestão voltado para otimizar a rotina de motoristas de transporte escolar, oferecendo controle eficiente de rotas, passageiros e gestão financeira.

---

## 🚀 Tecnologias Utilizadas

- **Backend:** Node.js (v24 LTS) & Express.js
- **Banco de Dados:** PostgreSQL (via Supabase)
- **Ferramentas de Desenvolvimento:** Nodemon, Git & GitHub

---

## 📂 Estrutura do Projeto

```text
gestao-transporte-saas/
├── src/
│   ├── config/
│   │   └── supabase.js     # Configuração da conexão com o Supabase
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── controllers/        # Controladores de lógica de negócio (em expansão)
│   ├── models/             # Modelos de dados
│   ├── public/              # Login e área protegida
│   ├── routes/
│   │   └── alunoRoutes.js  # Rotas de cadastro, edição, listagem e remoção
│   └── server.js           # Ponto de entrada da aplicação Express
├── .env                    # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
└── README.md
⚙️ Como Executar o Projeto Localmente
Pré-requisitos
Certifique-se de ter o Node.js (v20 ou superior) instalado na sua máquina.

Clone o repositório:

```bash
git clone https://github.com/shenriqueti/gestao-transporte-saas.git
cd gestao-transporte-saas
```
Instale as dependências:

```bash
npm install
```
Configure as variáveis de ambiente:
Copie `.env.example` para `.env` e insira as credenciais do Supabase. Nunca
versione o arquivo `.env` ou registre suas chaves em logs:

```dotenv
PORT=3333
SUPABASE_URL=sua_url_do_supabase_aqui
SUPABASE_KEY=sua_chave_anon_aqui
```
Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará rodando em http://localhost:3333. Abra essa URL para acessar a
tela de login. Os usuários autorizados devem ser criados manualmente no painel do
Supabase; não há cadastro público.

### Autenticação

As rotas de alunos, mensalidades, rotas e embarques exigem uma sessão válida do Supabase.
O navegador envia o token atual no cabeçalho HTTP `Authorization` usando o esquema
padrão de token. Credenciais ausentes ou inválidas retornam `401`; indisponibilidade
do provedor retorna `503`.

📌 Endpoints da API
Alunos / Passageiros
GET /api/alunos (requer autenticação)

Retorna a lista de todos os alunos cadastrados.

POST /api/alunos (requer autenticação)

Cadastra um novo aluno no sistema.

Cadastros com os mesmos dados de um aluno existente são rejeitados com `409`.

PUT /api/alunos/:id (requer autenticação)

Atualiza os dados de um aluno existente.

DELETE /api/alunos/:id (requer autenticação)

Remove um aluno pelo identificador.

### Mensalidades

`GET /api/mensalidades` lista as cobranças e aceita os filtros opcionais
`aluno_id`, `competencia` (`AAAA-MM`) e `status` (`Pendente`, `Vencida` ou
`Pago`).

`POST /api/mensalidades` registra uma cobrança mensal. O corpo deve conter
`aluno_id`, `competencia`, `valor` e `dia_vencimento`. Não é possível registrar
duas cobranças para o mesmo aluno e competência; a API retorna `409`.

`PUT /api/mensalidades/:id/pagamento` registra a quitação integral com
`data_pagamento` e `valor_pago`. O valor precisa ser exatamente igual ao da
mensalidade e a data não pode ser futura.

As mensalidades preservam um histórico com nome e escola do aluno. A migração
`supabase/migrations/20260918183000_create_mensalidades.sql` usa `ON DELETE SET NULL`
para manter esse histórico quando um aluno é removido da operação.

### Rotas e embarques

Antes de usar a operação diária, aplique a migração
`supabase/migrations/20260918192000_create_rotas_embarques.sql` no Supabase.
Em seguida, aplique `supabase/migrations/20260918193000_align_rotas_api_access.sql`
para atualizar o cache do PostgREST e manter o acesso alinhado ao middleware de
autenticação da API.

- `GET/POST /api/rotas` lista ou cria rotas ativas.
- `PUT/DELETE /api/rotas/:id` edita ou desativa uma rota; a desativação preserva passageiros e histórico.
- `GET/POST /api/rotas/:id/alunos` lista ou associa alunos à rota.
- `PUT /api/rotas/:id/alunos/ordem` salva a ordem completa dos passageiros.
- `GET /api/rotas/:id/embarques?data=AAAA-MM-DD` consulta a lista diária, inclusive para datas futuras.
- `PUT /api/rotas/:id/embarques/:alunoId` registra `Embarcou`, `Faltou` ou `Não utilizará` somente para hoje ou datas passadas.
- `GET /api/embarques` consulta o histórico por `rota_id`, `aluno_id`, `data_inicio` e `data_fim`.

O histórico mantém snapshots do nome e da escola e é preservado indefinidamente após a
remoção operacional do aluno. Um aluno pode participar de várias rotas, mas apenas uma
vez em cada rota.

Payload (JSON):

```json
{
  "nome": "Nome do Aluno",
  "escola": "Nome da Escola",
  "valor": 350.00,
  "vencimento": 10,
  "turma": "101",
  "professora": "Nome da Professora",
  "responsavel": "Nome do Responsável",
  "telefone": "21999999999"
}
```

👨‍💻 Autor
Desenvolvido por Sergio Henrique como parte de um projeto focado em soluções reais para o setor de transporte escolar e evolução técnica em desenvolvimento web.