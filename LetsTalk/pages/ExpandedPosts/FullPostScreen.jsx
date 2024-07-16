import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react'
import { _View, Animated, TouchableOpacity, View } from 'react-native';
import Post from '../../components/posts/Post'
import CommentList from '../../components/posts/deprecated/CommentList';
import { retrievePost } from './FullPostHandler';
import { SharedElement } from 'react-native-shared-element';
import { ScrollView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import CreatePost from '../tabs/Creations/CreatePost';
import PostResult from '../../components/results/PostResult';
const Stack= createStackNavigator();
export const FullPostScreen = ({ route, navigation }) => {


    const data = route.params;
    useEffect(()=>{
      async()=>{
      if(data?.id){
        await retrievePost(data?.id)
      }
    }
    })



const PostPage=()=>{
    const position = useRef(new Animated.Value(data?.yValue || 200)).current; // Starting at 0

    useEffect(() => {
      Animated.spring(position, {
        toValue: 20, // Adjust this value to control how far up it moves
        useNativeDriver: true
      }).start();
    }, []);
    


    return (
      <ScrollView className="flex-1 bg-lightblue-500 pt-10">
        <TouchableOpacity
          className="absolute top-0 left-2 mb-10 p-4"
          onPress={() => navigation.goBack()}
          hitSlop={30}
        >
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        
        <SharedElement id={`post.${data.item.id}`} className='mt-10 flex-1'>
  <Animated.View style={{ transform: [{ translateY: position }], flex:1 }}>
    <View className="mt-2 flex-1">
      <Post item={data.item} navigation={navigation} fullScreen={true} liked={data?.liked} disliked={data?.disliked}/>
      
    </View>
    
  </Animated.View>
</SharedElement>

        {/* <CommentList  id={data.item.id} /> */}
      </ScrollView>
    );
  };



  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen component={PostPage} name='fullpost'/>
      <Stack.Group screenOptions={{presentation:'modal'}}>
      <Stack.Screen children={()=>(<CreatePost replyingTo={<PostResult disabled={true} item={data.item}/>}/>)} name='reply-page' />
      </Stack.Group>
    </Stack.Navigator>
  )
};