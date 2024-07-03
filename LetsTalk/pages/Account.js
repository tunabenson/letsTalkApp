import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Pressable} from 'react-native';
import { collection, doc, getDoc, getDocs, limit, query } from 'firebase/firestore';
import { auth, db } from '../api/firebaseConfig';
import Post from '../components/Post';
import { signOut } from 'firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import {FullPostScreen} from'./FullPostScreen';
import { fetchPostData } from '../api/DocumentFetcher';




const Stack= createStackNavigator();
const Account = ({route, navigation}) => {
  const {username}=route.params;
  const [account, setAccount] = useState(null);
  const [posts, setPosts]= useState();
  const fetchAccount=async()=>{
    const userDoc= await getDoc(doc(db, "users", username));
    setAccount(userDoc.data());
  };

const fetchPost=async()=>{
  await fetchPostData({fetchBy: 'user', username: username, setPosts});
}


 

     useEffect(() => {
      fetchAccount();
      fetchPost();
    }, []);






  if(!account){
    return (
      <View className="flex-1 bg-lightblue-500 p-4"></View>
    )
  }

  
  return (
    <View className="flex-1 bg-lightblue-500 p-4">
      <View className="flex-row items-center mb-4">
        <Image className="w-24 h-24 mt-10  bg-slate-400 rounded-full border-4 border-white" source={account.url?{uri: account.url}:require('../assets/profile.png')} ></Image>
        <View className="flex-1 ml-4 mt-10 bg-white p-4 rounded-lg shadow-md">
          <Text className="text-lg font-bold mb-1">{username}</Text>
          <Text className="text-gray-700 mb-1">{account.bio}</Text>
          <Text className="text-gray-500">{new Date(account.joinDate.seconds * 1000).toLocaleDateString("en-US")}</Text>
          {username===auth.currentUser.displayName?(
          <Pressable
        className="bg-red-500 p-2 rounded-md mt-4 w-24"
        onPress={()=>signOut(auth)}
        >
        <Text className="text-white text-center">Sign Out</Text>
      </Pressable>
        ): null}   
        </View>
      </View>     
        <View className="flex-1 bg-lightblue-500 border-cyan-400 ">
          <Text className="text-white text-2xl mt-4 font-bold">Recent Posts</Text>
          <FlatList
            data={posts}
            renderItem={({item}) => {return(<Post item={item} fromAccount={true} navigation={navigation}/>)}}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
    </View>
  );


};

const ProfilePage=({route, navigation})=>{
  return(
  <View className="flex-1 bg-gray-100">
<Stack.Navigator  initialRouteName={'ProfilePage'}>
    <Stack.Screen name='ProfilePage' component={Account} initialParams={route.params} options={{headerShown:false}}/>
    <Stack.Screen name='Full-Post' component={FullPostScreen} initialParams={{fromAccount:true}} options={{headerShown:false}}/>
  </Stack.Navigator>
  </View>
  )
}

export default ProfilePage;

