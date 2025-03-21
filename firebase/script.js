import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyCkCPKPziS0G1-HaM71DGe7Mwqrk7POc",
  authDomain: "bullionevents-b7ca4.firebaseapp.com",
  projectId: "bullionevents-b7ca4",
  storageBucket: "bullionevents-b7ca4.firebasestorage.app",
  messagingSenderId: "51970108577",
  appId: "1:51970108577:web:4c23b67c908250752d54e0",
  measurementId: "G-KTPFJVESVP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export Firestore database
export { db };