import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByYgX1E4LERyvaYyG4f-i4StuilUp06VI",
  authDomain: "paktravelapp.firebaseapp.com",
  projectId: "paktravelapp",
  storageBucket: "paktravelapp.appspot.com",
  messagingSenderId: "63235963194",
  appId: "1:63235963194:web:85fe71d3fc0185ee0e3803",
  measurementId: "G-QKF8118D19"
};

// Initialize Firebase
let app;
let db;
let analytics;

try {
  console.log("Initializing Firebase with config:", JSON.stringify(firebaseConfig, null, 2));
  app = initializeApp(firebaseConfig);
  
  // Initialize Firestore
  try {
    console.log("Initializing Firestore...");
    db = getFirestore(app);
    console.log("Firestore initialized successfully");
    
    // Enable offline persistence
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log("Firestore persistence enabled");
      })
      .catch((err) => {
        console.warn("Firestore persistence failed to enable:", err);
      });
  } catch (firestoreError) {
    console.error("Error initializing Firestore:", firestoreError);
  }
  
  // Initialize Analytics
  try {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized");
  } catch (analyticsError) {
    console.warn("Error initializing Analytics:", analyticsError);
  }
} catch (firebaseError) {
  console.error("Error initializing Firebase:", firebaseError);
}

export { db }; 