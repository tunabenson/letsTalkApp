import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, FlatList, RefreshControl, Animated} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ProfilePage from './Account';
import { auth, db  } from '../../api/firebaseConfig';
 import Post from '../../components/posts/Post';
import CreatePost from './Creations/CreatePost';
import { AntDesign } from '@expo/vector-icons';
import { FullPostScreen } from '../ExpandedPosts/FullPostScreen';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { SearchStackPage }  from './SearchPage';
import LoadingPage from '../LoadingPage';
import { SharedElement } from 'react-native-shared-element';



const Stack = createStackNavigator();
const Tab= createBottomTabNavigator();


function TabBarIcon({ name, size, color, focused, lib }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focused ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [focused]);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  const rotation = animatedValue.interpolate({
    inputRange: [ 0,1],
    outputRange: ['0deg', '360deg']
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1]
  });

  const IconComponent = lib === 'MaterialIcons' ? MaterialIcons : AntDesign;

  return (
    <Animated.View style={{ transform: [{ scale }, { rotate: rotation }], opacity }}>
      <IconComponent name={name} size={size} color={color} />
    </Animated.View>
  );
}

function Home() {
  return (
    <Tab.Navigator
      id='2'
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { borderCurve: 'circular', bottom: 'auto' },
        tabBarActiveTintColor: '#4DFFF3',
        tabBarInactiveTintColor: '#1D1E2C'
      }}
    >
      <Tab.Screen
        name="Home"
        component={ForumPage}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="home" size={24} color={color} focused={focused} lib="MaterialIcons" />
          )
        }}
      />
      <Tab.Screen
        name="Create Post"
        component={CreatePost}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="pluscircleo" size={24} color={color} focused={focused} lib="AntDesign" />
          )
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackPage}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="search" size={24} color={color} focused={focused} lib="MaterialIcons" />
          )
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfilePage}
        initialParams={{ username: auth.currentUser.displayName }} // Adjust as needed
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="account-circle" size={24} color={color} focused={focused} lib="MaterialIcons" />
          )
        }}
      />
    </Tab.Navigator>
  )
}



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
          renderItem={({ item }) => (
            <SharedElement id={`post.${item.id}`}>
              <Post item={item} navigation={navigation} fromAccount={false}/>
            </SharedElement>
          )}
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
      <Stack.Screen
        name="Post"
        component={FullPostScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 100} },
            close: { animation: 'spring', config: { duration: 100 } }
          },
    cardStyleInterpolator: ({ current: { progress } }) => {
      return {
        cardStyle: {
         
        }
      };
    }
  }}
  sharedElementsConfig={(route, otherRoute, showing) => {
    const { item } = route.params;
    return [{
      id: `post.${item.id}`,
      animation: 'move', 
      resize: 'clip', 
      align: 'left-top',
    }];
  }}

/>
   <Stack.Screen name='Account' component={ProfilePage} options={{headerShown:false}}/>
    </Stack.Navigator>
</View>
 )
};

export default Home;
