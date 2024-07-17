import React, { useEffect, useRef, useState } from 'react';
import { Animated} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ProfilePage from './Account';
import { auth  } from '../../api/firebaseConfig';
import CreatePost from './Creations/CreatePost';
import { AntDesign } from '@expo/vector-icons';
import { SearchStackPage }  from './SearchPage';
import ForumPage from './ForumPage';



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


export default Home;
