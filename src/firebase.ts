import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqetk9R8FrbZpkzhyV0th1LKOeCdRcZGQ",
  authDomain: "react-ecommerce-firebase-9c752.firebaseapp.com",
  projectId: "react-ecommerce-firebase-9c752",
  storageBucket: "react-ecommerce-firebase-9c752.firebasestorage.app",
  messagingSenderId: "43179463273",
  appId: "1:43179463273:web:6059637af7c54fe07088f8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;