import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, View, Pressable, Modal, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { Timestamp, getDoc, doc, setDoc, deleteDoc, collection, getCountFromServer, updateDoc } from 'firebase/firestore';
import { auth, db, deletePost } from '../api/firebaseConfig';
import CommentInput from './CommentInput';
import BiasBar from './BiasBar';
import Article from './Article';
import { navTo } from '../api/utils';
import PopupMenu from './PopupMenu';

const Post = (props) => {
  const [liked, setLiked] = useState( props?.liked|| false);
  const [disliked, setDisliked] = useState(props?.disliked|| false);
  const [numLikes, setNumLikes] = useState(props.item.likes);
  const [numDislikes, setNumDislikes] = useState(props.item.dislikes);
  const [modalVisible, setModalVisible] = useState(false);

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
        setNumLikes((prev) => prev - 1);
      }
      else {
        await setDoc(doc(db, 'posts', id, 'likes', auth.currentUser.displayName), { time: Timestamp.now() });
        setNumLikes((prev) => prev + 1);
      if (disliked) {
          await deleteDoc(doc(db, 'posts', id, 'dislikes', auth.currentUser.displayName));
          setDisliked(false);
          setNumDislikes((prev) => prev - 1);
      }
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  const toggleDislike = async () => {
    try {
      if (disliked) {
        await deleteDoc(doc(db, 'posts', id, 'dislikes', auth.currentUser.displayName));
        setNumDislikes((prev) => prev - 1);
      } else {
        await setDoc(doc(db, 'posts', id, 'dislikes', auth.currentUser.displayName), { time: Timestamp.now() });
        setNumDislikes((prev) => prev + 1);

        if (liked) {
          await deleteDoc(doc(db, 'posts', id, 'likes', auth.currentUser.displayName));
          setLiked(false);
          setNumLikes((prev) => prev - 1);
        }
      }
      setDisliked(!disliked);
    } catch (error) {
      console.error('Error toggling dislike status:', error);
    }
  };



  const { item, navigation, fromAccount} = props;
  const isPostOwner = auth.currentUser && item.username === auth.currentUser.displayName;


  return (
    <TouchableOpacity
      disabled={props?.disabled}
      className="m-2 p-4 bg-white border border-lightblue-500 rounded-lg shadow-lg"
      onPress={() => navigation.navigate(navTo(fromAccount), { item, liked, disliked })}
      activeOpacity={0.7}
    >
      {item.biasEvaluation && <BiasBar biasEvaluation={item.biasEvaluation} />}
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
     
   

        <View>
          <Text className="text-sm text-gray-500 self-end">
            {!props.fromSearching ? new Date(item?.date?.seconds * 1000).toLocaleDateString() : item.date.toLocaleDateString()}
          </Text>
          <View className="flex-row items-center mt-2">
            <TouchableOpacity hitSlop={25} onPress={toggleLike} className="flex-row items-center mr-3">
              <FontAwesome name="thumbs-up" size={20} color={liked ? '#4CAF50' : 'gray'} />
              <Text className={`ml-1 text-sm ${liked ? 'text-green-500' : 'text-gray-500'}`}>{numLikes}</Text>
            </TouchableOpacity>

            <TouchableOpacity hitSlop={25} onPress={toggleDislike} className="flex-row items-center">
              <FontAwesome name="thumbs-down" size={20} color={disliked ? '#F44336' : 'gray'} />
              <Text className={`ml-1 text-sm ${disliked ? 'text-red-500' : 'text-gray-500'}`}>{numDislikes}</Text>
            </TouchableOpacity>
          </View>

          <CommentInput itemPath={item.id} />
          {modalVisible &&(
            <PopupMenu  isUser={isPostOwner} text={item.text} modalVisible={true} postId={id} onClose={()=>setModalVisible(false)}/>)
          }


        </View>

    
    </TouchableOpacity>
  );
};

export default Post;
