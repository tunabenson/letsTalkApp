import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Pressable} from 'react-native';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { auth, db } from '../api/firebaseConfig';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../api/firebaseConfig";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Post from '../components/Post';
import { signOut } from 'firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import {FullPostScreen} from'./FullPostScreen';



var posts= [];
const Stack= createStackNavigator();
const Account = ({route, navigation}) => {
  const { uid , username}=route.params;
  const [account, setAccount] = useState(null);
  
  const fetchAccount=async()=>{
    const userDoc= await getDoc(doc(db, "users", uid));
    setAccount(userDoc.data());

  };

const fetchPost=async()=>{
  const postsQuery = query(collection(db, "posts"), where("username", '==', username), limit(10)); //TODO change to read from user collection?
  const snap = await getDocs(postsQuery);
   posts.length=0;
  snap.forEach((doc) => {
    let newData= {...doc.data(), "id":doc.id};
    posts.push(newData);
  });
}


 

     useEffect(() => {
      fetchAccount();
      fetchPost();
    }, [username,uid ]);






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
          <Text className="text-lg font-bold mb-1">{account.username}</Text>
          <Text className="text-gray-700 mb-1">{account.bio}</Text>
          <Text className="text-gray-500">{new Date(account.joinDate.seconds * 1000).toLocaleDateString("en-US")}</Text>
          {account.username===auth.currentUser.displayName?(
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
// const  ProfileImage=()=>{
      
//   getDownloadURL(ref(storage, 'profilepics/'.concat(auth.currentUser.uid).concat('.jpg')))
// .then((url) => {
//   if(url){
//     console.log(url);
//     //return setLink(url);
//   }
//   //return setLink(link);
// })
// .catch((error) => {
//   // A full list of error codes is available at
//   // https://firebase.google.com/docs/storage/web/handle-errors
//   switch (error.code) {
//     case 'storage/object-not-found':
//       // File doesn't exist
//       break;
//     case 'storage/unauthorized':
//       // User doesn't have permission to access the object
//       break;
//     case 'storage/canceled':
//       // User canceled the upload
//       break;

//     // ...

//     case 'storage/unknown':
//       // Unknown error occurred, inspect the server response
//       break;
//   }
// });
// }


