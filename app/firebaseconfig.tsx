import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2t_W_VEqPr8MAEfu_zkHIkvaqCG34t5c",
  authDomain: "myapp-52b7f.firebaseapp.com",
  projectId: "myapp-52b7f",
  storageBucket: "myapp-52b7f.appspot.com",
  messagingSenderId: "1010131288154",
  appId: "1:1010131288154:web:4087c16ac9e1f5e168d863",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };