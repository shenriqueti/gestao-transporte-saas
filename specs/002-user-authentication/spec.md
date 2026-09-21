# Especificação: Autenticação de Usuários com Supabase Auth

## Contexto

O sistema de transporte escolar precisa restringir o acesso aos dados de alunos.
Usuários serão provisionados manualmente no painel do Supabase. A primeira versão
usa somente e-mail e senha, sem cadastro público ou perfis diferenciados.

## Cenários de Usuário

### História 1 - Entrar no sistema (P1)

Um usuário autorizado informa credenciais válidas e acessa a área protegida.

**Aceitação**

1. Credenciais válidas autenticam e redirecionam para a área protegida.
2. Credenciais inválidas negam o acesso com mensagem genérica, sem enumerar e-mails.
3. Uma sessão válida é restaurada após reload e reabertura no mesmo dispositivo,
   enquanto não expirar ou ser revogada.

### História 2 - Encerrar a sessão (P1)

Um usuário autenticado encerra a sessão em dispositivo próprio ou compartilhado.

**Aceitação**

1. Logout encerra a sessão local e retorna à tela de login.
2. Após logout, endpoints protegidos rejeitam requisições sem sessão válida.

### História 3 - Proteger dados de alunos (P1)

Somente usuários autenticados podem consultar ou cadastrar alunos, com o backend como
autoridade final.

**Aceitação**

1. `GET /api/alunos` sem autenticação retorna `401` sem consultar dados.
2. `POST /api/alunos` sem autenticação retorna `401` sem criar registro.
3. Requisições autenticadas mantêm o contrato atual de sucesso.

## Casos limite

- Token expirado ou revogado exige novo login.
- Indisponibilidade do provedor retorna `503`, sem ser tratada como credencial inválida.
- Campos vazios ou malformados são rejeitados antes da tentativa de login.
- Mensagens não revelam existência de e-mail, tokens, senhas ou detalhes internos.
- Endpoints públicos de saúde não retornam dados de alunos ou responsáveis.

## Requisitos Funcionais

- **FR-001**: Oferecer tela de login para usuários autorizados.
- **FR-002**: Não oferecer cadastro, convite ou recuperação de senha públicos no MVP.
- **FR-003**: Autenticar exclusivamente com Supabase Auth, sem armazenar senhas ou
  criar mecanismo paralelo.
- **FR-004**: Aceitar somente e-mail e senha e validar campos obrigatórios no cliente.
- **FR-005**: Exibir mensagens genéricas para credenciais inválidas.
- **FR-006**: Persistir e restaurar a sessão conforme o Supabase Auth, inclusive após
  reload e reabertura normal do navegador no mesmo dispositivo.
- **FR-007**: Oferecer logout e remover a sessão local após a operação.
- **FR-008**: Exigir autenticação válida antes de `GET /api/alunos` e `POST /api/alunos`.
- **FR-009**: Enviar o token atual no cabeçalho HTTP `Authorization` usando o esquema
  padrão de token em cada requisição protegida.
- **FR-010**: Retornar `401 Unauthorized` para credencial ausente, malformada, expirada,
  revogada ou inválida.
- **FR-011**: Retornar `503 Service Unavailable` quando o provedor não puder ser consultado.
- **FR-012**: Validar credenciais no servidor antes dos handlers de alunos.
- **FR-013**: Orientar novo login após expiração ou revogação sem expor dados protegidos.
- **FR-014**: Não registrar senhas, tokens, chaves privadas ou dados pessoais em logs,
  código versionado ou mensagens de erro.
- **FR-015**: Preservar o contrato funcional dos endpoints para usuários autenticados.
- **FR-016**: Permitir a todos os usuários autenticados listar e cadastrar alunos no MVP.

## Critérios de Sucesso

- **SC-001**: Login válido alcança a área protegida em até 10 segundos em pelo menos
  95% das tentativas normais.
- **SC-002**: Requisições sem autenticação nunca executam handlers de alunos e retornam
  `401`.
- **SC-003**: Falhas de disponibilidade do provedor retornam `503` sem revelar detalhes.
- **SC-004**: Logout e expiração impedem chamadas protegidas subsequentes até novo login.
- **SC-005**: Nenhum segredo ou dado pessoal sensível aparece nos logs, assets públicos
  ou arquivos versionados.
