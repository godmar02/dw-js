// Require Firebase
const firebase = require("firebase");

// Required for side-effects
require("firebase/firestore");

// Initialise Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAIKYE0kZAcB5AzAmuiNB37BFjoiO6AY6g",
  authDomain: "dungeon-world-45d46.firebaseapp.com",
  projectId: "dungeon-world-45d46",
  storageBucket: "dungeon-world-45d46.appspot.com",
  messagingSenderId: "226498870916",
  appId: "1:226498870916:web:7cbaa58a3a178f1afeccd1",
  measurementId: "G-YTPKF0BTK9"
});

var db = firebase.firestore();
