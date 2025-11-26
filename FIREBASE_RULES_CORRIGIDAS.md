# 🔒 Regras do Firestore Corrigidas

## ⚠️ Problemas Corrigidos

1. **Índices Compostos**: Queries simplificadas para evitar necessidade de índices
2. **Permissões**: Regras atualizadas para permitir criação de consultas
3. **Logout**: Corrigido para limpar estado e redirecionar

## 📋 Regras do Firestore Atualizadas

Cole estas regras no Firebase Console → Firestore Database → Rules:

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
      allow read: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
    }
    
    // Avaliações
    match /reviews/{reviewId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && resource.data.patientId == request.auth.uid;
    }
    
    // Notificações
    match /notifications/{notificationId} {
      allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
    
    // Lembretes
    match /reminders/{reminderId} {
      allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
    
    // Transações financeiras
    match /financialTransactions/{transactionId} {
      allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
    
    // Insumos (acesso para todos autenticados)
    match /supplies/{supplyId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Movimentações de estoque
    match /supplyMovements/{movementId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Resultados de exames
    match /examResults/{examId} {
      allow read: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        resource.data.professionalId == request.auth.uid
      );
    }
    
    // Configurações de confirmação automática
    match /autoConfirmationSettings/{settingsId} {
      allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## ✅ O que foi corrigido no código

### 1. Queries Simplificadas
- **Antes**: Múltiplos `where` + `orderBy` (requeriam índices compostos)
- **Depois**: Um `where` principal + `orderBy` + filtros em memória

### 2. Permissões de Criação
- Adicionado `allow create` explícito para appointments
- Verificação de `request.resource.data` para garantir que o usuário está criando seus próprios dados

### 3. Logout Corrigido
- Limpa localStorage
- Redireciona para home
- Limpa estado do store

## 🧪 Como Testar

1. **Testar criação de consulta**:
   - Faça login
   - Tente agendar uma consulta
   - Deve funcionar sem erro de permissões

2. **Testar logout**:
   - Faça login
   - Clique em logout
   - Deve redirecionar para home e limpar sessão

3. **Verificar índices**:
   - Não deve mais aparecer erros de índice
   - Queries funcionam com filtros em memória

## 📝 Notas

- As queries agora filtram em memória após buscar do Firestore
- Isso é mais eficiente para pequenos volumes de dados
- Para grandes volumes, você pode criar índices compostos no Firebase Console se necessário
- As regras agora permitem criação de appointments corretamente

---

**Todos os problemas foram corrigidos!** ✅

