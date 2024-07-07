import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import Article from '../components/Article';
import { auth, createPost } from '../api/firebaseConfig';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

const CreatePost = ({ navigation }) => {
  

  const PostCreationPage = ({navigation, route}) => {
    const {url}=route.params;
    const [attachedUrl, setAttachedUrl] = useState(url);
    const [forum, setForum] = useState('');
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
  

    const handlePost = async () => {
      setIsPosting(true);
      if (!forum.trim() || !content.trim()) {
        Alert.alert('Error', 'Please enter both the forum name and the content.');
      } else {
        const user = auth.currentUser.displayName;
        const post = {
          text: content,
          username: user,
          forum: forum,
        };
        if (attachedUrl) {
          post.url = attachedUrl;
        }
        const response = await createPost(post);
        Alert.alert(response.header, response.message);

        if (response.header === 'Success') {
          navigation.goBack();
          setForum('');
          setContent('');
          setAttachedUrl('');
        }
        
      }
      setIsPosting(false);
    };

    const handleBrowserPress = () => {
      navigation.navigate('WebViewScreen');
    };

    return (
      <ScrollView className="flex-1 bg-lightblue-500 p-4">
        <View className="mb-4 mt-10">
          <Text className="text-white text-2xl font-semibold mb-6">Create a Post</Text>

          <View className="bg-white p-4 rounded-2xl mb-4">
            <TextInput
              className="text-black"
              placeholder="Forum Name"
              value={forum}
              hitSlop={20}
              onChangeText={(text) => setForum(text.replace(/ /g, '_').toLowerCase())} // Remove spaces from forum name
            />
          </View>

          <View className="bg-white p-4 rounded-2xl mb-4">
            <TextInput
              className="text-black h-32"
              placeholder="Write your content here..."
              multiline
              numberOfLines={4}
              value={content}
              onChangeText={(text) => setContent(text)}
              blurOnSubmit={true}
            />
          </View>

          {attachedUrl ? (
            <View className="bg-white p-4 rounded-2xl flex-row mb-4">
              <Article url={attachedUrl} />
            </View>
          ) : null}

          <View className="flex-row justify-start mb-4">
            <TouchableOpacity>
              <AntDesign name="link" size={24} color="white" style={{ marginLeft: 10, marginRight: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBrowserPress}>
              <Entypo name="browser" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {!isPosting ? (
            <TouchableOpacity className="bg-white p-4 rounded-lg items-center" onPress={handlePost}>
              <Text className="text-lightblue-500 font-bold">Post</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="small" color="#ffffff" />
          )}
        </View>
      </ScrollView>
    );
  };

  const WebViewScreen = ({ navigation }) => {
    const webViewRef = useRef(null);
    const [url, setUrl]= useState();
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
              console.log('from webview',url);
              navigation.navigate('postCreation', { url: url });
            }}
          >
            <Ionicons name="document-attach" size={20} color="white" />
            <Text className="text-white text-lg mr-2">Attach Link</Text>
          </TouchableOpacity>
        ),
      });
    }, []);

    const handleNavigationStateChange = (navState) => {
      setUrl(navState);
      console.log(navState.url);
    };

    return (
      <View className="bg-black flex-1">
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://news.google.com' }}
          allowUniversalAccessFromFileURLs={true}
          originWhitelist={['*']}
          onNavigationStateChange={handleNavigationStateChange}
        />
      </View>
    );
  };

  const Stack = createStackNavigator();
  return (
    <View className="flex-auto">
      <Stack.Navigator initialRouteName="postCreation">
        <Stack.Screen name="postCreation" component={PostCreationPage} options={{ headerShown: false }} initialParams={{url:''}}/>
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ title: '' }} />
      </Stack.Navigator>
    </View>
  );
};

export default CreatePost;
