const { initializeApp } = require("firebase/app");

require("dotenv").config();

const firebaseConfig = {
  apiKey: "AIzaSyCNOWMXxvV8jkAA7oa5-yW5yR4GozrW5FI",
  authDomain: "ecentials-82465.firebaseapp.com",
  projectId: "ecentials-82465",
  storageBucket: "ecentials-82465.appspot.com",
  messagingSenderId: "405312315660",
  appId: "1:405312315660:web:d7a13888f4c84a98eaa929",
  measurementId: "G-WHDQVR8Z7J",
};

const app = initializeApp(firebaseConfig);

module.exports = app;
