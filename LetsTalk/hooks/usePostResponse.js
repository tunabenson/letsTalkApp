// hooks/usePostCreation.js
import { useState, useCallback } from 'react';
import { createPost, auth } from '../api/firebaseConfig'

const usePostResponse = (navigation, url, replyingTo) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [usePoliticalAnalysis, setUsePoliticalAnalysis] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', message: '', confirmButton: 'OK', onConfirm: () => {} });
  const [article, setArticle]= useState();
  const handlePost = async () => {
    console.log(replyingTo.item)
    setIsPosting(true);
    if (!content.trim()) {
      setAlertData({
        title: 'Error',
        message: 'Please enter the content of your post.',
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
      usePoliticalAnalysis: usePoliticalAnalysis,
    };
    if (url) {
      post.article = article;
    }
    try {
      const response = await createPost({post, path:replyingTo.path?.concat('/replies')});
      setAlertData({
        title: response.header,
        message: response.message,
        confirmButton: 'OK',
        onConfirm: () => {
          if (response.header === 'Success') {
            navigation.goBack();
            setContent('');
          }
          setAlertVisible(false);
        }
      });
      setAlertVisible(true);
    } catch (error) {
      console.error('Error creating post:', error);
    }finally{
        setIsPosting(false);
    }
  };
  

  return {
    content,
    isPosting,
    usePoliticalAnalysis,
    alertVisible,
    alertData,
    article,
    setContent,
    setUsePoliticalAnalysis,
    handlePost,
    setArticle, 
  };
};

export default usePostResponse;
