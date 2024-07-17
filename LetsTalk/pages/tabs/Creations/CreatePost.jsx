import React, {  useLayoutEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Pressable } from 'react-native';
import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import Article from '../../../components/posts/subcomponents/Article';
import { auth, createPost } from '../../../api/firebaseConfig';
import { ScrollView, Switch, TextInput } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import usePostCreation from '../../../hooks/usePostCreation';
import usePostResponse from '../../../hooks/usePostResponse';
import PostResult from '../../../components/results/PostResult';


const usePostHandler = (navigation, url, replyingTo) => {
  if (replyingTo) {
    return usePostResponse(navigation, url, replyingTo);
  } else {
    return usePostCreation(navigation, url);
  }
};



const CreatePost = ({  route, replyingTo }) => {
  
  const PostCreationPage = ({ navigation, route }) => {
    const {url}= route.params; 

    const handler = usePostHandler(navigation, url, replyingTo);
  
   

    return (
      <ScrollView className="flex-1 bg-lightblue-500 p-4">
      <View className="mb-4 mt-6">
        {!replyingTo ?(<><Text className="text-white text-2xl font-semibold mb-6">{'Create a Post'}</Text>
        <View className="bg-white p-4 rounded-2xl mb-4">
          <TextInput
            className="text-black"
            placeholder="Forum Name"
            value={handler.forum}
            hitSlop={20}
            onChangeText={(text) => handler.setForum(text.replace(/ /g, '_').toLowerCase())} // Remove spaces from forum name
            />
         
        </View></>):(<>
        <Pressable hitSlop={20} onPress={()=>navigation.goBack()} className='mb-3'>
          <FontAwesome name='arrow-left' size={20} color={'white'}/>
        </Pressable>
        <View className='pb-10'>
          <PostResult disabled={true} item={replyingTo} />
        </View>
            <View className="w-px bg-gray-400 h-56 absolute left-2 top-20 " /> 
                </> )}
        <KeyboardAvoidingView className="bg-white p-4 rounded-2xl mb-4">
          <TextInput
            className="text-black h-32"
            placeholder="Write your content here..."
            multiline
            numberOfLines={4}
            value={handler.content}
            onChangeText={(text) => handler.setContent(text)}
            blurOnSubmit={true}
          />
        </KeyboardAvoidingView>

        {url ? (
          <View className="rounded-2xl flex-row mb-3">
            <Article url={url} onArticleFetch={(data)=>{handler.setArticle(data)}} />
          </View>
        ) : null}

        <View className="flex-row justify-start mb-4">
          <TouchableOpacity>
            <AntDesign name="link" size={24} color="white" style={{ marginLeft: 10, marginRight: 20 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('WebViewScreen')}>
            <Entypo name="browser" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white">Use Political Analysis</Text>
          <Switch
            value={handler.usePoliticalAnalysis}
            onValueChange={(value) => handler.setUsePoliticalAnalysis(value)}
          />
        </View>

        {!handler.isPosting ? (
          <TouchableOpacity className="bg-white p-4 rounded-lg items-center" onPress={handler.handlePost}>
            <Text className="text-lightblue-500 font-bold">Post</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size="small" color="#ffffff" />
        )}
      </View>
      <AwesomeAlert
        show={handler.alertVisible}
        showProgress={false}
        title={handler.alertData.title}
        message={handler.alertData.message}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText={handler.alertData.confirmButton}
        confirmButtonColor="#DD6B55"
        onConfirmPressed={handler.alertData.onConfirm}
      />
    </ScrollView>
    );
  };
  

  const WebViewScreen = ({ navigation }) => {
    const webViewRef = useRef(null);
    let url='';
    useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            className=" ml-5 mb-2 bg-lightblue-500 p-2 rounded-2xl flex-row"
            onPress={() => {
              navigation.navigate('postCreation', { url: '' });
            }}
          >
            <AntDesign name="caretleft" size={20} color="white" />
            <Text className="text-white text-lg">Exit</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            className=" mr-5 mb-2 flex-row-reverse bg-green-500 p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('postCreation', { url: url });
            }}
          >
            <Ionicons name="document-attach" size={20} color="white" />
            <Text className="text-white text-lg mr-2">Attach Link</Text>
          </TouchableOpacity>
        ),
      });
    }, []);


    return (
      <View className="bg-black flex-1">
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://news.google.com' }}
          allowUniversalAccessFromFileURLs={true}
          originWhitelist={['*']}
          onNavigationStateChange={(event)=>{
            url=event.url;
          }}
          
        />
      </View>
    );
  };

  const Stack = createStackNavigator();
  return (
    <View className="flex-auto">
      <Stack.Navigator initialRouteName="postCreation">
        <Stack.Screen name="postCreation" component={PostCreationPage} options={{ headerShown: false, item: route?.params?.item}} initialParams={{url:''}}/>
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ title: '' }} />
      </Stack.Navigator>
    </View>
  );
};

export default CreatePost;
