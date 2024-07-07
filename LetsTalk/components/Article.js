import React, { useEffect, useState } from 'react';
import { Modal, Text, View, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { getArticleTitleFromURL } from '../api/firebaseConfig';

function Article(url) {
  const [modalVisible, setModalVisible] = useState(false);
  const [article, setArticle]= useState();

  useEffect(()=>{
    const getArticle=async()=>{
        const fetchedArticle= await getArticleTitleFromURL(url);
        setArticle(fetchedArticle);
    }
    getArticle();
  }, [] );


  return (
    <View className="flex-1">
      <TouchableOpacity
        className="p-4 bg-slate-400 rounded-lg shadow-md"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-xl font-bold mb-2">{article?.title}</Text>
        <Image
          className="w-full h-64 rounded-lg"
          source={{ uri: article?.imageUrl }}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 ">
          <TouchableOpacity
            className="p-4 bg-gray-300 h-20 "
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-black mt-6 ml-3 text-xl text-left">Close</Text>
          </TouchableOpacity>
          <WebView originWhitelist={['*']}
          allowUniversalAccessFromFileURLs={true} 
          source={{ uri: article?.link }} />
        </View>
      </Modal>
    </View>
  );
}

export default Article;
