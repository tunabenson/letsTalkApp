import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignupPage';
import LoadUpScreen from './pages/LoadingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { auth, db } from './api/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { fetchLikeDislikeCounts } from './api/DocumentFetcher';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    // Authentication state change handler
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && auth.currentUser.emailVerified) {
        setUser(user);
        setSignedIn(true);
      } else {
        setSignedIn(false);
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);


  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoadingAuth ? (
            <Stack.Screen name='LoadUp' component={LoadUpScreen} />
          ) : (
            <Stack.Group>
              {signedIn ? (
                <Stack.Screen name='HomePage' component={Home} initialParams={{ posts }} />
              ) : (
                <Stack.Group>
                  <Stack.Screen name='LoginPage' component={LoginPage} />
                  <Stack.Screen name='ForgotPassword' component={ForgotPasswordPage} />
                  <Stack.Screen name='SignUpPage' component={SignUpPage} />
                </Stack.Group>
              )}
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
