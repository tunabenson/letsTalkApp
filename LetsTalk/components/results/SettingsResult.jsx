import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

function SettingsResult({ name, component, icon }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setIsFocused(true)}
      className="flex-row items-center p-4 bg-white rounded-lg shadow-md my-2 mx-4"
    >
      <View className="mr-4">
        {icon ? icon : <FontAwesome name="cog" size={24} color="black" />}
      </View>
      <Text className="text-lg font-semibold text-gray-700">{name}</Text>

      {isFocused && (
        <Modal
          visible={isFocused}
          animationType="slide"
          onRequestClose={() => setIsFocused(false)}
        >
          <TouchableOpacity
          className="p-4 bg-gray-300 h-20 "
          onPress={() => setModalVisible(false)}
        >
          <Text className="text-black mt-6 ml-3 text-xl text-left">Close</Text>
        </TouchableOpacity>
          <View className="flex-1 bg-gray-100 p-4">
            {component}
          </View>
        </Modal>
      )}
    </TouchableOpacity>
  );
}

export default SettingsResult;
