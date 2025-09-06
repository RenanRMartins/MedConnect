# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o MedConnect! Este documento fornece diretrizes para contribuições.

## 🚀 Como Contribuir

### 1. Fork e Clone

```bash
git clone https://github.com/renanrmartins/MedConnect.git
cd MedConnect
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Criar Branch

```bash
git checkout -b feature/nova-funcionalidade
```

### 4. Desenvolvimento

```bash
npm run dev
```

### 5. Testes

```bash
npm run test
npm run lint
npm run type-check
```

### 6. Commit

 Execute o comando:

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

### 7. Push

```bash
git push origin feature/nova-funcionalidade
```

### 8. Pull Request

Abra um PR no GitHub com descrição clara das mudanças.

## 📋 Padrões de Código

### TypeScript

- Use tipagem explícita
- Evite `any`
- Use interfaces para objetos
- Documente funções complexas

### React

- Use componentes funcionais
- Hooks para estado
- Props tipadas
- Nomes descritivos

### CSS

- Use Tailwind CSS
- Classes utilitárias
- Responsividade mobile-first
- Modo escuro

## 🧪 Testes

### Estrutura

```
src/
├── components/
│   └── __tests__/
├── pages/
│   └── __tests__/
└── utils/
    └── __tests__/
```

### Convenções

- Arquivos `.test.tsx`
- Mocks em `__mocks__/`
- Fixtures em `__fixtures__/`

## 📝 Commit Messages

### Formato

```
tipo: descrição breve

Descrição detalhada (opcional)

Refs: #issue
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Bug fix
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Configuração

## 🔍 Code Review

### Checklist

- [ ] Código limpo e legível
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Performance verificada
- [ ] Acessibilidade considerada

## 🐛 Reportar Bugs

### Template

```
**Descrição**
Descreva o bug claramente.

**Reprodução**
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

**Esperado**
O que deveria acontecer.

**Ambiente**
- OS: [ex. iOS]
- Browser: [ex. chrome]
- Versão: [ex. 22]
```

## 💡 Sugerir Features

### Template

```
**Problema**
Descreva o problema que resolve.

**Solução**
Descreva sua ideia.

**Alternativas**
Outras soluções consideradas.

**Contexto**
Informações adicionais.
```

## 📚 Recursos

- [React Docs](https://reactjs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Docs](https://vitejs.dev/)

## 🤝 Comunidade

- Discord: [Link do servidor]
- Slack: [Link do workspace]
- Email: contato@medconnect.com

## 📄 Licença

Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

**Obrigado por contribuir!** 🎉
