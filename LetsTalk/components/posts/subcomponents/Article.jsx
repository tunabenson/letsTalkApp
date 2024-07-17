import React, { useEffect, useRef, useState } from 'react';
import { Modal, Text, View, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { getArticleTitleFromURL } from '../../../api/firebaseConfig';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import RenderedArticle from './RenderedArticle';
import EmptyAttachment from '../../utility/EmptyAttachment';
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
      {article ?(<RenderedArticle article={article}/>):(<EmptyAttachment/>)}
    </View>
  );
}

export default Article;
