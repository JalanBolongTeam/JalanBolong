// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1DXJ4IWaGGGhoFKOKxL7pCUp-BKKa2Yw",
  authDomain: "login-max-6ecb9.firebaseapp.com",
  projectId: "login-max-6ecb9",
  storageBucket: "login-max-6ecb9.appspot.com",
  messagingSenderId: "684244918902",
  appId: "1:684244918902:web:3ba3aa097e5aa9ef823557"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
