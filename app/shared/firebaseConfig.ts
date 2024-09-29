// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEOy8jMqQ4mwv09dDpZdjTwpjMQlZ1Tiw",
  authDomain: "pinterest-clone-d2749.firebaseapp.com",
  projectId: "pinterest-clone-d2749",
  storageBucket: "pinterest-clone-d2749.appspot.com",
  messagingSenderId: "661204077020",
  appId: "1:661204077020:web:acbbea45fe85aa58a76719",
  measurementId: "G-MSR8ZLXPLF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
