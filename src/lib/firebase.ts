
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCTU4X1f29IBEKeIb-bL34tsj1w16cFR80",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "prodigy-fse.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prodigy-fse",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "prodigy-fse.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "676325701130",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:676325701130:web:a31ed05799e2b4fe9e91f3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-T6BSZ23PS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to the Firebase Emulator Suite when in development
if (import.meta.env.DEV) {
  try {
    connectFunctionsEmulator(functions, "localhost", 5001);
  } catch (e) {
    console.warn("Could not connect to Firebase Functions Emulator. Make sure it's running.");
  }
}

export default app;
