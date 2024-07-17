// hooks/useForumPosts.js
import { useState, useEffect } from 'react';
import { db } from '../api/firebaseConfig';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

const useForumPosts = () => {
  const [posts, setPosts] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const fetchPosts = async () => {
    setRefreshing(true);
    try {
      const postQuery = query(collection(db, "posts"), orderBy("date", 'desc'), limit(10));
      const querySnapshot = await getDocs(postQuery);
      const fetchedPosts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, path: doc.ref.path}));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching recommended posts:', error);
    } finally {
      setTimeout(()=>setRefreshing(false), 1000)
    }
  };



   const fetchMorePosts = async () => {
    if (!lastVisible) return;

    try {
      const moreQuery = query(collection(db, "posts"), orderBy("date", 'desc'), startAfter(lastVisible), limit(10));
      const querySnapshot = await getDocs(moreQuery);
      const fetchedPosts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, path: doc.ref.path}));
      setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching more posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, refreshing, fetchPosts, fetchMorePosts };
};

export default useForumPosts;
