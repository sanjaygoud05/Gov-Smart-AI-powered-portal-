
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDm_LfNu4TQS6Qi9Hv1LWebqNh55YGcN0A",
  authDomain: "schemechecker.firebaseapp.com",
  projectId: "schemechecker",
  storageBucket: "schemechecker.firebasestorage.app",
  messagingSenderId: "318109045644",
  appId: "1:318109045644:web:1e333fd5c1e13cd56bfca9",
  measurementId: "G-V058EEWNGG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, analytics, db };
