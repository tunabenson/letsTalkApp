// hooks/usePostCreation.js
import { useState, useCallback } from 'react';
import { createPost, auth } from '../api/firebaseConfig'

const usePostCreation = (navigation, url, replyingTo) => {
  const [forum, setForum] = useState('');
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [usePoliticalAnalysis, setUsePoliticalAnalysis] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', message: '', confirmButton: 'OK', onConfirm: () => {} });
  const [article, setArticle]=useState();

  const handlePost = async () => {
    setIsPosting(true);
    if (!forum.trim() || !content.trim()) {
      setAlertData({
        title: 'Error',
        message: 'Please enter both the forum name and the content.',
        confirmButton: 'OK',
        onConfirm: () => setAlertVisible(false)
      });
      setAlertVisible(true);
      setIsPosting(false);
      return;
    }

    const user = auth.currentUser.displayName;
    const post = {
      text: content,
      username: user,
      forum: forum,
      usePoliticalAnalysis: usePoliticalAnalysis,
    };
    if (url) {
      post.article = article;
    }
    try {
      const response = await createPost({post, path:'posts'});
      setAlertData({
        title: response.header,
        message: response.message,
        confirmButton: 'OK',
        onConfirm: () => {
          if (response.header === 'Success') {
            navigation.goBack();
            setForum('');
            setContent('');
          }
          setAlertVisible(false);
        }
      });
      setAlertVisible(true);
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setIsPosting(false);
  };
  

  return {
    forum,
    content,
    isPosting,
    usePoliticalAnalysis,
    alertVisible,
    alertData,
    article,
    setForum,
    setContent,
    setUsePoliticalAnalysis,
    handlePost,
    setArticle,
  };
};

export default usePostCreation;
