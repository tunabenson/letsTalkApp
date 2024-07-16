import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native';

function EmptyAttachment() {
    const [visible, setVisible]= useState(false);
  return (
    <TouchableOpacity onPress={()=>setVisible(true)} className="flex-row items-center bg-gray-200 p-2 rounded-lg mb-2">
    <View className="w-24 h-24 mr-2 rounded-md items-center justify-center">
        <MaterialIcons name="article" size={60} color="gray" />
    </View>
    <Text className="flex-1 font-bold text-lg">Article</Text>

    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={()=>setVisible(false)}
    >
    <Text className="text-center mt-20">Loading...</Text>
      <TouchableOpacity onPress={()=>setVisible(false)} className="items-center justify-center p-2 bg-red-500 mt-2">
        <Text className="text-white text-xl p-3">Close</Text>
      </TouchableOpacity>
    </Modal>
  </TouchableOpacity>
  )
}

export default EmptyAttachment;