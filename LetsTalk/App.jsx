// App.jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/tabs/Home';
import LoginPage from './pages/authentication/Login';
import SignUpPage from './pages/authentication/SignupPage';
import ForgotPasswordPage from './pages/authentication/ForgotPasswordPage';
import useInitializeApp from './hooks/useInitializeApp';
const Stack = createStackNavigator();

export default function App() {
  const { signedIn, isAppReady, authChecked, onLayoutRootView } = useInitializeApp();

  if (!isAppReady || !authChecked) {
    return null;
  }
  return (
    <View onLayout={onLayoutRootView} className='flex-1 bg-white'>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {signedIn ? (
            <Stack.Screen name='HomePage' component={Home} />
          ) : (
            <Stack.Group>
              <Stack.Screen name='LoginPage' component={LoginPage} />
              <Stack.Screen name='ForgotPassword' component={ForgotPasswordPage} />
              <Stack.Screen name='SignUpPage' component={SignUpPage} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}


