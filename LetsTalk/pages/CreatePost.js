import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { Timestamp, addDoc, arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import { auth, createPost, db } from '../api/firebaseConfig';

const CreatePost = ({navigation}) => {
  const [forum, setForum] = useState('');
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting]= useState(false);
  const handlePost = async() => {
    setIsPosting(true);
    if (!forum.trim() || !content.trim()) {  
      Alert.alert('Error', 'Please enter both the forum name and the content.');
    } else {
      const user= auth.currentUser.displayName;
      const post={
        text: content,
        username: user, 
        forum:forum
      };
      const response=await createPost(post);
      Alert.alert(response.header, response.message);

      
      if(response.header==='Success'){
          navigation.goBack();
      }
      setForum('');  // Clear the forum input after posting
      setContent('');  // Clear the content input after posting
    }
    setIsPosting(false);
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
            onChangeText={(text) => setForum(text.replace(/ /g, '_'))}  // Remove spaces from forum name
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

       {!isPosting?( <TouchableOpacity
          className="bg-white p-4 rounded-lg items-center"
          onPress={handlePost}>
          <Text className="text-lightblue-500 font-bold">Post</Text>
        </TouchableOpacity>):(<ActivityIndicator size="small" color={'#ffffff'} />)}
      </View>
    </ScrollView>
  );
};

export default CreatePost;