# 🔧 Configuração do Clerk para Produção

## 📋 Chaves de Produção Configuradas

### ✅ Chaves Fornecidas:
- **Publishable Key:** `pk_live_SUA_CHAVE_AQUI`
- **Secret Key:** `sk_live_SUA_CHAVE_AQUI`

## 🚀 Configuração para GitHub Pages

### 1. Configurar Secret no GitHub:
1. Vá para o repositório no GitHub
2. Clique em **"Settings"** > **"Secrets and variables"** > **"Actions"**
3. Clique em **"New repository secret"**
4. Adicione:
   - **Name:** `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value:** `pk_live_SUA_CHAVE_AQUI`

### 2. Configurar Domínios no Clerk:
1. Acesse [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Vá em **"Domains"** no menu lateral
3. Adicione os domínios:
   - `renanrmartins.github.io`
   - `medconnect.vercel.app` (se usar Vercel)

## 🏠 Configuração Local

### 1. Criar arquivo `.env` na raiz do projeto:
```env
# Clerk Production Keys
VITE_CLERK_PUBLISHABLE_KEY=pk_live_SUA_CHAVE_AQUI

# API Configuration
VITE_API_URL=https://api.medconnect.com/api
```

### 2. Testar localmente:
```bash
npm run dev
```

## 🌐 Configuração para Vercel

### 1. Configurar Environment Variables:
1. Vá para [https://vercel.com/](https://vercel.com/)
2. Selecione seu projeto
3. Vá em **"Settings"** > **"Environment Variables"**
4. Adicione:
   - **Name:** `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value:** `pk_live_SUA_CHAVE_AQUI`
   - **Environment:** Production

## 🔍 Verificar Configuração

### 1. Testar em Desenvolvimento:
```bash
npm run dev
# Acesse http://localhost:3000
# Verifique se o Clerk carrega sem erros
```

### 2. Testar em Produção:
```bash
npm run build
npm run preview
# Acesse http://localhost:4173
# Verifique se o Clerk carrega sem erros
```

## 🚨 Troubleshooting

### Se não funcionar:
1. **Verifique as chaves** - Certifique-se de que são as de produção
2. **Verifique os domínios** - Adicione todos os domínios necessários
3. **Verifique as variáveis** - Certifique-se de que estão configuradas corretamente
4. **Verifique o console** - Procure por erros no navegador

### Erros Comuns:
- **"Invalid publishable key"** - Verifique se a chave está correta
- **"Domain not allowed"** - Adicione o domínio no Clerk
- **"Clerk not loaded"** - Verifique se a variável de ambiente está configurada

## 📊 Monitoramento

### No Dashboard do Clerk:
1. Vá em **"Analytics"** para ver:
   - Usuários ativos
   - Tentativas de login
   - Erros de autenticação

---

## ✅ Checklist de Configuração

- [ ] Secret configurado no GitHub
- [ ] Domínios adicionados no Clerk
- [ ] Arquivo `.env` criado localmente
- [ ] Teste local funcionando
- [ ] Deploy funcionando
- [ ] Autenticação funcionando em produção

**MedConnect configurado com sucesso para produção!** 🚀✨
