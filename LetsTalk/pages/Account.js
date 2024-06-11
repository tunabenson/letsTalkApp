import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../api/firebaseConfig';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../api/firebaseConfig";

const ProfilePage = ({user}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingImage, setIsLoadingImage]= useState(true);
  

  const fetchAccount=async({username})=>{
    const docSnap= await getDoc(doc(db, "users", auth.currentUser.uid));
    if(docSnap.exists()){
      console.log(docSnap.data)
    }
  }


    
  const getURL=async({imagePath})=>{
     // Reference to the image file in Firebase Storage
     const imageRef = ref(storage, imagePath);
      
     // Fetch the download URL
        await getDownloadURL(imageRef)
       .then((url) => {
         setImageUrl(url);
       })
       .catch((error) => {
         console.error("Error fetching image URL: ", error);
       });
  }
  const ProfileImage = ({ imagePath }) => {
    
  
     useEffect(() => {
     getURL(imagePath).then(r => setIsLoadingImage(false));
    }, [imagePath]);

    if (imageUrl){
      return (<Image className="w-24 h-24 mt-10  bg-slate-400 rounded-full border-4 border-white" source={{uri: imageUrl}} ></Image>);
    }
    return (
      <Image className="w-24 h-24 mt-10 rounded-full border-4 border-white" source={require( '../assets/profile.png')}></Image>    );
  }
  

  const [posts, setPosts] = useState([
    { id: '1', user: "test" ,content: 'This is the first post', date: new Date().toLocaleDateString() },
    { id: '2', user: "test",content: 'Another post by the user', date: new Date().toLocaleDateString() },
    { id: '3',user: "test", content: 'Yet another interesting post', date: new Date().toLocaleDateString() },
    { id: '4', user: "test",content: 'Yet another interesting post', date: new Date().toLocaleDateString() },
    { id: '5',user: "test", content: 'Yet another interesting post', date: new Date().toLocaleDateString() },
    { id: '6',user: "test", content: 'Yet another interesting post', date: new Date().toLocaleDateString() },
    { id: '7',user: "test", content: 'Yet another interesting post', date: new Date().toLocaleDateString() },
    { id: '8', user: "test",content: 'Yet another interesting post', date: new Date().toLocaleDateString() },
  ]);

  const [achievements, setAchievements] = useState([
    { id: '1', achievement: 'Achievement 1' },
    { id: '2', achievement: 'Achievement 2' },
    { id: '3', achievement: 'Achievement 3' },
    // Add more achievements as needed
  ]);





  const MiniPost = ({ post }) => (
    <View className="m-2 p-4 bg-white rounded-lg shadow-lg">
      <Text className="text-base text-gray-800 mb-2">{post.content}</Text>
      <Text className="text-sm text-gray-500 self-end">{post.date}</Text>
    </View>
  );



  

  
  
  return (
    <View className="flex-1 bg-lightblue-500 p-4">
      <View className="flex-row items-center mb-4">
        <ProfileImage imagePath={'profilepic/'.concat(auth.currentUser.uid).concat('.jpg')} ></ProfileImage>
        <View className="flex-1 ml-4 mt-10 bg-white p-4 rounded-lg shadow-md">
          <Text className="text-lg font-bold mb-1">{auth.currentUser.displayName}</Text>
          <Text className="text-gray-700 mb-1">random shit for now</Text>
          <Text className="text-gray-500">{auth.currentUser.joinDate}</Text>
        </View>
      </View>

      <View contentContainerStyle={{ flexDirection: 'row' }}>
        <View className="flex-1 bg-lightblue-500 border-cyan-400 ">
          <Text className="text-white text-xl mb-2">Recent Posts</Text>
          <FlatList
            data={posts}
            renderItem={({ item }) => <MiniPost post={item} />}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
          />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-white text-xl mb-2">Achievements</Text>
          {achievements.map((item) => (
            <View key={item.id} className="mb-2 p-4 bg-white rounded-lg shadow-lg">
              <Text className="text-gray-800">{item.achievement}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );


};

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


