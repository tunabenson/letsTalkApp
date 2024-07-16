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
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


export const auth=initializeAuth(app, {persistence:getReactNativePersistence(AsyncStorage)})

export const storage= getStorage(app);

export const searchClient= algoliasearch();

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


export async function createPost(postData, path){
  const createPostFunction = httpsCallable(functions,'createPost');
  try {
    const result = await createPostFunction(postData, path);
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
    return {...response.data, link:url }
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



