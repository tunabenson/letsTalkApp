import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, View, Pressable, Modal, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { Timestamp, getDoc, doc, setDoc, deleteDoc, collection, getCountFromServer, updateDoc } from 'firebase/firestore';
import { auth, db, deletePost } from '../../api/firebaseConfig';
import CommentInput from './deprecated/CommentInput';
import BiasBar from './subcomponents/BiasBar';
import Article from './subcomponents/Article';
import { navTo } from '../../api/utils';
import PopupMenu from './subcomponents/popupMenu/PopupMenu';
import Interaction from './subcomponents/Interaction';
import RenderedArticle from './subcomponents/RenderedArticle';
import Reply from './subcomponents/Reply';

const Post = (props) => {
  const [liked, setLiked] = useState( props?.liked);
  const [disliked, setDisliked] = useState(props?.disliked);
  const [modalVisible, setModalVisible] = useState(false);
  let yValue;
  const id = props.item.id;

  const getDislikedStatus = useCallback(async () => {
    try {
      const docSnapshot = await getDoc(doc(db, 'posts', id, 'dislikes', auth.currentUser.displayName));
      return docSnapshot.exists();
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }, [id]);

  const getLikedStatus = useCallback(async () => {
    try {
      const docSnapshot = await getDoc(doc(db, 'posts', id, 'likes', auth.currentUser.displayName));
      return docSnapshot.exists();
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }, [id]);


  const fetchInitialData = useCallback(async () => {
    try {
      let likedStatus;
      let dislikedStatus;
      if(props?.liked===undefined){
       likedStatus = await getLikedStatus();
       setLiked(likedStatus);
      }
      if(props?.disliked===undefined){
       dislikedStatus = await getDislikedStatus();
       setDisliked(dislikedStatus);
      }


    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }, [getLikedStatus, getDislikedStatus]);

  useEffect(() => {
     if(!props?.fullScreen){
    fetchInitialData();
    }
    else{
      setDisliked(props.disliked);
      setLiked(props.liked);
    }
  }, []);

    const toggleLike = async () => {
    try {
      if (liked) {
        await deleteDoc(doc(db, 'posts', id, 'likes', auth.currentUser.displayName));
      }
      else {
        await setDoc(doc(db, 'posts', id, 'likes', auth.currentUser.displayName), { time: Timestamp.now() });
      if (disliked) {
          await deleteDoc(doc(db, 'posts', id, 'dislikes', auth.currentUser.displayName));
          setDisliked(false);
      }
      setLiked(!liked);
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  const toggleDislike = async () => {
    try {
      if (disliked) {
        await deleteDoc(doc(db, 'posts', id, 'dislikes', auth.currentUser.displayName));
      } else {
        await setDoc(doc(db, 'posts', id, 'dislikes', auth.currentUser.displayName), { time: Timestamp.now() });
        if (liked) {
          await deleteDoc(doc(db, 'posts', id, 'likes', auth.currentUser.displayName));
          setLiked(false);
        }
        setDisliked(!disliked);

      }
    } catch (error) {
      console.error('Error toggling dislike status:', error);
    }
  };






  const { item, navigation, fromAccount} = props;
  const isPostOwner = auth.currentUser && item.username === auth.currentUser.displayName;



  const requestHandler=()=>{
    const author=item.username;
    const editDate= item?.lastEdited || item?.date;
    return {author, editDate}
  }

  return (
    <TouchableOpacity
      disabled={props?.fullScreen}
      className="m-2 p-4 bg-white border border-lightblue-500 rounded-lg shadow-lg"
      onPress={(event) => {
         if(!props?.fullScreen){ 
          navigation.navigate(navTo(fromAccount), { item, liked, disliked, yValue:event.nativeEvent.pageY-50 });
      }
    }
    }
      activeOpacity={0.7}
    >
    

      <View className="absolute top-2 right-3 flex-row items-center">
        <TouchableOpacity hitSlop={30} onPress={() => {setModalVisible(true)}}>
          <Entypo name="dots-three-horizontal" size={24} color="gray" />
        </TouchableOpacity>
      </View>



      {!fromAccount && (
        <View className="flex-shrink-0">
          <Pressable
            hitSlop={15}
            className="w-48"
            onPress={() => navigation.navigate('Account', {username: item.username })}
          >
            <Text className="text-lg font-semibold text-amber-700">@{item.username}</Text>
          </Pressable>
        </View>
      )}

      <Text className="absolute top-3 right-11 text-base font-bold text-black">#{item?.forum}</Text>
      <Text className="text-base text-gray-800 pb-2 mt-5">{item?.text}</Text>

      {item?.article && props?.fullScreen && (
            <RenderedArticle article={item.article}/>
          )}


        <>
          <Text className="text-sm text-gray-500 self-end">
            {new Date(item?.date?.seconds * 1000).toLocaleDateString()}
          </Text>
          {item?.biasEvaluation && (
        <BiasBar biasEvaluation={item.biasEvaluation}  style="align-bottom  mt-3 mb-3 flex-row h-3 rounded-sm overflow-hidden border border-black w-1/3 "/>
        )}

          <>
          <Interaction toggleLike={()=>toggleLike()} toggleDislike={()=>toggleDislike()} liked={liked} disliked={disliked} />

      

         {props?.fullScreen && ( <Reply item={item}/>)}
        </>

          {modalVisible &&(
            <PopupMenu  isUser={isPostOwner} text={item.text} modalVisible={true} postId={id} onClose={()=>setModalVisible(false)} requestInfo={()=>requestHandler()}/>)
          }
        



        </>


    
    </TouchableOpacity>
  );
};

export default Post;
