import React from 'react';
import { View, SafeAreaView, ScrollView, Text, Pressable, FlatList, RefreshControl, TouchableOpacity, Alert} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { styled } from 'nativewind';
import LoginPage from './Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const posts = [
  { key: 1, user: 'michael1', email: 'michael1@gmail.com', content: 'Hello there, my name is Michael. and I love to read book and eat food and read Hello there, my name is Michael. and I love to read book and eat food and read Hello there, my name is Michael. and I love to read book and eat food and readHello there, my name is Michael. and I love to read book and eat food and read Hello there, my name is Michael. and I love to read book and eat food and read', date: new Date().toLocaleString(), forum: 'Abortions' },
  { key: 2, user: 'jamie11', email: 'jamie11@gmail.com', content: 'Hello there, my name is Jamie.', date: new Date().toLocaleString(), forum: 'Abortions' },
  { key: 3, user: 'jamie11', email: 'jamie11@gmail.com', content: 'This is my second post.', date: new Date().toLocaleString(), forum: 'Abortions' },
  { key: 4, user: 'sarah', email: 'sarah@gmail.com', content: 'Sarah here, nice to meet you all!', date: new Date().toLocaleString(), forum: 'General' },
  { key: 5, user: 'david', email: 'david@gmail.com', content: 'David’s first post, excited to be here!', date: new Date().toLocaleString(), forum: 'General' },
  { key: 6, user: 'emma', email: 'emma@gmail.com', content: 'Emma checking in.', date: new Date().toLocaleString(), forum: 'Health' },
  { key: 7, user: 'jack', email: 'jack@gmail.com', content: 'Jack’s thoughts on the topic.', date: new Date().toLocaleString(), forum: 'Technology' },
  { key: 8, user: 'linda', email: 'linda@gmail.com', content: 'Linda here, happy to join!', date: new Date().toLocaleString(), forum: 'Lifestyle' },
  { key: 9, user: 'paul', email: 'paul@gmail.com', content: 'Paul’s post on the issue.', date: new Date().toLocaleString(), forum: 'Politics' },
  { key: 10, user: 'alice', email: 'alice@gmail.com', content: 'Alice’s input on this matter.', date: new Date().toLocaleString(), forum: 'Science' },
];

const Stack = createStackNavigator();
const Tab= createBottomTabNavigator();

const Home = () => {
  const [currentForum, setCurrentForum] = React.useState('Abortions');

  return (
    <Tab.Navigator
      id='1'
      initialRouteName='home'
      screenOptions={{ tabBarInactiveBackgroundColor: '#ffffff', headerShown:false }}
    >
      <Tab.Screen name='Home' component={ForumPage } options={{tabBarIcon:({focused})=>(<MaterialIcons name="home" size={24} color= {focused?'black':'#dfdd'} />)}} />
      <Tab.Screen name='Account' component={LoginPage} options={{tabBarIcon:({focused})=>(<MaterialIcons name="account-circle" size={24} color= {focused?'black':'#dfdd'} />)}} />
    </Tab.Navigator>
  );
};

const PostsScreen = ({ route, navigation }) => {
  const { posts } = route.params;

  const openPost = ({ item }) => {
    navigation.navigate('Post', { item });
  };

  const [refresh, setRefresh] = React.useState(false);

  const refreshHandler = () => {
    setRefresh(true);
    // Simulate a refresh action
    setTimeout(() => setRefresh(false), 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-lightblue-500 p-5">
      <FlatList
        data={posts}
        ListEmptyComponent={<Post item={{ user: 'No posts yet' }} />}
        renderItem={({ item }) => <Post onPress={openPost} item={item} />}
        keyExtractor={item => item.key.toString()}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />}
      />
    </SafeAreaView>
  );
};

const FullPostScreen = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView className="flex-1 bg-lightblue-500 p-5">
      <View className="mt-5 p-5 bg-white rounded-lg shadow-lg">
        <Text className="text-xl font-bold text-black">{item.user}</Text>
        <Text className="text-sm text-gray-500 mb-4">{item.date}</Text>
        <Text className="text-base text-gray-800">{item.content}</Text>
      </View>
    </ScrollView>
  );
};

const Post = ({ item, onPress }) => (
  <TouchableOpacity 
    className="m-2 p-4 bg-white rounded-lg shadow-lg"
    onPress={() => onPress({ item })}
    activeOpacity={0.7}
  >
    <Pressable hitSlop={10} onPress={()=>Alert.alert('Clicked', 'just testing water')}>
      <Text className="text-lg font-semibold text-amber-700">@{item.user}</Text>
    </Pressable>
    <Text className="text-base text-gray-800 mb-2">{item.content}</Text>
    <Text className="text-sm text-gray-500 self-end">{item.date}</Text>
  </TouchableOpacity>
);


const ForumPage=()=>{
 return(
  <View className="flex-1 bg-gray-100">
    <Stack.Navigator initialRouteName={"Home"}>
      <Stack.Screen name={"Home"} component={PostsScreen} initialParams={{ posts }} options={{headerShown:false}}/>
      <Stack.Screen name="Post" component={FullPostScreen} />
    </Stack.Navigator>
</View>
 )
}

export default Home;
