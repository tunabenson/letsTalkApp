import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';

const RenderedArticle = ({ article }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openLink = () => {
    setModalVisible(true);
  };

  const closeLink = () => {
    setModalVisible(false);
  };

  return (
    <TouchableOpacity onPress={openLink} className="flex-row items-center bg-gray-200 p-2 rounded-lg mb-2">
      <Image source={{ uri: article?.imageUrl }} className="w-24 h-24 mr-2 rounded-md" />
      <Text className="flex-1 font-bold text-lg">{article?.title}</Text>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeLink}
      >
        <WebView source={{ uri: article?.link }} />
        <TouchableOpacity onPress={closeLink} className="items-center justify-center p-2 bg-red-500 mt-2">
          <Text className="text-white text-xl p-3">Close</Text>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};
export default RenderedArticle;
