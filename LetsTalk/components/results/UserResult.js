import React from 'react';
import {  Text, Image, TouchableOpacity, View } from 'react-native';
import { defaultProfilePhoto } from '../../api/firebaseConfig';

const UserResult = ({ user, navigation}) => {
  return (
    <View>
    <TouchableOpacity  className="flex-row items-center p-2 border-b border-gray-300"  onPress={()=>navigation.navigate('accountPage', {username:user.username})}>
      <Image
        source={user.url!==' '?{ uri: user.url }:{uri: defaultProfilePhoto}}
        className="w-10 h-10 rounded-full"
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <Text className="ml-4 text-lg font-semibold text-black">@{user.username}</Text>
    </TouchableOpacity>
    </View>
  );
};

export default UserResult;
