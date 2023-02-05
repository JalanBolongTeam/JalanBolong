import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA1DXJ4IWaGGGhoFKOKxL7pCUp-BKKa2Yw",
    authDomain: "login-max-6ecb9.firebaseapp.com",
    projectId: "login-max-6ecb9",
    storageBucket: "login-max-6ecb9.appspot.com",
    messagingSenderId: "684244918902",
    appId: "1:684244918902:web:3ba3aa097e5aa9ef823557"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase };