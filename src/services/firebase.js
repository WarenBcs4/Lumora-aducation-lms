import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAOcVb6k3VTGYe2H8AWEhzW0qRxKq7DTtQ",
  authDomain: "lumora-elearning.firebaseapp.com",
  projectId: "lumora-elearning",
  storageBucket: "lumora-elearning.firebasestorage.app",
  messagingSenderId: "540009869527",
  appId: "1:540009869527:web:cb7f07932086b10ede4092",
  measurementId: "G-DY4D1PNSPG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Enable offline persistence
try {
  enableNetwork(db);
} catch (error) {
  console.warn('Firebase offline mode enabled:', error.message);
}

export default app;