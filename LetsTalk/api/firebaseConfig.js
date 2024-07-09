import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {collection, initializeFirestore, CACHE_SIZE_UNLIMITED, getDoc, doc, query, limit, orderBy, getCountFromServer} from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {  getStorage } from "firebase/storage";
import algoliasearch from "algoliasearch";
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
export const app = initializeApp(firebaseConfig);


export const auth=initializeAuth(app, {persistence:getReactNativePersistence(AsyncStorage)})

export const storage= getStorage(app);

export const searchClient= algoliasearch('GQZGLJWQVJ','305db113298fb6ea6a615192fbf59ced');

export const defaultProfilePhoto= 'https://firebasestorage.googleapis.com/v0/b/letstalk-e7a23.appspot.com/o/profilepic%2Fprofilepics%2Fprofile_200x200.png?alt=media&token=e86f38eb-ddac-4e93-9423-9e65f580e36f'

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
    console.error('Error creating post:', error);
  }
}


export async function uploadImageForUser( base64Image){
  const uploadImageToUserFunction= httpsCallable(functions, 'resizeImage'); 
  try {
    const response= await uploadImageToUserFunction({image:base64Image});
    console.log(response.data);
  } catch (error) {
    console.error('Error resizing image:', error);
  }
}


export async function getArticleTitleFromURL(url){
  const getTitle= httpsCallable(functions, 'getArticleTitle'); 
  try {
    const response= await getTitle(url);
    const article= {...response.data, link:url }
    return article; 
  } catch (error) {
    console.error('Error fetching title:', error);
  }
}

export const fetchLikeDislikeCounts = async (postId) => {
  try {
    const collLikes = collection(db, 'posts', postId, 'likes');
    const collDislikes = collection(db, 'posts', postId, 'dislikes');
    const snapshotLikes = await getCountFromServer(collLikes);
    const snapshotDislikes = await getCountFromServer(collDislikes);
    const likes= snapshotLikes.data().count || 0;
    const dislikes= snapshotDislikes.data().count || 0;
    return { likes, dislikes };
  } catch (error) {
    console.error('Error fetching like/dislike counts:', error);
    return { likes: 0, dislikes: 0 };
  }
};



