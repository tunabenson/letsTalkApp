import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import {getFirestore,collection, initializeFirestore, CACHE_SIZE_UNLIMITED} from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth= initializeAuth(app, {
  persistence:getReactNativePersistence(AsyncStorage)
})
export const storage= getStorage(app);



export const db= initializeFirestore(app, {cacheSizeBytes: CACHE_SIZE_UNLIMITED});

export const usersRef= collection(db, "users");

export const posts= collection(db, "posts")

