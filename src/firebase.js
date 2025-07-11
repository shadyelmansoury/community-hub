import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBN6opABavXAJCvCnRvghYU4E0faOM7ng",
  authDomain: "community-hub-saltproject.firebaseapp.com",
  projectId: "community-hub-saltproject",
  storageBucket: "community-hub-saltproject.firebasestorage.app",
  messagingSenderId: "1007010017446",
  appId: "1:1007010017446:web:06f371a8755fb509968467"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);