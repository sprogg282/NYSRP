import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
export const missingFirebaseConfig = requiredConfig.filter((key) => !config[key]?.trim());
export const firebaseConfigured = missingFirebaseConfig.length === 0;
export let firebaseInitializationError: string | undefined;
export let auth: ReturnType<typeof getAuth> | null = null;
export let db: ReturnType<typeof getFirestore> | null = null;
export let analytics: Analytics | null = null;

if (firebaseConfigured) {
  try {
    const existingApp = getApps().find((candidate) => candidate.name === '[DEFAULT]');
    if (existingApp && existingApp.options.projectId !== config.projectId) {
      throw new Error('The existing Firebase app is connected to a different project.');
    }
    const app = existingApp ?? initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    void isSupported()
      .then((supported) => {
        if (supported) analytics = getAnalytics(app);
      })
      .catch(() => {
        // Analytics is optional and may be unavailable in restricted browsers.
      });
  } catch (error) {
    firebaseInitializationError = error instanceof Error ? error.message : 'Firebase could not be initialized';
  }
}