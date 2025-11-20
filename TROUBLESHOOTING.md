# Troubleshooting - Erro "Failed to Fetch"

## Problema: Erro "Failed to Fetch" no Login/Cadastro

Este erro geralmente ocorre quando o frontend não consegue se conectar ao backend.

### Verificações Rápidas:

1. **Backend está rodando?**
   ```bash
   cd backend
   npm run dev
   ```
   Você deve ver: `🚀 Server running on port 5000`

2. **Arquivo .env do Frontend existe?**
   Crie um arquivo `.env` na raiz do projeto (mesmo nível do `package.json`) com:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Reiniciou o servidor do frontend?**
   Após criar/editar o `.env`, você DEVE reiniciar:
   ```bash
   # Pare o servidor (Ctrl+C)
   # Depois inicie novamente:
   npm run dev
   ```

4. **Portas estão corretas?**
   - Frontend: `http://localhost:3000` (padrão do Vite)
   - Backend: `http://localhost:5000` (padrão configurado)

5. **CORS está configurado?**
   No `.env` do backend, certifique-se de ter:
   ```env
   FRONTEND_URL=http://localhost:3000
   ```

### Teste Manual:

Abra no navegador: `http://localhost:5000/health`

Se aparecer:
```json
{"status":"ok","message":"OLIA API is running"}
```
✅ Backend está funcionando!

Se der erro de conexão:
❌ Backend não está rodando ou porta está errada

### Solução Passo a Passo:

1. **Verifique se o backend está rodando:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Crie/Verifique o .env do frontend:**
   ```bash
   # Na raiz do projeto (não dentro de backend/)
   echo "VITE_API_URL=http://localhost:5000" > .env
   ```

3. **Reinicie o frontend:**
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

4. **Teste no navegador:**
   - Abra o DevTools (F12)
   - Vá na aba "Network"
   - Tente fazer login
   - Veja se a requisição aparece e qual o erro

### Erros Comuns:

**Erro: "Network Error" ou "Failed to Fetch"**
- Backend não está rodando
- URL incorreta no .env
- Problema de CORS

**Erro: "404 Not Found"**
- Rota não existe no backend
- URL base está errada

**Erro: "CORS policy"**
- Adicione `FRONTEND_URL=http://localhost:3000` no `.env` do backend
- Reinicie o backend

### Verificação Final:

No console do navegador (F12), você deve ver as requisições sendo feitas para:
- `http://localhost:5000/api/auth/login`
- `http://localhost:5000/api/auth/register/user`
- etc.

Se as requisições estão indo para outro endereço, o `.env` não está sendo lido corretamente.

