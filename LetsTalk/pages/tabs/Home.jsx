import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, FlatList, RefreshControl} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ProfilePage from './Account';
import { auth, db, fetchLikeDislikeCounts  } from '../../api/firebaseConfig';
 import Post from '../../components/posts/Post';
import CreatePost from '../CreatePost';
import { AntDesign } from '@expo/vector-icons';
import { FullPostScreen } from '../FullPostScreen';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { SearchStackPage }  from '../SearchPage';
import LoadingPage from '../LoadingPage';



const Stack = createStackNavigator();
const Tab= createBottomTabNavigator();




const Home = () => {

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
        unmountOnBlur:true,
        tabBarIcon: ({ focused }) => (
          <MaterialIcons name="account-circle" size={24} color={!focused ? '#1D1E2C' : '#4DFFF3'} />
        )
      }}
      
    />
  </Tab.Navigator>
  );
};




const ForumPage=()=>{
  const [posts, setPosts]= useState();
  const getRecommendedPosts = async () => {
    try {
      const postQuery = query(collection(db, "posts"), orderBy("date", 'desc'), limit(15));
      const querySnapshot = await getDocs(postQuery);
      const temp = [];
  
      for (const document of querySnapshot.docs) {
        // const {likes, dislikes}=await fetchLikeDislikeCounts(document.id);
        const items = { ...document.data(), "id": document.id };
        temp.push(items);
      
      }
      setPosts(temp);
      
    } catch (error) {
      console.error('Error fetching recommended posts:', error);
    }
  };





  useEffect(()=>{
    getRecommendedPosts({setPosts})
  },[])


  const PostsScreen = ({ navigation}) => {
    const [refresh, setRefresh] = useState(false);
    
  
    const refreshHandler = () => {
      setRefresh(true);
      getRecommendedPosts(setPosts).then(()=>setRefresh(false));
    };
  
    return (
      <SafeAreaView className="flex-1 bg-lightblue-500 p-5">
        <FlatList
          initialNumToRender={10}
          data={posts}
          onEndReachedThreshold={0.9}
          //onEndReached={()=>Alert.alert("you down there")} //TODO fetch more posts data from older posts
          renderItem={({ item }) => <Post  item={item} navigation={navigation} fromAccount={false}/>}
          keyExtractor={( item,index) => index.toString()}
          refreshControl={<RefreshControl tintColor={'#ffffff'} refreshing={refresh} onRefresh={refreshHandler} />}
        />
      </SafeAreaView>
    );
  };

if(!posts){
  return (
    <LoadingPage/>
  )
}

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
