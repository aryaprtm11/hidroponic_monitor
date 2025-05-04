"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Dynamically import analytics to prevent server-side rendering issues
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHG8Esl8et5eSWNiPpvTfCBpXw8BEbeas",
  authDomain: "hidroponic-monitor.firebaseapp.com",
  projectId: "hidroponic-monitor",
  storageBucket: "hidroponic-monitor.appspot.com",
  messagingSenderId: "163479898889",
  appId: "1:163479898889:web:9eeb70fd85114fbb2d21d8",
  measurementId: "G-EDLHKCSXGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const db = getFirestore(app);
export { db };
