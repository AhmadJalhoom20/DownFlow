// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config keys
const firebaseConfig = {
  apiKey: "AIzaSyDjdHenxtgal5VShG0CM-97QtUUyarpmkc",
  authDomain: "wartycoonclone.firebaseapp.com",
  databaseURL: "https://wartycoonclone-default-rtdb.firebaseio.com",
  projectId: "wartycoonclone",
  storageBucket: "wartycoonclone.firebasestorage.app",
  messagingSenderId: "80532275393",
  appId: "1:80532275393:web:e9cd9a3b956d56ee205440",
  measurementId: "G-6T9B17C6SY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
