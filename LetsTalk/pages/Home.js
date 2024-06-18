import React from 'react';
import { View, SafeAreaView, ScrollView, Text, Pressable, FlatList, RefreshControl, TouchableOpacity, Alert} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ProfilePage from './Account';
import { auth } from '../api/firebaseConfig';
 import Post from '../components/Post';
import { signOut } from 'firebase/auth';
import CreatePost from './CreatePost';
import { Entypo } from '@expo/vector-icons';
const posts = [
    { "key": 1, "user": "michael1", "content": "Hello there, my name is Michael. I love reading books and eating food. This is my first post on the topic of Abortions.", "date": "6/1/2024, 10:15 AM", "forum": "Abortions" },
    { "key": 2, "user": "jamie11", "content": "Jamie here. This is my first contribution to the Abortions forum. Happy to discuss this topic with you all.", "date": "6/1/2024, 11:00 AM", "forum": "Abortions" },
    { "key": 3, "user": "jamie11", "content": "Another post from Jamie about the ongoing debate on Abortions.", "date": "6/1/2024, 11:30 AM", "forum": "Abortions" },
    { "key": 4, "user": "sarah", "content": "Sarah here. I'm excited to be part of this General forum and share my thoughts.", "date": "6/1/2024, 12:15 PM", "forum": "General" },
    { "key": 5, "user": "david", "content": "David’s first post in the General forum. Looking forward to engaging discussions!", "date": "6/1/2024, 1:00 PM", "forum": "General" },
    { "key": 6, "user": "emma", "content": "Emma here, discussing health and wellness in the Health forum.", "date": "6/1/2024, 1:45 PM", "forum": "Health" },
    { "key": 7, "user": "jack", "content": "Jack’s first thoughts on the latest advancements in Technology.", "date": "6/1/2024, 2:30 PM", "forum": "Technology" },
    { "key": 8, "user": "linda", "content": "Linda checking in. Happy to join the Lifestyle discussions!", "date": "6/1/2024, 3:15 PM", "forum": "Lifestyle" },
    { "key": 9, "user": "paul", "content": "Paul’s take on current political issues in the Politics forum.", "date": "6/1/2024, 4:00 PM", "forum": "Politics" },
    { "key": 10, "user": "alice", "content": "Alice’s input on the latest scientific discoveries in the Science forum.", "date": "6/1/2024, 4:45 PM", "forum": "Science" },
    { "key": 11, "user": "michael2", "content": "Michael again, with more thoughts on the topic of Abortions.", "date": "6/2/2024, 9:00 AM", "forum": "Abortions" },
    { "key": 12, "user": "jamie22", "content": "Jamie here, contributing to the General discussions.", "date": "6/2/2024, 10:00 AM", "forum": "General" },
    { "key": 13, "user": "sarah2", "content": "Sarah’s thoughts on health-related topics in the Health forum.", "date": "6/2/2024, 11:00 AM", "forum": "Health" },
    { "key": 14, "user": "david2", "content": "David here with insights on the latest in Technology.", "date": "6/2/2024, 12:00 PM", "forum": "Technology" },
    { "key": 15, "user": "emma2", "content": "Emma’s tips and tricks for a better Lifestyle.", "date": "6/2/2024, 1:00 PM", "forum": "Lifestyle" },
    { "key": 16, "user": "jack2", "content": "Jack’s analysis on current political trends.", "date": "6/2/2024, 2:00 PM", "forum": "Politics" },
    { "key": 17, "user": "linda2", "content": "Linda shares her views on recent scientific studies.", "date": "6/2/2024, 3:00 PM", "forum": "Science" },
    { "key": 18, "user": "paul2", "content": "Paul discussing general topics of interest.", "date": "6/2/2024, 4:00 PM", "forum": "General" },
    { "key": 19, "user": "alice2", "content": "Alice's opinion on health-related issues.", "date": "6/2/2024, 5:00 PM", "forum": "Health" },
    { "key": 20, "user": "michael3", "content": "Michael’s perspective on technology and its impact.", "date": "6/3/2024, 9:00 AM", "forum": "Technology" },
    { "key": 21, "user": "jamie33", "content": "Jamie’s tips for a better lifestyle.", "date": "6/3/2024, 10:00 AM", "forum": "Lifestyle" },
    { "key": 22, "user": "sarah3", "content": "Sarah’s analysis of political events.", "date": "6/3/2024, 11:00 AM", "forum": "Politics" },
    { "key": 23, "user": "david3", "content": "David’s take on recent scientific findings.", "date": "6/3/2024, 12:00 PM", "forum": "Science" },
    { "key": 24, "user": "emma3", "content": "Emma here with more thoughts on general topics.", "date": "6/3/2024, 1:00 PM", "forum": "General" },
    { "key": 25, "user": "jack3", "content": "Jack's view on health and wellness.", "date": "6/3/2024, 2:00 PM", "forum": "Health" },
    { "key": 26, "user": "linda3", "content": "Linda sharing insights on the latest in technology.", "date": "6/3/2024, 3:00 PM", "forum": "Technology" },
    { "key": 27, "user": "paul3", "content": "Paul’s discussion on lifestyle improvements.", "date": "6/3/2024, 4:00 PM", "forum": "Lifestyle" },
    { "key": 28, "user": "alice3", "content": "Alice’s analysis of the political landscape.", "date": "6/3/2024, 5:00 PM", "forum": "Politics" },
    { "key": 29, "user": "michael4", "content": "Michael commenting on new scientific discoveries.", "date": "6/4/2024, 9:00 AM", "forum": "Science" },
    { "key": 30, "user": "jamie44", "content": "Jamie’s general thoughts on various topics.", "date": "6/4/2024, 10:00 AM", "forum": "General" },
    { "key": 31, "user": "sarah4", "content": "Sarah’s insights into health and wellness.", "date": "6/4/2024, 11:00 AM", "forum": "Health" },
    { "key": 32, "user": "david4", "content": "David’s review of the latest tech trends.", "date": "6/4/2024, 12:00 PM", "forum": "Technology" },
    { "key": 33, "user": "emma4", "content": "Emma’s tips for living a healthier lifestyle.", "date": "6/4/2024, 1:00 PM", "forum": "Lifestyle" },
    { "key": 34, "user": "jack4", "content": "Jack’s political views on the current administration.", "date": "6/4/2024, 2:00 PM", "forum": "Politics" },
    { "key": 35, "user": "linda4", "content": "Linda’s thoughts on the impact of recent scientific research.", "date": "6/4/2024, 3:00 PM", "forum": "Science" },
    { "key": 36, "user": "paul4", "content": "Paul here with some new ideas on general topics.", "date": "6/4/2024, 4:00 PM", "forum": "General" },
    { "key": 37, "user": "alice4", "content": "Alice's advice on maintaining good health.", "date": "6/4/2024, 5:00 PM", "forum": "Health" },
]

