// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3ipPwUyqX1P26NkIwwu8tfyacQj3C50Q",
  authDomain: "curatorial-c08d6.firebaseapp.com",
  projectId: "curatorial-c08d6",
  storageBucket: "curatorial-c08d6.appspot.com",
  messagingSenderId: "470139703521",
  appId: "1:470139703521:web:8a215423375909a74767a0",
  measurementId: "G-D6LT3ET0RR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };