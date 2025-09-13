// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAECB-BW8D3Zqtpn1lUnMK4GS237dJdSZc",
  authDomain: "aichat-c3511.firebaseapp.com",
  projectId: "aichat-c3511",
  storageBucket: "aichat-c3511.firebasestorage.app",
  messagingSenderId: "158911012248",
  appId: "1:158911012248:web:9ce4efd0a50022a8191fed",
  measurementId: "G-1LQ1TB3127"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;