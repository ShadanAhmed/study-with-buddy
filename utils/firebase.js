// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-czg7XVR3pBijoVIyTuFAKmHnXoikE08",
  authDomain: "studywithbuddy-beb45.firebaseapp.com",
  projectId: "studywithbuddy-beb45",
  storageBucket: "studywithbuddy-beb45.appspot.com",
  messagingSenderId: "208725170308",
  appId: "1:208725170308:web:7587088882b16f6b09cad1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

export { db, auth, firebaseConfig };
