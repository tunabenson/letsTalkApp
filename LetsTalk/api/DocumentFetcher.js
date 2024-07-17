import { Timestamp, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, setDoc, where } from "firebase/firestore";
import {  db } from "./firebaseConfig";


export const fetchForumData=async()=>{
   
    const fetchForums = async () => {
        try {
          const forumsCollection = collection(db, 'forums'); // 'forums' is your collection name in Firestore
          const forumSnapshot = await getDocs(forumsCollection);
          const forumList = forumSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          return forumList;
        } catch (error) {
          console.error("Error fetching forums:", error);
          return [];
        }
      };
      const forumList= await fetchForums();
      return forumList;
}


  // Update likes in Firebase
  export const updateLikesInFirebase = async ({ liked, path, displayName }) => {
    try {
      const likeRef = doc(db, path, 'likes', displayName);  
      if (liked) {
        await setDoc(likeRef, {time: Timestamp.now()});   
      } else {
        await deleteDoc(likeRef);
      }
    } catch (error) {
      console.error('Error updating like status in Firebase:', error);
    }
  };
  //update dislikes in Firebase
  //TODO, make accessible to
  export const updateDislikesInFirebase = async ({ disliked, path, displayName }) => {
    try {
      const dislikeRef = doc(db, path, 'dislikes', displayName);
  
      if (disliked) {
        await setDoc(dislikeRef, { time: Timestamp.now() });
      } else {
        await deleteDoc(dislikeRef);
      }
    } catch (error) {
      console.error('Error updating dislike status in Firebase:', error);
    }
  };