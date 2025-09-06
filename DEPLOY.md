# 🚀 Deploy no GitHub Pages

Este guia explica como fazer o deploy do MedConnect no GitHub Pages.

## 📋 Pré-requisitos

- Conta no GitHub
- Repositório criado no GitHub
- Node.js instalado localmente

## 🔧 Configuração do Repositório

### 1. Configurar GitHub Pages

1. Acesse o repositório no GitHub
2. Vá em **Settings** > **Pages**
3. Em **Source**, selecione **GitHub Actions**
4. Salve as configurações

### 2. Configurar Secrets (se necessário)

Se você usar variáveis de ambiente:
1. Vá em **Settings** > **Secrets and variables** > **Actions**
2. Adicione as variáveis necessárias

## 🚀 Deploy Automático

O deploy é automático quando você faz push para a branch `main`:

```bash
git add .
git commit -m "Deploy: Atualização da aplicação"
git push origin main
```

## 🔧 Deploy Manual

### 1. Build Local

```bash
npm run build
```

### 2. Deploy com gh-pages

```bash
npm run deploy
```

## 📱 Acessando a Aplicação

Após o deploy, a aplicação estará disponível em:

```
https://renanrmartins.github.io/MedConnect/
```

## 🐛 Solução de Problemas

### Erro 404
- Verifique se o arquivo `.nojekyll` existe na raiz
- Confirme se o `base` no `vite.config.ts` está correto

### Erro de Build
- Verifique se todas as dependências estão instaladas
- Execute `npm ci` para instalar dependências limpas

### Erro de Roteamento
- Verifique se as rotas estão configuradas corretamente
- Confirme se o `BrowserRouter` está sendo usado

## 📊 Monitoramento

- Acesse **Actions** no GitHub para ver o status do deploy
- Verifique os logs em caso de erro
- Monitore a performance da aplicação

## 🔄 Atualizações

Para atualizar a aplicação:

1. Faça as alterações necessárias
2. Teste localmente com `npm run dev`
3. Faça commit e push para `main`
4. O deploy será automático

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do GitHub Actions
2. Consulte a documentação do Vite
3. Abra uma issue no repositório

---

**MedConnect** - Deploy simplificado para GitHub Pages! 🚀
