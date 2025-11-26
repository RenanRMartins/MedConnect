# ✅ Firebase Configurado com Sucesso!

## 🔥 Credenciais Configuradas

Suas credenciais do Firebase já foram configuradas no código:

- **Project ID**: `medconnect-1f6e5`
- **Auth Domain**: `medconnect-1f6e5.firebaseapp.com`
- **Storage Bucket**: `medconnect-1f6e5.firebasestorage.app`

## 📋 Próximos Passos no Firebase Console

### 1. Habilitar Authentication (Email/Password)

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `medconnect-1f6e5`
3. No menu lateral, clique em **"Authentication"**
4. Clique em **"Get started"** (se ainda não habilitou)
5. Vá na aba **"Sign-in method"**
6. Clique em **"Email/Password"**
7. Ative **"Email/Password"** e clique em **"Save"**

### 2. Criar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Create database"**
3. Escolha **"Start in test mode"** (para desenvolvimento)
4. Selecione a localização: **"southamerica-east1"** (São Paulo) ou a mais próxima
5. Clique em **"Enable"**

### 3. Configurar Regras de Segurança do Firestore

⚠️ **IMPORTANTE**: Use as regras do arquivo `FIREBASE_RULES_CORRIGIDAS.md` que corrigem os problemas de permissões!

No Firestore, vá em **"Rules"** e cole estas regras (versão corrigida):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function para verificar autenticação
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function para verificar se é o próprio usuário
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Usuários - apenas o próprio usuário pode ler/escrever
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      // Permitir criação durante registro
      allow create: if isAuthenticated();
    }
    
    // Consultas - usuário pode ler/escrever suas próprias consultas
    match /appointments/{appointmentId} {
      // Permitir leitura se for paciente ou profissional da consulta
      allow read: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
      // Permitir criação se o usuário for o paciente
      allow create: if isAuthenticated() && request.resource.data.patientId == request.auth.uid;
      // Permitir atualização se for paciente ou profissional
      allow update: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
      // Permitir exclusão apenas para o paciente
      allow delete: if isAuthenticated() && resource.data.patientId == request.auth.uid;
    }
    
    // Registros médicos
    match /medicalRecords/{recordId} {
      allow read: if request.auth != null && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
    }
    
    // Avaliações
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.patientId == request.auth.uid;
    }
    
    // Notificações
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Lembretes
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Transações financeiras
    match /financialTransactions/{transactionId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Insumos (acesso para todos autenticados)
    match /supplies/{supplyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Movimentações de estoque
    match /supplyMovements/{movementId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Resultados de exames
    match /examResults/{examId} {
      allow read: if request.auth != null && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
    }
    
    // Configurações de confirmação automática
    match /autoConfirmationSettings/{settingsId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Configurar Storage (Opcional - para upload de arquivos)

1. No menu lateral, clique em **"Storage"**
2. Clique em **"Get started"**
3. Aceite as regras padrão
4. Configure regras de segurança conforme necessário

## 🧪 Testar a Configuração

1. Execute o projeto:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:5173`

3. Tente criar uma conta:
   - Vá em "Cadastrar"
   - Preencha os dados
   - Clique em "Criar Conta"

4. Verifique no Firebase Console:
   - **Authentication** → Deve aparecer o novo usuário
   - **Firestore Database** → Deve aparecer a coleção `users` com o documento do usuário

## 🚀 Deploy

### Para GitHub Pages:

```bash
npm run build
npm run deploy
```

### Para Vercel:

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente (opcional, já estão no código)
3. Deploy automático!

## ✅ Checklist

- [x] Credenciais configuradas no código
- [ ] Authentication habilitado (Email/Password)
- [ ] Firestore Database criado
- [ ] Regras de segurança configuradas
- [ ] Teste de criação de conta funcionando
- [ ] Dados aparecendo no Firestore

## 📝 Notas Importantes

- As credenciais estão configuradas como **fallback** no código, então funcionará mesmo sem arquivo `.env`
- Para produção, recomenda-se usar variáveis de ambiente
- O Firebase Analytics está configurado e funcionando
- Todas as coleções do Firestore serão criadas automaticamente quando você usar as funcionalidades

---

**Seu projeto está pronto para usar!** 🎉

