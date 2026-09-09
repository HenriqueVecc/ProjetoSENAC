# ♻️ ReCiclo

O **ReCiclo** é uma aplicação web desenvolvida para conectar pessoas que desejam descartar materiais recicláveis a empresas e centros especializados em coleta e reciclagem.

O objetivo do projeto é facilitar o descarte correto de materiais recicláveis, aproximando usuários de centros de reciclagem e incentivando práticas mais sustentáveis.

---

## 👥 Integrantes


* Henrique Del Vecchio
* Jefferson Eidy Tokura
* Paulo Pedro Franco Netto
* Ricardo Lucas Tiepo Martins
* João Henrique dos Santos Pereira
* Tatiane Sousa Da Costa
* Yasmim Marie Patricio Pereira

---

## 🎥 Demonstração

O repositório conta com um vídeo demonstrando o funcionamento completo do sistema.

▶️ [Clique aqui para assistir à demonstração](https://youtu.be/0DqJNmdW75o)

---

# 🚀 Como executar o projeto

O projeto é dividido em três partes principais:

* **Backend** — API desenvolvida com Django;
* **Frontend** — Aplicação desenvolvida com Next.js;
* **Banco de Dados** — SQLite.

---

# 🔧 Backend

## 1. Acesse a pasta do backend

```bash
cd backend-api
```

## 2. Crie o ambiente virtual

```bash
python -m venv venv
```

## 3. Ative o ambiente virtual

### Windows

```bash
.\venv\Scripts\activate
```

## 4. Instale as dependências

```bash
pip install -r requirements.txt
```

## 5. Execute as migrations

```bash
python manage.py migrate
```

## 6. Inicie o servidor

```bash
python manage.py runserver
```

Após iniciar o servidor, o backend estará disponível em:

```text
http://127.0.0.1:8000
```

---

# 🗄️ Banco de Dados

O projeto utiliza **SQLite** como banco de dados.

Para inspecionar o banco manualmente, é necessário possuir o `sqlite3` instalado na máquina.

Abra o terminal na mesma pasta onde está localizado o arquivo:

```text
ReCiclo.db
```

---

## Acessando o banco

Execute:

```bash
sqlite3 ReCiclo.db
```

Após isso, o terminal exibirá o prompt do SQLite:

```text
sqlite>
```

---

## Melhorando a visualização dos dados

Opcionalmente, você pode ativar o modo de colunas e cabeçalhos:

```sql
.mode column
.headers on
```

---

## Listando as tabelas

Para visualizar todas as tabelas existentes:

```sql
.tables
```

As principais tabelas do sistema são:

* `centros`
* `solicitacoes_coleta`
* `tipos_material`
* `usuarios`

---

## Visualizando a estrutura de uma tabela

Para verificar a estrutura e as regras de uma tabela:

```sql
.schema solicitacoes_coleta
```

Esse comando permite visualizar informações como:

* `PRIMARY KEY`
* `FOREIGN KEY`
* `CHECK`
* Relacionamentos entre tabelas

---

## Consultando dados

Para visualizar os tipos de materiais cadastrados:

```sql
SELECT * FROM tipos_material;
```

Para visualizar as solicitações de coleta:

```sql
SELECT * FROM solicitacoes_coleta;
```

---

## Sair do SQLite

```sql
.quit
```

---

# 💻 Frontend

## Pré-requisitos

Antes de iniciar o frontend, verifique se possui:

* Node.js **20.x**
* npm ou yarn
* Backend Django em execução

O backend deve estar disponível em:

```text
http://127.0.0.1:8000
```

---

## Verificando a versão do Node.js

Execute:

```bash
node -v
```

Caso esteja utilizando uma versão inferior ao Node.js 20, atualize para uma versão compatível.

Exemplo:

```bash
npx use 20
```

---

## Configurando variáveis de ambiente

Opcionalmente, crie um arquivo:

```text
.env.local
```

Na raiz do projeto.

Adicione:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

Caso o arquivo não seja criado, o sistema utilizará essa mesma URL como padrão.

---

## Instalando as dependências

```bash
npm install
```

---

## Executando o projeto

Certifique-se de que o backend esteja em execução.

Em seguida:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

---

## Build para produção

Para gerar a build:

```bash
npm run build
```

Para iniciar a aplicação:

```bash
npm start
```

---

# ⚙️ Como funciona o sistema

O ReCiclo conecta usuários que desejam descartar materiais recicláveis a empresas e centros especializados em coleta.

A aplicação possui dois tipos principais de usuários:

| Tipo                  | Descrição                                  |
| --------------------- | ------------------------------------------ |
| 👤 Usuário (`USER`)   | Solicita a coleta de materiais recicláveis |
| 🏢 Empresa (`CENTER`) | Recebe e gerencia solicitações de coleta   |

---

# 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação.

Principais funcionalidades:

* Login;
* Cadastro de usuários;
* Cadastro de empresas;
* Persistência da sessão;
* Logout;
* Endpoint `/me/` para obter os dados do usuário autenticado.

---

# 👤 Fluxo do Usuário

## Cadastro e Login

O usuário realiza o cadastro informando:

* Nome;
* Endereço;
* E-mail;
* Senha;
* Tipo de conta.

Após realizar o login, o usuário é direcionado para a listagem de centros de reciclagem.

---

## Centros de reciclagem

O usuário pode visualizar os centros disponíveis.

Cada centro exibe informações como:

* Nome;
* Endereço;
* Telefone.

Também é possível iniciar uma solicitação de coleta.

---

## Solicitação de coleta

Ao solicitar uma coleta, o usuário informa:

* Centro de reciclagem;
* Tipo de material;
* Quantidade estimada;
* Unidade;
* Endereço da coleta;
* Data desejada.

As unidades disponíveis incluem, por exemplo:

* kg;
* sacos;
* litros;
* unidades;
* caixas.

Após o envio, a solicitação é armazenada no banco de dados.

---

## Minhas solicitações

O usuário pode acompanhar todas as suas solicitações.

São exibidas informações como:

* Centro;
* Material;
* Quantidade;
* Data;
* Status.

Os status possíveis são:

| Status       | Descrição            |
| ------------ | -------------------- |
| 🟡 Pendente  | Aguardando análise   |
| 🟢 Aceita    | Solicitação aprovada |
| 🔴 Rejeitada | Solicitação recusada |

---

# 🏢 Fluxo da Empresa

## Cadastro

Ao criar uma conta como empresa, o sistema cria automaticamente:

* O usuário;
* O perfil do tipo `CENTER`;
* O centro de reciclagem.

Os dados necessários incluem:

* Nome;
* Endereço;
* Telefone;
* E-mail;
* Senha.

---

## Painel da empresa

Após realizar o login, a empresa é direcionada para o painel administrativo.

Nesse painel é possível visualizar:

* Solicitações pendentes;
* Solicitações aceitas;
* Solicitações rejeitadas.

Cada solicitação apresenta informações como:

* Material;
* Quantidade;
* Endereço da coleta;
* Data desejada;
* Nome do usuário;
* E-mail do usuário;
* Status atual.

---

## Gerenciamento de solicitações

Para cada solicitação pendente, a empresa pode:

### Aceitar

A solicitação é aprovada e seu status é atualizado para:

```text
ACCEPTED
```

### Rejeitar

A solicitação é recusada e seu status é atualizado para:

```text
REJECTED
```

Todas as alterações são enviadas para a API e persistidas no banco de dados.

---

# 🖥️ Telas do sistema

## Usuário

| Rota                   | Descrição                                |
| ---------------------- | ---------------------------------------- |
| `/centros`             | Listagem de centros de reciclagem        |
| `/solicitacoes/criar`  | Criação de uma solicitação               |
| `/solicitacoes/minhas` | Visualização das solicitações do usuário |

## Empresa

| Rota              | Descrição                               |
| ----------------- | --------------------------------------- |
| `/empresa/painel` | Painel de gerenciamento de solicitações |

---

# 🔄 Navegação condicional

O sistema identifica o tipo de conta do usuário após a autenticação.

### Usuários

São direcionados para:

```text
/centros
```

### Empresas

São direcionadas para:

```text
/empresa/painel
```

---

# 🔌 Integração com API

O frontend se comunica com a API REST do backend.

Principais endpoints utilizados:

| Método | Endpoint                | Descrição                           |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/centers/`             | Listagem de centros                 |
| GET    | `/material-types/`      | Listagem de materiais               |
| POST   | `/requests/`            | Criação de solicitações             |
| GET    | `/requests/my/`         | Solicitações do usuário             |
| GET    | `/requests/center/`     | Solicitações recebidas pela empresa |
| PATCH  | `/requests/:id/status/` | Atualização do status               |

---

# ✨ Funcionalidades

## Autenticação

* Login com JWT;
* Cadastro de usuários e empresas;
* Persistência da sessão;
* Logout;
* Consulta do usuário autenticado.

## Formulários

* Validação de campos obrigatórios;
* Máscara para telefone brasileiro;
* Endereço dividido em campos;
* Quantidade e unidade de medida.

## Exibição de dados

* Formatação de telefone;
* Formatação de datas;
* Exibição de quantidade com unidade;
* Exibição de informações do usuário nas solicitações.

---

# 🧪 Credenciais de teste

Para testar o sistema:

1. Crie uma conta de usuário;
2. Crie uma conta de empresa;
3. Faça login utilizando as credenciais cadastradas.

Ao cadastrar uma empresa, o centro de reciclagem é criado automaticamente.

---

# 🛠️ Tecnologias utilizadas

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS 4**
* **Context API**

### Backend

* **Django**
* **Django REST Framework**
* **JWT**

### Banco de Dados

* **SQLite**

---

# 📁 Estrutura do Frontend

```text
frontend-reciclagem-app/
│
├── app/                         # Páginas e rotas
│   ├── centros/                 # Centros de reciclagem
│   ├── solicitacoes/            # Solicitações
│   │   ├── criar/               # Criação de solicitação
│   │   └── minhas/              # Solicitações do usuário
│   ├── empresa/
│   │   └── painel/              # Painel da empresa
│   ├── signin/                  # Login
│   ├── signup/                  # Cadastro
│   ├── home/                    # Página inicial
│   └── layout.tsx               # Layout principal
│
├── components/                  # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Logo.tsx
│   └── Navigation.tsx
│
├── context/
│   └── AuthContext.tsx          # Contexto de autenticação
│
├── types/
│   └── index.ts                 # Tipos e interfaces
│
└── utils/
    ├── api.ts                   # Cliente da API
    ├── phoneMask.ts             # Máscara de telefone
    └── validation.ts            # Validações
```

---

# 📜 Scripts disponíveis

| Comando         | Descrição                            |
| --------------- | ------------------------------------ |
| `npm run dev`   | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção             |
| `npm start`     | Inicia a aplicação em produção       |
| `npm run lint`  | Executa o linter                     |

---
