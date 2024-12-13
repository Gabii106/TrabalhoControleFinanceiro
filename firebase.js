import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFBKxGVh4PAZdR34sTRjvRcz8dRmf2UrI",
  authDomain: "controlefinanceiro-142c7.firebaseapp.com",
  projectId: "controlefinanceiro-142c7",
  storageBucket: "controlefinanceiro-142c7.firebasestorage.app",
  messagingSenderId: "128178924874",
  appId: "1:128178924874:web:a3a03b21f01858216065b3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };