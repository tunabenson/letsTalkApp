import { initializeApp } from "react-native-firebase/app";
import { getAuth}from '@react-native-firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClM0A71FzMh5hnxVoa0Meu2FUP2rF14BY",
  authDomain: "letstalk-e7a23.firebaseapp.com",
  projectId: "letstalk-e7a23",
  storageBucket: "letstalk-e7a23.appspot.com",
  messagingSenderId: "778362832452",
  appId: "1:778362832452:web:5e268785fd76e242ff1e11",
  measurementId: "G-3QB3TRV9H0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);

export {app, auth};