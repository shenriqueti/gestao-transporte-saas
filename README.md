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
│   ├── controllers/        # Controladores de lógica de negócio (em expansão)
│   ├── models/             # Modelos de dados
│   ├── routes/
│   │   └── alunoRoutes.js  # Rotas de cadastro e listagem de alunos
│   └── server.js           # Ponto de entrada da aplicação Express
├── .env                    # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
└── README.md
⚙️ Como Executar o Projeto Localmente
Pré-requisitos
Certifique-se de ter o Node.js (v20 ou superior) instalado na sua máquina.

Clone o repositório:

Bash
git clone [https://github.com/riquetvs/gestao-transporte-saas.git](https://github.com/riquetvs/gestao-transporte-saas.git)
cd gestao-transporte-saas
Instale as dependências:

Bash
npm install
Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto seguindo o modelo abaixo e insira as suas credenciais do Supabase:

Snippet de código
PORT=3333
SUPABASE_URL=sua_url_do_supabase_aqui
SUPABASE_KEY=sua_chave_anon_aqui
Inicie o servidor em modo de desenvolvimento:

Bash
npm run dev
O servidor estará rodando em http://localhost:3333.

📌 Endpoints da API
Alunos / Passageiros
GET /api/alunos

Retorna a lista de todos os alunos cadastrados.

POST /api/alunos

Cadastra um novo aluno no sistema.

Payload (JSON):

JSON
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
👨‍💻 Autor
Desenvolvido por Sergio Henrique como parte de um projeto focado em soluções reais para o setor de transporte escolar e evolução técnica em desenvolvimento web.