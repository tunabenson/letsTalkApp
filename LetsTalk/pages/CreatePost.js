import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Timestamp, addDoc, arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../api/firebaseConfig';

const CreatePost = ({navigation}) => {
  const [forum, setForum] = useState('');
  const [content, setContent] = useState('');

  const handlePost = async() => {
    if (!forum.trim() || !content.trim()) {  
      Alert.alert('Error', 'Please enter both the forum name and the content.');
    } else {
      Alert.alert('Success', `Posted to ${forum}`);

      navigation.goBack();
      const date= Timestamp.now();
      await addDoc(collection(db, "posts"),{
        text: content,
        username: auth.currentUser.displayName, 
        uid:auth.currentUser.uid,
        date: Timestamp.now(),
        forum:forum
   
      // }).then((docRef)=>{
      //   const name= docRef.id;
      //   setDoc(doc(db, "users" ,auth.currentUser.uid, "posts", name ), {
      //     date: date
      //   });
      //   setDoc(doc(db, "forums", forum, "posts", name),{
      //     date:date
      //   });
      });
      setForum('');  // Clear the forum input after posting
      setContent('');  // Clear the content input after posting
    }
  };

  return (
    <ScrollView className="flex-1 bg-lightblue-500 p-4 ">
      <View className="mb-4 mt-10">
        <Text className="text-white text-2xl font-semibold mb-6">Create a Post</Text>

        <View className="bg-white p-4 rounded-lg mb-4">
          <TextInput
            className="text-black"
            placeholder="Forum Name"
            value={forum}
            hitSlop={20}
            onChangeText={(text) => setForum(text.replace(/ /g, ''))}  // Remove spaces from forum name
          />
        </View>

        <View className="bg-white p-4 rounded-lg mb-4">
          <TextInput
            className="text-black h-32"
            placeholder="Write your content here..."
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={(text) => setContent(text)}
            blurOnSubmit={true}
          />
        </View>

        <TouchableOpacity
          className="bg-white p-4 rounded-lg items-center"
          onPress={handlePost}>
          <Text className="text-lightblue-500 font-bold">Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreatePost;