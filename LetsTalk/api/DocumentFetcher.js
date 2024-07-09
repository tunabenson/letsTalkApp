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



export const fetchPostData=async(inputs)=>{
   
    const getRecommendedPosts = async () => {
        try {
          const postQuery = query(collection(db, "posts"), orderBy("date", 'desc'), limit(15));
          const querySnapshot = await getDocs(postQuery);
          const temp = [];
  
          for (const document of querySnapshot.docs) {
            
            const { likes, dislikes } = await fetchLikeDislikeCounts(document.id);
            const items = { ...document.data(), "id": document.id, "likes": likes, "dislikes": dislikes };
            temp.push(items);
          }
            return temp;
        } catch (error) {
          console.error('Error fetching recommended posts:', error);
        }
    };
    const getForumPosts=async()=>{}
     

    const getUserPosts=async()=>{
        try{
            const postsQuery = query(collection(db, "posts"), where('username', '==', inputs.username),  orderBy("date", 'desc'), limit(15));
            const snap = await getDocs(postsQuery);
            const temp=[];
            //TODO: 2 reads for 1 post, is it worth it?
            for (const document of snap.docs) {
                const { likes, dislikes } = await fetchLikeDislikeCounts(document.id);
                const postData = { ...document.data(), id: document.id, likes, dislikes};
                console.log(temp); 
                temp.push(postData);
            };
            console.log(temp);
            return temp;
            }catch(error){
              console.log(error);
            } 
    }

    const method=inputs.fetchBy;
    switch(method){
        case 'recommended': 
            const recPosts= await getRecommendedPosts();
            if(inputs?.returnType==='array')return recPosts;
            else inputs.setPosts(recPosts);
            break;
        case 'user':
            const userPosts= await getUserPosts();
            console.log('after call', userPosts);
            if(inputs?.returnType==='array')return userPosts;
            else inputs.setPosts(userPosts);
            break;
        case 'forum':
             break;
    }



};


  // Update likes in Firebase
  export const updateLikesInFirebase = async ({ liked, id, displayName }) => {
    try {
      const likeRef = doc(db, 'posts', id, 'likes', displayName);
      const parentDocRef = doc(db, 'posts', id);
  
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
  export const updateDislikesInFirebase = async ({ disliked, id, displayName }) => {
    try {
      const dislikeRef = doc(db, 'posts', id, 'dislikes', displayName);
      const parentDocRef = doc(db, 'posts', id);
  
      if (disliked) {
        await setDoc(dislikeRef, { time: Timestamp.now() });
      } else {
        await deleteDoc(dislikeRef);
      }
    } catch (error) {
      console.error('Error updating dislike status in Firebase:', error);
    }
  };