import React from 'react';
import {  Text, Image, TouchableOpacity, View } from 'react-native';

const UserResult = ({ user, navigation}) => {
  return (
    <View>
    <TouchableOpacity  className="flex-row items-center p-2 border-b border-gray-300"  onPress={()=>navigation.navigate('accountPage', {username:user.id})}>
      <Image
        source={{ uri: user.url }}
        className="w-10 h-10 rounded-full"
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <Text className="ml-4 text-lg font-semibold text-black">@{user.id}</Text>
    </TouchableOpacity>
    </View>
  );
};

export default UserResult;
