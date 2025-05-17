"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCys5l6T-Gkg0eKwxbWhcNED7_YzDsmQLc",
  authDomain: "smartgreen-hidroponik.firebaseapp.com",
  databaseURL: "https://smartgreen-hidroponik-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgreen-hidroponik",
  storageBucket: "smartgreen-hidroponik.firebasestorage.app",
  messagingSenderId: "308916337891",
  appId: "1:308916337891:web:0ed22426892a5ce658d9d6",
  measurementId: "G-M84K2T6CQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Realtime Database
const db = getDatabase(app);
export { db };
