# OLIA Backend API

Backend completo para o sistema OLIA - Reciclagem de Óleo.

## Tecnologias

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT (Autenticação)
- bcryptjs (Hash de senhas)

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```

3. Configure a variável `DATABASE_URL` no arquivo `.env` com suas credenciais do PostgreSQL.

4. Execute as migrações do Prisma:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. (Opcional) Execute o seed para popular o banco com dados iniciais:
```bash
npm run prisma:seed
```

## Executando o servidor

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── middleware/      # Middlewares (auth, etc)
│   ├── utils/           # Funções utilitárias
│   └── server.ts        # Arquivo principal
├── prisma/
│   └── schema.prisma    # Schema do banco de dados
└── package.json
```

## Endpoints Principais

### Autenticação
- `POST /api/auth/register/user` - Registrar usuário
- `POST /api/auth/register/school` - Registrar escola
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Usuários
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/stats` - Estatísticas do usuário

### Escolas
- `GET /api/schools/public` - Listar escolas (público)
- `GET /api/schools/profile` - Obter perfil da escola
- `PUT /api/schools/profile` - Atualizar perfil
- `GET /api/schools/stats` - Estatísticas da escola
- `GET /api/schools/ranking` - Ranking de escolas

### Doações
- `POST /api/donations` - Criar doação
- `GET /api/donations/user` - Doações do usuário
- `GET /api/donations/school` - Doações da escola
- `PATCH /api/donations/:id/confirm` - Confirmar doação

### Coletas
- `POST /api/collections` - Solicitar coleta
- `GET /api/collections/school` - Coletas da escola
- `GET /api/collections/all` - Todas as coletas (governo)
- `PATCH /api/collections/:id/schedule` - Agendar coleta
- `PATCH /api/collections/:id/complete` - Concluir coleta

### Recompensas
- `GET /api/rewards` - Listar recompensas
- `POST /api/rewards/request` - Solicitar recompensa
- `GET /api/rewards/school/requests` - Solicitações da escola
- `GET /api/rewards/requests` - Todas as solicitações (governo)
- `PATCH /api/rewards/requests/:id/approve` - Aprovar recompensa
- `PATCH /api/rewards/requests/:id/deny` - Negar recompensa

### Retiradas
- `GET /api/pickups/locations` - Locais de retirada
- `POST /api/pickups/request` - Solicitar retirada
- `GET /api/pickups/user` - Retiradas do usuário
- `GET /api/pickups/all` - Todas as retiradas (governo)

### Notificações
- `GET /api/notifications` - Listar notificações
- `PATCH /api/notifications/:id/read` - Marcar como lida
- `POST /api/notifications` - Criar notificação (governo)

### Governo
- `GET /api/government/stats` - Estatísticas globais
- `GET /api/government/schools/top` - Top escolas
- `GET /api/government/schools` - Todas as escolas

## Autenticação

A maioria dos endpoints requer autenticação via JWT. Envie o token no header:
```
Authorization: Bearer <token>
```

## Variáveis de Ambiente

- `DATABASE_URL` - URL de conexão com o PostgreSQL
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRES_IN` - Tempo de expiração do token (padrão: 7d)
- `PORT` - Porta do servidor (padrão: 5000)
- `NODE_ENV` - Ambiente (development/production)
- `FRONTEND_URL` - URL do frontend para CORS
- `GEO_API_URL` - (Opcional) Endpoint do serviço de geocodificação (padrão: Nominatim)
- `GEO_USER_AGENT` - User-Agent utilizado nas requisições de geolocalização
- `GEO_VIEWBOX` - Bounding box para limitar a busca (padrão cobre Recife/PE)

## Banco de Dados

O banco de dados é gerenciado pelo Prisma. Para visualizar os dados:
```bash
npm run prisma:studio
```

## Licença

ISC

