import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/tabs/Home';
import LoginPage from './pages/authentication/Login';
import SignUpPage from './pages/authentication/SignupPage';
import ForgotPasswordPage from './pages/authentication/ForgotPasswordPage';
import { auth, db } from './api/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [user, setUser] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [authChecked, setAuthIsChecked] = useState(false);


  useEffect(() => {
    async function prepareApp() {
      try {
        onAuthStateChanged(auth, async(user) => {
          if (user && auth.currentUser.emailVerified) {
            setUser(user);
            setSignedIn(true);
          
          } else {
            setSignedIn(false);
            setUser(null);
          }
          setAuthIsChecked(true);
        });
   
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setIsAppReady(true); 
      }
    }
    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if(isAppReady && authChecked ){
        await SplashScreen.hideAsync();
    }
  }, [isAppReady, authChecked]);

  if (!isAppReady || !authChecked ) {
    return null; 
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {signedIn ? (
            <Stack.Screen name='HomePage' component={Home}  />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