const Stack = createStackNavigator();
const Tab= createBottomTabNavigator();

const Home = () => {
  const [currentForum, setCurrentForum] = React.useState('Abortions');
  const value= true;
  const user=auth.currentUser;
  return (
    <Tab.Navigator
      id='2'
      initialRouteName={"Home"}
      screenOptions={{ headerShown:false, tabBarStyle:{borderCurve:'circular', bottom:'auto'}, tabBarActiveTintColor: '#4DFFF3', tabBarInactiveTintColor: '#1D1E2C'}}>
      <Tab.Screen name='Home' component={ForumPage} options={{tabBarIcon:({focused})=>(<MaterialIcons name="home" size={24} color= {!focused?'#1D1E2C':'#4DFFF3'} />) }} />    
      <Tab.Screen name='Account' component={ProfilePage} options={{tabBarIcon:({focused})=>(<MaterialIcons name="account-circle" size={24} color= {!focused?'#1D1E2C':'#4DFFF3'} />) }} />
    </Tab.Navigator>
  );
};

const PostsScreen = ({ route, navigation }) => {
  const { posts } = route.params; //TODO fetch from posts collection all posts which the user has interest in. 

  // const openPost = ({ item }) => {
  //   navigation.navigate('Post', { item });
  // };

  const [refresh, setRefresh] = React.useState(false);

  const refreshHandler = () => {
    setRefresh(true);
    signOut(auth);
    // navigation.navigate("Create Post")
    // Simulate a refresh action
    setTimeout(() => setRefresh(false), 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-lightblue-500 p-5">
      <FlatList
        initialNumToRender={10}
        data={posts}
        onEndReachedThreshold={0.9}
        onEndReached={()=>Alert.alert("you down there")} //TODo fetch more posts data from older posts
        ListEmptyComponent={<Post item={{ user: 'No posts yet' }} />}
        renderItem={({ item }) => <Post  item={item} navigation={navigation}/>}
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


const ForumPage=()=>{
 return(
  <View className="flex-1 bg-gray-100">
    <Stack.Navigator initialRouteName={"Main"}>
      <Stack.Screen name="Main" component={PostsScreen} initialParams={{ posts }} options={{headerShown:false}}/>
      <Stack.Screen name="Post" component={FullPostScreen} />
      {/* <Stack.Screen name="Create Post" component={CreatePost} options={{headerShown:false}}/> */}
      <Stack.Screen name='Account' component={ProfilePage} options={{headerShown:false}}/>
    </Stack.Navigator>
</View>
 )
}

export default Home;
