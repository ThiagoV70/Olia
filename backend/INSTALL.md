# Guia de Instalação - OLIA Backend

## Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL (versão 14 ou superior)
- npm ou yarn

## Passo a Passo

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados PostgreSQL

#### Opção A: Usando Docker (Recomendado)

```bash
docker run --name olia-postgres \
  -e POSTGRES_USER=olia_user \
  -e POSTGRES_PASSWORD=olia_password \
  -e POSTGRES_DB=olia_db \
  -p 5432:5432 \
  -d postgres:14
```

#### Opção B: Instalação Local

1. Instale o PostgreSQL no seu sistema
2. Crie um banco de dados:
```sql
CREATE DATABASE olia_db;
CREATE USER olia_user WITH PASSWORD 'olia_password';
GRANT ALL PRIVILEGES ON DATABASE olia_db TO olia_user;
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:

```env
DATABASE_URL="postgresql://olia_user:olia_password@localhost:5432/olia_db?schema=public"
JWT_SECRET="seu_jwt_secret_super_seguro_aqui_mude_em_producao"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**⚠️ IMPORTANTE:** Altere o `JWT_SECRET` para um valor seguro em produção!

### 4. Executar Migrações

```bash
npm run prisma:generate
npm run prisma:migrate
```

Isso criará todas as tabelas no banco de dados.

### 5. Popular Banco com Dados Iniciais (Opcional)

```bash
npm run prisma:seed
```

Isso criará:
- Um usuário governo (email: `governo@olia.com`, senha: `admin123`)
- Recompensas padrão
- Locais de retirada de exemplo

### 6. Iniciar o Servidor

#### Desenvolvimento
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

#### Produção
```bash
npm run build
npm start
```

## Verificar Instalação

Acesse `http://localhost:5000/health` no navegador ou via curl:

```bash
curl http://localhost:5000/health
```

Você deve receber:
```json
{
  "status": "ok",
  "message": "OLIA API is running"
}
```

## Prisma Studio (Visualizar Dados)

Para visualizar e editar dados do banco de forma visual:

```bash
npm run prisma:studio
```

Isso abrirá uma interface web em `http://localhost:5555`

## Estrutura do Banco de Dados

O banco de dados contém as seguintes tabelas principais:

- `users` - Usuários do sistema
- `schools` - Escolas participantes
- `governments` - Usuários do governo
- `donations` - Doações de óleo
- `collections` - Coletas realizadas pelo governo
- `rewards` - Recompensas disponíveis
- `reward_requests` - Solicitações de recompensas
- `pickup_locations` - Locais de retirada de sabão
- `pickups` - Retiradas realizadas
- `notifications` - Notificações do sistema

## Troubleshooting

### Erro de conexão com o banco

1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão:
```bash
psql -U olia_user -d olia_db -h localhost
```

### Erro nas migrações

Se houver erro nas migrações, você pode resetar o banco (⚠️ apaga todos os dados):

```bash
npx prisma migrate reset
```

### Porta já em uso

Se a porta 5000 estiver em uso, altere no arquivo `.env`:
```env
PORT=5001
```

## Próximos Passos

1. Configure o frontend para se conectar ao backend
2. Teste os endpoints usando Postman ou Insomnia
3. Configure variáveis de ambiente de produção
4. Configure HTTPS em produção

## Suporte

Para mais informações, consulte o `README.md` principal.

