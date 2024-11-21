import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANdWL6THF64wlR2nK_DSdHs_-7tn6HK8Q",
  authDomain: "todo-list-c5552.firebaseapp.com",
  projectId: "todo-list-c5552",
  storageBucket: "todo-list-c5552.firebasestorage.app",
  messagingSenderId: "795634136253",
  appId: "1:795634136253:web:e77a51e93e974722f1f3d4",
  measurementId: "G-W69B5ZLJNN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);