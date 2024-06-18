import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Text, FlatList, RefreshControl, TouchableOpacity, Alert, Pressable} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ProfilePage from './Account';
import { app, auth, db } from '../api/firebaseConfig';
 import Post from '../components/Post';
import CreatePost from './CreatePost';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { TextInput } from 'react-native-gesture-handler';
import CommentList from '../components/Comment';
import CommentInput from '../components/CommentInput';
import { FullPostScreen } from './FullPostScreen';



const Stack = createStackNavigator();
const Tab= createBottomTabNavigator();

const posts=[];



const getRecommendedPosts=async()=>{
  //TODO create complex query to get posts from different interest forums
  const postQuery= query(collection(db, "posts"),orderBy("date",  'desc'), limit(15));
  const querySnapshot= await getDocs(postQuery);
  posts.length=0;
  querySnapshot.forEach((doc)=>{
    let newData= {...doc.data(), "id":doc.id}; //TODO weigh options with this function
    posts.push(newData);
  });
}



const Home = () => {
  // const [currentForum, setCurrentForum] = React.useState('Home');

  // useEffect(()=>{
  //   getRecommendedPosts().then(()=>console.log("done"));
  // },[]);

  useEffect(()=>{
    const resolved=async()=>{
      await getRecommendedPosts();
    }
    resolved();
  });
  return (
    <Tab.Navigator
      id='2'
      initialRouteName={"Home"}
      screenOptions={{ headerShown:false, tabBarShowLabel:false ,tabBarStyle:{borderCurve:'circular', bottom:'auto'}, tabBarActiveTintColor: '#4DFFF3', tabBarInactiveTintColor: '#1D1E2C'}}>

      <Tab.Screen name='Home' component={ForumPage} options={{ tabBarIcon:({focused})=>(<MaterialIcons name="home" size={24} color= {!focused?'#1D1E2C':'#4DFFF3'} />) }} />    
      <Tab.Screen name= 'Create Post' component={CreatePost}  options={{ tabBarIcon:({focused})=>(<AntDesign name="pluscircleo" size={24} color= {!focused?'#1D1E2C':'#4DFFF3'} />) }} listeners={{tabPress:(e)=>{
          if(!auth.currentUser.emailVerified){
            Alert.alert("Error", "Please Verify Email Before Making Posts");
            return e.preventDefault();
          }
      }}} /> 
      <Tab.Screen name='Account' component={ProfilePage} initialParams={{uid:auth.currentUser.uid, username: auth.currentUser.displayName}} options={{tabBarIcon:({focused})=>(<MaterialIcons name="account-circle" size={24} color= {!focused?'#1D1E2C':'#4DFFF3'} />) }} />
    </Tab.Navigator>
  );
};

const PostsScreen = ({ navigation }) => {

  const [refresh, setRefresh] = React.useState(false);


 
  const refreshHandler = () => {
    setRefresh(true);
    getRecommendedPosts().then(()=>setRefresh(false));
  };



  return (
    <SafeAreaView className="flex-1 bg-lightblue-500 p-5">
      <FlatList
        initialNumToRender={10}
        data={posts}
        onEndReachedThreshold={0.9}
        //onEndReached={()=>Alert.alert("you down there")} //TODO fetch more posts data from older posts
       // ListEmptyComponent={<Post item={{ user: 'No posts yet'}} />}
        renderItem={({ item }) => <Post  item={item} navigation={navigation}/>}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />}
      />
    </SafeAreaView>
  );
};






const ForumPage=()=>{

 return(
  <View className="flex-1 bg-gray-100">
    <Stack.Navigator initialRouteName={"Main"}>
      <Stack.Screen name="Main" component={PostsScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Post" component={FullPostScreen} options={{headerShown:false}}  />
      {/* <Stack.Screen name="Create Post" component={CreatePost} options={{headerShown:false}}/> */}
      <Stack.Screen name='Account' component={ProfilePage} options={{headerShown:false}}/>
    </Stack.Navigator>
</View>
 )
}

export default Home;
