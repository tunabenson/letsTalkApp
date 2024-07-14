import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Pressable, Settings } from 'react-native';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../../api/firebaseConfig';
import Post from '../../components/posts/Post';
import { createStackNavigator } from '@react-navigation/stack';
import { FullPostScreen } from '../ExpandedPosts/FullPostScreen';
import LoadingPage from '../LoadingPage';
import SettingsPage from '../Settings/SettingsPage';
const fetchPostsByUsername = async (username) => {
  const postsQuery = query(collection(db, "posts"), where('username', '==', username), orderBy("date", 'desc'), limit(15));
  const snap = await getDocs(postsQuery);
  const temp = [];

  for (const document of snap.docs) {
    const postData = { ...document.data(), id: document.id };
    temp.push(postData);
  }

  return temp;
};

const Stack = createStackNavigator();

const Account = ({ route, navigation }) => {
  const { username } = route.params;
  const [account, setAccount] = useState(null);
  const [posts, setPosts] = useState(null);

  const fetchData = async () => {
    const userQuery = query(collection(db, 'users'), where('username', '==', username), limit(1));
    const userDocPromise = getDocs(userQuery);
    const postsPromise = fetchPostsByUsername(username);

    const [userDoc, posts] = await Promise.all([userDocPromise, postsPromise]);

    userDoc.forEach((result) => {
      setAccount(result.data());
    });

    setPosts(posts);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!account || !posts) {
    return <LoadingPage />;
  }

  return (
    <View className="flex-1 bg-lightblue-500 p-4">
      <View className="flex-row items-center mb-4">
        <Image
          className="w-24 h-24 mt-10 bg-slate-400 rounded-full border-4 border-white"
          source={account.url !== ' ' ? { uri: account.url } : require('../../assets/images/profile.png')}
        />
        <View className="flex-1 ml-4 mt-10 bg-white p-4 rounded-lg shadow-md">
          <Text className="text-lg font-bold mb-1">{username}</Text>
          <Text className="text-gray-700 mb-1">{account.bio}</Text>
          <Text className="text-gray-500">{new Date(account.joinDate.seconds * 1000).toLocaleDateString("en-US")}</Text>
          {username === auth.currentUser.displayName && (
            <Pressable
              className="bg-red-500 p-2 rounded-md mt-4 w-24"
              onPress={() => navigation.navigate('settings')}
            >
              <Text className="text-white text-center">Settings</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View className="flex-1 bg-lightblue-500 border-cyan-400">
        <Text className="text-white text-2xl mt-4 font-bold">Recent Posts</Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post item={item} fromAccount={true} navigation={navigation} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const ProfilePage = ({ route, navigation }) => (
  <View className="flex-1 bg-gray-100">
    <Stack.Navigator initialRouteName={'ProfilePage'}>
      <Stack.Screen name="ProfilePage" component={Account} initialParams={route.params} options={{ headerShown: false }} />
      <Stack.Screen name="Full-Post" component={FullPostScreen} initialParams={{ fromAccount: true }} options={{ headerShown: false }}/>
      <Stack.Screen name="settings" component={SettingsPage} initialParams={{ fromAccount: true }} options={{ headerShown: false }}/>
    </Stack.Navigator>
  </View>
);

export default ProfilePage;
