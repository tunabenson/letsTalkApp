import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Home from './pages/Home';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from './pages/Login';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './pages/SignupPage';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen component={LoginPage} name='LoginPage'/>
          <Stack.Screen component={Home} name='HomePage'/>
          <Stack.Screen component={SignUpScreen} name='SignUpPage'/>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
