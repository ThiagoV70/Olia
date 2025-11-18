# API Service - Documentação

Este arquivo documenta o serviço central de API criado para conectar o frontend ao backend.

## Configuração

O serviço usa a variável de ambiente `VITE_API_URL` definida no arquivo `.env` do frontend:

```env
VITE_API_URL=http://localhost:5000
```

## Estrutura

O arquivo `src/services/api.ts` exporta várias APIs organizadas por funcionalidade:

### Autenticação (`authApi`)
- `registerUser(data)` - Registrar novo usuário
- `registerSchool(data)` - Registrar nova escola
- `login(email, password, userType)` - Fazer login
- `getMe()` - Obter dados do usuário autenticado
- `logout()` - Fazer logout (remove token)

### Usuários (`userApi`)
- `getProfile()` - Obter perfil do usuário
- `updateProfile(data)` - Atualizar perfil
- `getStats()` - Obter estatísticas do usuário

### Escolas (`schoolApi`)
- `getAll(filters?)` - Listar todas as escolas (público)
- `getProfile()` - Obter perfil da escola
- `updateProfile(data)` - Atualizar perfil
- `getStats()` - Obter estatísticas
- `getRanking()` - Obter ranking de escolas

### Doações (`donationApi`)
- `create(schoolId, liters)` - Criar doação
- `getUserDonations()` - Doações do usuário
- `getSchoolDonations()` - Doações da escola
- `confirm(donationId)` - Confirmar doação

### Coletas (`collectionApi`)
- `request(requestedLiters, preferredDate)` - Solicitar coleta
- `getSchoolCollections()` - Coletas da escola
- `getAll(filters?)` - Todas as coletas (governo)
- `schedule(collectionId, scheduledDate)` - Agendar coleta
- `complete(collectionId, collectedLiters)` - Concluir coleta

### Recompensas (`rewardApi`)
- `getAll()` - Listar recompensas
- `request(rewardId)` - Solicitar recompensa
- `getSchoolRequests()` - Solicitações da escola
- `getAllRequests(status?)` - Todas as solicitações (governo)
- `approve(requestId)` - Aprovar recompensa
- `deny(requestId)` - Negar recompensa

### Retiradas (`pickupApi`)
- `getLocations()` - Locais de retirada
- `request(pickupLocationId)` - Solicitar retirada
- `getUserPickups()` - Retiradas do usuário
- `getAll()` - Todas as retiradas (governo)

### Notificações (`notificationApi`)
- `getAll(isRead?)` - Listar notificações
- `markAsRead(notificationId)` - Marcar como lida
- `create(data)` - Criar notificação (governo)

### Governo (`governmentApi`)
- `getStats()` - Estatísticas globais
- `getTopSchools(limit)` - Top escolas
- `getAllSchools(filters?)` - Todas as escolas

## Gerenciamento de Token

O token JWT é armazenado no `localStorage` com a chave `olia_token`. As funções auxiliares são:

- `setToken(token)` - Armazenar token
- `getToken()` - Obter token
- `removeToken()` - Remover token

O token é automaticamente incluído em todas as requisições autenticadas via header `Authorization: Bearer <token>`.

## Tratamento de Erros

Todas as requisições retornam erros padronizados. Em caso de erro, uma exceção é lançada com a mensagem de erro do backend.

## Exemplo de Uso

```typescript
import { authApi, userApi, donationApi } from '../services/api';

// Login
const response = await authApi.login('email@example.com', 'senha123', 'user');

// Obter perfil
const profile = await userApi.getProfile();

// Criar doação
await donationApi.create('school-id', 5.5);
```

