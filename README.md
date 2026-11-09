# Sistema Nutrição

Sistema para acompanhamento de saúde com metas de peso, alimentação e evolução.


## Como instalar e rodar o projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 20.9 ou superior; recomendado Node.js 24 LTS)
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas) com um cluster criado (ou outra instância MongoDB acessível)

### 2. Clonar o repositório

```bash
git clone https://github.com/Lei-di/TESI-Sitema-Nutri-o.git
cd TESI-Sitema-Nutri-o
```

### 3. Instalar as dependências

As dependências ficam dentro da pasta `src`, então entre nela antes de instalar:

```bash
cd src
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` **na raiz do projeto** com o seguinte conteúdo:

```env
MONGODB_URI=sua_string_de_conexao_do_mongodb_atlas
JWT_SECRET=uma_chave_secreta_qualquer_para_assinar_os_tokens
```

- `MONGODB_URI`: a string de conexão do cluster no MongoDB Atlas (formato `mongodb+srv://usuario:senha@cluster.../nomeDoBanco`)
- `JWT_SECRET`: qualquer texto secreto, usado para gerar e validar os tokens de login

> O arquivo `.env` não deve ser enviado ao GitHub — ele já está listado no `.gitignore`.

### 5. Iniciar o servidor

Ainda dentro da pasta `src`:

```bash
node index.js
```

Se tudo estiver certo, vai aparecer no terminal:

```
Iniciando o Servidor de Nutrição...
Conexão com o MongoDB Atlas realizada com sucesso!
Servidor rodando com sucesso em http://localhost:3000
```

## Front-end Next.js

O front-end fica em `frontend/`, separado do back-end Express em `src/`.
Usa Next.js com App Router, React, JavaScript e ESLint.

### Configurar e executar

1. Configure o `.env` da raiz com suas credenciais, usando `.env.example` como modelo.
2. Em um terminal, inicie o back-end:

   ```bash
   cd src
   npm ci
   npm run dev
   ```

3. Em outro terminal, prepare o front-end:

   ```bash
   cd frontend
   npm ci
   ```

4. Copie `frontend/.env.example` para `frontend/.env.local`. O endereço padrão
   do back-end é `http://127.0.0.1:3000`. Inicie o front-end:

   ```bash
   npm run dev
   ```

5. Abra **http://localhost:3001**.

O back-end só começa a escutar após conectar ao MongoDB. Sem o banco configurado,
o front-end abre normalmente; os recursos que usam a API precisam do back-end em execução.

### Comunicação com a API

O navegador chama `/api/backend/*` na porta 3001. O Next.js encaminha essas
requisições ao Express na porta 3000 por meio de `rewrites` em `next.config.mjs`.
Isso mantém as chamadas na mesma origem do navegador, sem precisar adicionar CORS
ao Express. `BACKEND_URL` é uma variável do servidor; reinicie o Next.js ao alterá-la.
Não coloque credenciais do MongoDB ou `JWT_SECRET` no ambiente do front-end.

O cliente reutilizável `frontend/lib/api.js` trata JSON, erros e tokens Bearer:

```js
import { authApi, perfilApi } from "@/lib/api";

const sessao = await authApi.login(email, senha);
const perfil = await perfilApi.obter(sessao.token);
```

Esse cliente é para componentes do navegador. O token deve ser passado explicitamente;
esta etapa ainda não implementa telas de login nem persistência de sessão.
As rotas existentes `/usuarios`, `/auth/login`, `/saude` e `/perfis` são preservadas.
`GET /health` permite testar a conexão sem autenticação nem modificar dados.

### Verificações e produção

Dentro de `frontend/`:

```bash
npm run lint
npm run build
npm start
```

O servidor de produção abre na porta 3001 e também precisa do Express em execução.
Configure `BACKEND_URL` antes de gerar a build de cada ambiente.

