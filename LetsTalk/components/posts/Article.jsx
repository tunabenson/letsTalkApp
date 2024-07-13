import React, { useEffect, useRef, useState } from 'react';
import { Modal, Text, View, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { getArticleTitleFromURL } from '../../api/firebaseConfig';
import { AntDesign } from '@expo/vector-icons';
function Article({url, onArticleFetch}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [article, setArticle] = useState();
  const webViewRef=useRef(null);
  useEffect(()=>{
    const getArticle=async()=>{
        const fetchedArticle= await getArticleTitleFromURL({url});
        const temp={...fetchedArticle, link: url};
        setArticle(temp)
        if (onArticleFetch) {
            onArticleFetch(article);
          } 
    }
    getArticle();       
    
        
    },[] );


  return (
    <View className="flex-1">
    <TouchableOpacity
      className="p-4 bg-slate-400 rounded-lg shadow-md"
      onPress={() => setModalVisible(true)}
    >
      {article?.imageUrl ? (
        <Text className="text-xl font-bold mb-2">{article.title}</Text>
      ) : (
        <Text className="text-xl font-bold mb-2">No title available</Text>
      )}
      {article?.link ? (
        <Image
          className="w-full h-64 rounded-lg"
          source={{ uri: article.imageUrl }}
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-64 rounded-lg bg-gray-200">
          <Text className="text-center mt-24">No image available</Text>
        </View>
      )}
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
        {article?.link ? (
          <WebView 
            ref={webViewRef}
            originWhitelist={['*']}
            allowUniversalAccessFromFileURLs={true} 
            source={{ uri: article.link }} 
          />
        ) : (
          <Text className="text-center mt-20">No article link provided.</Text>
        )}
      </View>
    </Modal>
  </View>
  
  );
}

export default Article;
