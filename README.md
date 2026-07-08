# Sistema Nutrição

Sistema para acompanhamento de saúde com metas de peso, alimentação e evolução.


## Como instalar e rodar o projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)
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



