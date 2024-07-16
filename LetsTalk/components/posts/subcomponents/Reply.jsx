import React, { useState } from 'react';
import { Modal, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import CreatePost from '../../../pages/tabs/Creations/CreatePost';
import PostResult from '../../results/PostResult';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


const Stack= createStackNavigator();
function Reply({item}) {
  const [modalVisible, setModalVisible] = useState(false);
  const nav= useNavigation();
    return (
    <>
      <TouchableOpacity
        className="flex-row items-center p-2 bg-gray-200 rounded-lg shadow-md"
        onPress={() => {nav.navigate('reply-page')}}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <View className="flex-row items-center">
          <FontAwesome name="reply" size={24} color="black" />
          <Text className="ml-2 text-lg font-bold">Reply</Text>
        </View>
      </TouchableOpacity>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 justify-end">
          <View className="h-1/2 bg-slate-400 rounded-t-lg p-1 ">
            <CreatePost replyingTo={<PostResult disabled={true} item={item}/>}/>
            <TouchableOpacity
              className="absolute top-3 right-3"
              onPress={() => setModalVisible(false)}
            >
              <FontAwesome name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </>
  );


}

export default Reply;
