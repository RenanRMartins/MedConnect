import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDLForePURBYpKlqqaUBmQ1vNNNpyc6g-8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "medconnect-1f6e5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "medconnect-1f6e5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "medconnect-1f6e5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "314006232586",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:314006232586:web:4b913963e0741b504949f3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-32PJG4CNG1",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Inicializar Analytics (apenas no cliente)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase Analytics não pôde ser inicializado:', error);
  }
}

export { analytics };

export default app;

