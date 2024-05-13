// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA_dkuP0X7XfkgDXyOGjYp-8_a0swpMXU",
  authDomain: "accre-397013.firebaseapp.com",
  projectId: "accre-397013",
  storageBucket: "accre-397013.appspot.com",
  messagingSenderId: "887876981346",
  appId: "1:887876981346:web:fc6022673bb296f8d5b73b",
  measurementId: "G-J1BKEX6HMK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);