import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native';
import Post from '../../components/posts/Post'
import CommentList from '../../components/posts/deprecated/CommentList';
import { retrievePost } from './FullPostHandler';
export const FullPostScreen = ({ route, navigation }) => {
    const data = route.params;
    useEffect(()=>{
      if(data?.id){
        retrievePost(id)
      }
    })

    return (
      <View className="flex-1 bg-lightblue-500 pt-10">
        <TouchableOpacity
          className="absolute top-9 left-2 mb-10 p-4"
          onPress={() => navigation.goBack()}
          hitSlop={30}
        >
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
  
        <View className="mt-10">
          <Post disabled={true} fullScreen={true} liked={liked} disliked={disliked} item={item} navigation={navigation} fromAccount={fromAccount} />
        </View>
        <CommentList  id={item.id} />
      </View>
    );
  };