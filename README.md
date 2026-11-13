# HealthLog — Sistema de Acompanhamento de Saúde

O HealthLog é um sistema web desenvolvido para auxiliar no acompanhamento de hábitos e cuidados com a saúde. A plataforma permite registrar o consumo de água, horas de sono e atividades físicas, configurar metas pessoais e acompanhar a evolução por meio de indicadores e relatórios.

## Tecnologias utilizadas

### Front-end
- Next.js (App Router)
- React
- JavaScript
- CSS Modules

### Back-end
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

## Funcionalidades

### Autenticação e usuários
- Cadastro de usuários com nome, e-mail, telefone e senha.
- Login com validação de credenciais.
- Persistência da sessão durante a navegação na aba.
- Encerramento da sessão (logout).
- Proteção de páginas que exigem autenticação.
- Controle de acesso por perfil.

### Perfis de acesso
O sistema possui dois perfis:

- **Usuário (`usuario`):** pode acessar seu perfil, configurar metas e gerenciar seus próprios registros de saúde.
- **Administrador (`admin`):** possui acesso às operações administrativas disponibilizadas pelo sistema, incluindo a listagem de usuários.

Os cadastros realizados pela tela pública recebem automaticamente o perfil de usuário.

### Perfil e metas
- Visualização e atualização de dados pessoais.
- Registro de informações de saúde, como peso, altura e idade.
- Configuração de metas de consumo de água e prática de exercícios.

### Diário de saúde
- Registro de consumo de água.
- Registro de horas e qualidade do sono.
- Registro de atividades físicas, duração e calorias.
- Consulta ao histórico de registros.
- Edição e exclusão de registros.
- Filtros por data e tipo de registro.
- Indicadores de acompanhamento dos hábitos.

### Dashboard e relatórios
- Painel com indicadores de acompanhamento.
- Resumo dos registros de saúde.
- Relatórios com visualização semanal e mensal.
- Gráficos de consumo de água, horas de sono e atividades físicas.
- Informações sobre duração dos exercícios e calorias gastas.

### Feedback e navegação
- Mensagens de sucesso e erro.
- Indicadores de carregamento.
- Mensagens para listas sem registros ou sem resultados nos filtros.
- Página de acesso negado para operações sem permissão.

## Estrutura do projeto

```text
TESI-Sitema-Nutri-o/
│
├── frontend/
│   ├── app/
│   │   ├── acesso-negado/
│   │   ├── cadastro/
│   │   ├── dashboard/
│   │   ├── diario/
│   │   ├── login/
│   │   ├── perfil/
│   │   └── relatorios/
│   │
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── index.js
│   └── package.json
│
├── .env
├── .gitignore
└── README.md
```

## Pré-requisitos

- Node.js 20.9 ou superior.
- npm.
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) ou uma instância MongoDB acessível.
- Git.

## Como instalar e executar

### 1. Clonar o repositório

```bash
git clone https://github.com/Lei-di/TESI-Sitema-Nutri-o.git
cd TESI-Sitema-Nutri-o
```

### 2. Configurar o back-end

Na raiz do projeto, crie um arquivo `.env` com as seguintes variáveis:

```env
MONGODB_URI=sua_string_de_conexao
JWT_SECRET=sua_chave_secreta
```

Não compartilhe os valores reais dessas variáveis nem envie o arquivo `.env` ao GitHub.

Instale as dependências do back-end:

```bash
cd src
npm install
```

Inicie o servidor:

```bash
npm run dev
```

O servidor será executado em:

`http://localhost:3000`

### 3. Configurar o front-end

Abra outro terminal e acesse a pasta do front-end:

```bash
cd frontend
npm install
```

Configure o arquivo `frontend/.env.local`, utilizando o modelo `frontend/.env.example`, quando disponível.

Exemplo de configuração:

```env
BACKEND_URL=http://127.0.0.1:3000
```

Inicie o front-end:

```bash
npm run dev
```

A aplicação estará disponível em:

`http://localhost:3001`

**Importante:** mantenha os dois servidores em execução. O front-end depende do back-end para realizar operações com os dados e autenticação.

## Comunicação com a API

O back-end disponibiliza as seguintes rotas principais:

| Rota | Método | Finalidade |
|---|---|---|
| `/health` | GET | Verificar disponibilidade do servidor |
| `/usuarios` | POST | Cadastrar usuário |
| `/usuarios` | GET | Listar usuários (administrador) |
| `/usuarios/:id` | GET | Consultar usuário |
| `/usuarios/:id` | PUT | Atualizar usuário |
| `/usuarios/:id` | DELETE | Excluir usuário (administrador) |
| `/auth/login` | POST | Realizar login |
| `/saude` | GET | Listar registros de saúde |
| `/saude` | POST | Criar registro de saúde |
| `/saude/:id` | PUT | Atualizar registro |
| `/saude/:id` | DELETE | Excluir registro |
| `/perfis` | — | Operações relacionadas ao perfil de saúde |

As rotas protegidas utilizam autenticação por token JWT.

O Next.js encaminha as requisições do navegador ao Express por meio do proxy configurado no projeto.

## Segurança e configuração

- Não publique arquivos `.env` ou `.env.local` com informações reais.
- Não compartilhe chaves JWT, senhas ou strings de conexão.
- Não coloque credenciais privadas em variáveis acessíveis pelo navegador.
- Utilize dados fictícios para demonstrações e testes públicos.

## Execução em ambiente de desenvolvimento

O projeto utiliza dois servidores:

| Serviço | Porta |
|---|---:|
| Back-end Express | 3000 |
| Front-end Next.js | 3001 |

Para utilizar o sistema, inicie primeiro o back-end e depois o front-end, cada um em seu próprio terminal.

## Repositório

[GitHub — TESI Sistema de Nutrição](https://github.com/Lei-di/TESI-Sitema-Nutri-o)

## Credenciais para testes

As contas abaixo são destinadas à validação das funcionalidades
e dos níveis de permissão do sistema.

### Administrador
- E-mail: teste.atlas2026@email.com
- Senha: [preencher com a senha da conta de teste]
- Perfil: admin

### Usuário
- E-mail: gabriela.teste2026@email.com
- Senha: [preencher com a senha da conta de teste]
- Perfil: usuario

As credenciais são destinadas exclusivamente ao ambiente de testes.