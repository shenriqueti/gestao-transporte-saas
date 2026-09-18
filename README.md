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

As rotas `GET /api/alunos` e `POST /api/alunos` exigem uma sessão válida do Supabase.
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