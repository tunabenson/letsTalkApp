import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {getFirestore,collection, initializeFirestore, CACHE_SIZE_UNLIMITED, getDoc, doc, query, limit, orderBy} from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {}


// Initialize Firebase
export const app = initializeApp(firebaseConfig);


export const auth= initializeAuth(app, {
  persistence:getReactNativePersistence(AsyncStorage)
})
export const storage= getStorage(app);




export const db= initializeFirestore(app, {cacheSizeBytes: CACHE_SIZE_UNLIMITED});

export const usersRef= collection(db, "users");

export const posts= collection(db, "posts");



export async function getComments({path}){
  const q= query(collection(db, path, "comments") ,limit(15));
}

const functions = getFunctions(app);
export async function deletePost(postId) {
  
  const deletePostFunction = httpsCallable(functions,'deletePost');
  try {
    const result = await deletePostFunction({ postId });
    console.log(result.data.message);
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}


export async function createPost(postData){
  const createPostFunction = httpsCallable(functions,'createPost');
  try {
    const result = await createPostFunction(postData);
    return result.data;
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}
