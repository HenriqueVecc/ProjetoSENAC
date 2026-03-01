# Backend API — Projeto SENAC (Django + DRF + JWT)

API REST em Django (Django REST Framework) com autenticação JWT (SimpleJWT), organizada em **apps por módulo**:

- `authentication_access`: cadastro e autenticação (JWT)
- `centers`: cadastro e listagem de centros (empresas)
- `requests_app`: materiais e solicitações de coleta

---

## ✅ Requisitos

- Python 3.11+ (recomendado)  
  > Observação: pode funcionar com Python 3.13 se as dependências estiverem compatíveis.
- pip / venv

---

##  Como rodar o projeto

### 1) Clonar e entrar na pasta
```bash
git clone <SEU_REPO_AQUI>
cd backend-api
```

### 2) Criar e ativar ambiente virtual

**Windows (PowerShell)**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**Windows (CMD)**
```bash
python -m venv venv
venv\Scripts\activate.bat
```

**Linux / Mac**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3) Instalar dependências
```bash
pip install -r requirements.txt
```

### 4) Variáveis de ambiente (.env)
Crie um arquivo `.env` na raiz do projeto (mesmo nível do `manage.py`):

Exemplo:
```env
DEBUG=True
SECRET_KEY=coloque_uma_chave_segura_aqui
ALLOWED_HOSTS=127.0.0.1,localhost
```

> Se você estiver usando `django-environ`, confirme se o `read_env` está apontando corretamente.

### 5) Migrar banco
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6) Criar superusuário (admin)
```bash
python manage.py createsuperuser
```

### 7) Criar materiais (Seeds)

`seed_materials`:
```bash
python manage.py seed_materials
```

Cria materiais padrão:
- Papel
- Plástico
- Vidro
- Metal


### 8) Rodar servidor
```bash
python manage.py runserver
```

Servidor:
- `http://127.0.0.1:8000/`

Admin:
- `http://127.0.0.1:8000/admin/`

---

##  Estrutura do projeto

```
backend-api/
  core/                      # projeto django (settings/urls)
  authentication_access/     # auth + profile (USER/CENTER) + JWT
  centers/                   # centers (empresa)
  requests_app/              # material types + pickup requests
  manage.py
  requirements.txt
  .env
```

---

##  Modelagem (tabelas principais)

### Users (Django default) + Profile
O projeto usa a tabela padrão do Django (`auth_user`) e guarda campos extras em `Profile`:

- `Profile.name`
- `Profile.type` (USER | CENTER)
- `Profile.created_at`

### Centers
- `user` (OneToOne com User)
- `name`, `address`, `phone`, `description`, `created_at`

### MaterialType
- `name` (único)

### PickupRequest
- `user` (FK User — quem solicitou)
- `center` (FK Center — para qual centro)
- `material_type` (FK MaterialType)
- `estimated_quantity`, `address`, `pickup_date`
- `status` (PENDING | ACCEPTED | REJECTED)
- `created_at`

---

## Postman

A coleção do Postman está em `postman/`.

- `postman/ProjetoSENAC.postman_collection.json`

---

##  Autenticação (JWT)

### Login / Obter Token
`POST /api/v1/token/`

Body:
```json
{
  "username": "email@teste.com",
  "password": "Senha@123"
}
```

Resposta:
```json
{
  "refresh": "xxxxx",
  "access": "yyyyy"
}
```

### Refresh Token
`POST /api/v1/token/refresh/`

Body:
```json
{
  "refresh": "xxxxx"
}
```

### Verify Token
`POST /api/v1/token/verify/`

Body:
```json
{
  "token": "yyyyy"
}
```

---

##  Endpoints da API

Base URL:
- `http://127.0.0.1:8000/api/v1/`

### 1) Autenticação — `authentication_access`

#### Registrar usuário
`POST /register/`

Body:
```json
{
  "name": "João",
  "email": "user@teste.com",
  "password": "Senha@123",
  "type": "USER"
}
```

> Para criar centro, registre com `type: "CENTER"`.

#### JWT
- `POST /token/`
- `POST /token/refresh/`
- `POST /token/verify/`

---

### 2) Centros — `centers`

#### Criar centro (somente usuário tipo CENTER)
`POST /centers/`

Headers:
```
Authorization: Bearer <ACCESS_TOKEN_DO_CENTER>
Content-Type: application/json
```

Body:
```json
{
  "name": "Centro de Reciclagem ABC",
  "address": "Rua X, 123 - SP",
  "phone": "(11) 99999-9999",
  "description": "Coletamos papel, plástico e vidro."
}
```

#### Listar centros (público)
`GET /centers/`

#### Detalhar centro (público)
`GET /centers/<id>/`

---

### 3) Solicitação de Coleta — `requests_app`

#### Listar materiais (público)
`GET /material-types/`

#### Criar material (opcional / se habilitado: CENTER only)
`POST /material-types/`

Headers:
```
Authorization: Bearer <ACCESS_TOKEN_DO_CENTER>
Content-Type: application/json
```

Body:
```json
{ "name": "Papel" }
```

#### Criar solicitação (somente USER)
`POST /requests/`

Headers:
```
Authorization: Bearer <ACCESS_TOKEN_DO_USER>
Content-Type: application/json
```

Body:
```json
{
  "center": 2,
  "material_type": 1,
  "estimated_quantity": 10,
  "address": "Rua A, 200",
  "pickup_date": "2026-03-10"
}
```

#### Ver minhas solicitações (somente USER)
`GET /requests/my/`

Headers:
```
Authorization: Bearer <ACCESS_TOKEN_DO_USER>
```

#### Centro ver solicitações recebidas (somente CENTER)
`GET /requests/center/`

Headers:
```
Authorization: Bearer <ACCESS_TOKEN_DO_CENTER>
```

#### Centro aceitar/rejeitar uma solicitação (somente CENTER dono do centro)
`PATCH /requests/<id>/status/`

Headers:
```
Authorization: Bearer <ACCESS_TOKEN_DO_CENTER>
Content-Type: application/json
```

Body:
```json
{ "status": "ACCEPTED" }
```

ou
```json
{ "status": "REJECTED" }
```

---

##  Fluxo de teste recomendado (Postman)

1. Registre um `USER` e um `CENTER`
2. Faça login e pegue `access` de cada um
3. Com token do `CENTER`, crie um Center (`POST /centers/`)
4. Com token do `USER`, crie uma request (`POST /requests/`)
5. Com token do `CENTER`, liste recebidas (`GET /requests/center/`)
6. Com token do `CENTER`, aceite/rejeite (`PATCH /requests/<id>/status/`)

---

## Admin (Django)

Acesse:
- `http://127.0.0.1:8000/admin/`

Cadastre:
- Material Types
- Centers
- Pickup Requests
- Profiles

---

## Erros comuns

### 405 Method Not Allowed no /token/
Você está tentando acessar com **GET** (navegador). O endpoint aceita somente **POST**.

### 403 “Você não tem permissão…”
- `POST /centers/` exige usuário `type=CENTER`
- `POST /requests/` exige usuário `type=USER`
- `PATCH /requests/:id/status/` exige usuário `type=CENTER` dono do centro

### 404 “No PickupRequest matches the given query”
O `id` na URL não existe (use o `id` retornado na listagem).

---

## Tecnologias

- Django
- Django REST Framework
- SimpleJWT
- SQLite (padrão, pode trocar para Postgres/MySQL)

---

