import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import LoadingPage from "../LoadingPage";
import { FlatList, RefreshControl, View } from "react-native";
import { FullPostScreen } from "../ExpandedPosts/FullPostScreen";
import PostResult from "../../components/results/PostResult";
import CreatePost from "./Creations/CreatePost";
import ProfilePage from "./Account";
import useForumPosts from '../../hooks/useForumPosts'
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from '../../components/posts/Post';

const Stack= createStackNavigator();
const ForumPage = () => {
    const { posts, refreshing, fetchPosts} = useForumPosts();
    const PostsScreen = ({ navigation }) => {
      return (
        <SafeAreaView className="flex-1 bg-lightblue-500 ">
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <Post item={item} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} tintColor={'#ffff'}/>
            }
          />
        </SafeAreaView>
      );
    };
  
  if(!posts){
    return (
      <LoadingPage/>
    )
  }
  
   return(
    <View className="flex-1 bg-gray-100">
      <Stack.Navigator initialRouteName={"Main"}>
        <Stack.Screen name="Main" component={PostsScreen} options={{headerShown:false}} initialParams={{posts:posts}}/>
        <Stack.Screen
          name="Post"
          component={FullPostScreen}
          options={{
            headerShown: false,
            transitionSpec: {
              open: { animation: 'spring', config: { duration: 100} },
              close: { animation: 'timing', config: { duration: 100 } }
            },
      cardStyleInterpolator: ({ current: { progress } }) => {
        return {
          cardStyle: {
            opacity:progress
          }
        };
      }
    }}
    sharedElementsConfig={(route, otherRoute, showing) => {
      const { item } = route.params;
      return [{
        id: `post.${item.path}`,
        animation: 'move', 
        resize: 'clip', 
        align: 'left-top',
      }];
    }}
  
  />
      <Stack.Group screenOptions={{
          presentation: 'modal',
          headerShown:false,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 700,  // Increase the duration for slower animation
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 500,
              },
            },
          },
        }}>
          <Stack.Screen name="reply-page" children={({route}) => (
            <CreatePost replyingTo={route.params.item} />
          )} />
      </Stack.Group>
     <Stack.Screen name='Account' component={ProfilePage} options={{headerShown:false}}/>
      </Stack.Navigator>
  </View>
   )
};

export default ForumPage;