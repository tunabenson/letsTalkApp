import { useState, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../api/firebaseConfig';
import { updateLikesInFirebase, updateDislikesInFirebase } from '../api/DocumentFetcher';  // Adjust the path as necessary

const usePostInteraction = (initialLiked, initialDisliked, path) => {
  const [liked, setLiked] = useState(initialLiked);
  const [disliked, setDisliked] = useState(initialDisliked);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleLike = async () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
      if (disliked) { 
        toggleDislike();
      }
    try {
      updateLikesInFirebase({
        liked: newLikedStatus,
        path: path,
        displayName: auth.currentUser.displayName
      });
      
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  const toggleDislike = async () => {
    const newDislikedStatus = !disliked;
    setDisliked(newDislikedStatus);
    if (liked) {
      toggleLike();
    }
    try {
      updateDislikesInFirebase({
        disliked: newDislikedStatus,
        path:path,
        displayName: auth.currentUser.displayName
      });
     
    } catch (error) {
      console.error('Error toggling dislike status:', error);
    }
  };

  const fetchInitialData = useCallback(async () => {
    if (initialLiked === undefined || initialDisliked === undefined) {
      const likesRef = doc(db, path, 'likes', auth.currentUser.displayName);
      const dislikesRef = doc(db, path, 'dislikes', auth.currentUser.displayName);
      try {
        const [likeSnap, dislikeSnap] = await Promise.all([getDoc(likesRef), getDoc(dislikesRef)]);
        if (initialLiked === undefined) {
          setLiked(likeSnap.exists());
        }
        if (initialDisliked === undefined) {
          setDisliked(dislikeSnap.exists());
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }
  }, [path, initialLiked, initialDisliked]);

  return {
    liked,
    disliked,
    modalVisible,
    setModalVisible,
    toggleLike,
    toggleDislike,
    fetchInitialData,
  };
};

export default usePostInteraction;
