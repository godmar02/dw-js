const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAIKYE0kZAcB5AzAmuiNB37BFjoiO6AY6g",
  authDomain: "dungeon-world-45d46.firebaseapp.com",
  projectId: "dungeon-world-45d46",
  storageBucket: "dungeon-world-45d46.appspot.com",
  messagingSenderId: "226498870916",
  appId: "1:226498870916:web:7cbaa58a3a178f1afeccd1",
  measurementId: "G-YTPKF0BTK9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
