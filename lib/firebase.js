import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD9gbQtBAH0pczC6qnS-T61xyCmWsNgxkI",
  authDomain: "askarg-caddb.firebaseapp.com",
  projectId: "askarg-caddb",
  storageBucket: "askarg-caddb.firebasestorage.app",
  messagingSenderId: "175402806560",
  appId: "1:175402806560:android:8d47052d97246f4c04bb45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;