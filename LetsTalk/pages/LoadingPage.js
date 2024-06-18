import React from 'react';
import { View, Text, Image } from 'react-native';

const LoadUpScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-lightblue-500">
      {/* Logo or loading image */}
      <Image
        source={{ uri: 'https://t3.ftcdn.net/jpg/00/62/78/62/360_F_62786254_cxVz7e28OMBn63qGzDFEBqHv7e1o2HgU.jpg' }} 
        className="w-24 h-24 mb-8"
      />
      {/* Loading message */}
      <Text className="text-white text-2xl font-semibold">Loading...</Text>
    </View>
  );
};

export default LoadUpScreen;