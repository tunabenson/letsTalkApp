import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, FlatList, RefreshControl} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ProfilePage from './Account';
import { auth, db  } from '../api/firebaseConfig';
 import Post from '../components/Post';
import CreatePost from './CreatePost';
import { AntDesign } from '@expo/vector-icons';
import { FullPostScreen } from './FullPostScreen';
import { fetchForumData, fetchLikeDislikeCounts } from '../api/DocumentFetcher';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { SearchStackPage } from './SearchPage';



const Stack = createStackNavigator();
const Tab= createBottomTabNavigator();

const getRecommendedPosts = async ({setPosts}) => {
  try {
    const postQuery = query(collection(db, "posts"), orderBy("date", 'desc'), limit(15));
    const querySnapshot = await getDocs(postQuery);
    const temp = [];

    for (const document of querySnapshot.docs) {
      const items = { ...document.data(), "id": document.id };
      temp.push(items);
    }
    setPosts(temp);
  } catch (error) {
    console.error('Error fetching recommended posts:', error);
  }
};


const Home = ({route}) => {
  const {posts}= route.params;

  return (
    <Tab.Navigator
    id='2'
    initialRouteName={"Home"}
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: { borderCurve: 'circular', bottom: 'auto' },
      tabBarActiveTintColor: '#4DFFF3',
      tabBarInactiveTintColor: '#1D1E2C'
    }}
  >
    <Tab.Screen
      name='Home'
      component={ForumPage}
      options={{
        tabBarIcon: ({ focused }) => (
          <MaterialIcons name="home" size={24} color={!focused ? '#1D1E2C' : '#4DFFF3'} />
        )
      }}
      initialParams={{ posts }}
    />

    <Tab.Screen
      name='Create Post'
      component={CreatePost}
      options={{
        tabBarIcon: ({ focused }) => (
          <AntDesign name="pluscircleo" size={24} color={!focused ? '#1D1E2C' : '#4DFFF3'} />
        )
      }}
    />

    <Tab.Screen
      name='Search'
      component={SearchStackPage}
      options={{
        tabBarIcon: ({ focused }) => (
          <MaterialIcons name="search" size={24} color={!focused ? '#1D1E2C' : '#4DFFF3'} />
        )
      }}
    />

    <Tab.Screen
      name='Account'
      component={ProfilePage}
      initialParams={{ username: auth.currentUser.displayName }}
      options={{
        tabBarIcon: ({ focused }) => (
          <MaterialIcons name="account-circle" size={24} color={!focused ? '#1D1E2C' : '#4DFFF3'} />
        )
      }}
    />
  </Tab.Navigator>
  );
};

const PostsScreen = ({ navigation}) => {
  
  const [refresh, setRefresh] = useState(false);
  const [posts, setPosts]= useState([]);



  useEffect(()=>{
    getRecommendedPosts({setPosts});
  },[]);

 
  const refreshHandler = () => {
    setRefresh(true);
    getRecommendedPosts({setPosts}).then(()=>setRefresh(false));
  };

  return (
    <SafeAreaView className="flex-1 bg-lightblue-500 p-5">
      <FlatList
        initialNumToRender={10}
        data={posts}
        onEndReachedThreshold={0.9}
        //onEndReached={()=>Alert.alert("you down there")} //TODO fetch more posts data from older posts
        renderItem={({ item }) => <Post  item={item} navigation={navigation}/>}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />}
      />
    </SafeAreaView>
  );
};


const newForumPage=({route})=>{
  const [forums, setForums]= useState([]);
  useEffect(() => {
    const getForums = async () => {
      const forumList = await fetchForumData();
      setForums(forumList);
    };

    getForums();
  }, []);

 const Drawer = createDrawerNavigator();
  return (
      <Drawer.Navigator >
        <Drawer.Screen name='test'></Drawer.Screen>
        {/* {forums.map(forum => (
          <Drawer.Screen
            key={forum.id}
            name={forum?.name} // Forum name as the route name
            component={ForumPage} // The component to render
            initialParams={{ forumId: forum?.id }} // Pass the forum ID as a parameter
          />
        ))} */}
      </Drawer.Navigator>
  );
};

const ForumPage=({route})=>{
  const {posts}= route.params;
  console.log("forum", posts);
 return(
  <View className="flex-1 bg-gray-100">
    <Stack.Navigator initialRouteName={"Main"}>
      <Stack.Screen name="Main" component={PostsScreen} options={{headerShown:false}} initialParams={{posts:posts}}/>
      <Stack.Screen name="Post" component={FullPostScreen} options={{headerShown:false}}  />
      <Stack.Screen name='Account' component={ProfilePage} options={{headerShown:false}}/>
    </Stack.Navigator>
</View>
 )
};

export default Home;
