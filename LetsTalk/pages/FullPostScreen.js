import { FontAwesome } from '@expo/vector-icons';
import React from 'react'
import { TouchableOpacity, View } from 'react-native';
import Post from '../components/Post';
import CommentList from '../components/CommentList';
export const FullPostScreen = ({ route, navigation }) => {
    const { item, fromAccount, liked, disliked } = route.params;

  
    return (
      <View className="flex-1 bg-lightblue-500 pt-5">
        <TouchableOpacity
          className="absolute top-5 left-2 mb-10 p-4"
          onPress={() => navigation.goBack()}
          hitSlop={15}
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