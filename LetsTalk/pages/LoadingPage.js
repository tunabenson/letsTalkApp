import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchPostData } from '../api/DocumentFetcher'; // Ensure the path is correct
import { SplashScreen } from 'expo-router';

const LoadUpScreen = ({ route }) => {
  //const { signedIn, setIsLoadingData, isLoadingAuth} = route.params;
  const navigation = useNavigation();
  

  useEffect(()=>{
    
  })


  return (
    <View className="flex-1 justify-center items-center bg-lightblue-500">
      <Image
        source={{ uri: 'https://t3.ftcdn.net/jpg/00/62/78/62/360_F_62786254_cxVz7e28OMBn63qGzDFEBqHv7e1o2HgU.jpg' }} 
        className="w-24 h-24 mb-8"
      />
      <Text className="text-white text-2xl font-semibold">Loading...</Text>
    </View>
  );
};

export default LoadUpScreen;
