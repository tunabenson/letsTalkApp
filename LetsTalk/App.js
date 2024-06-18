import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Home from './pages/Home';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from './pages/Login';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpPage from './pages/SignupPage';
import { auth } from './api/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import LoadUpScreen from './pages/LoadingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const Stack = createStackNavigator();

//export const UserContext= createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [signedIn, setSignedIn]= useState(false);
  const [isLoading, setIsLoading]= useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && auth.currentUser.emailVerified ) { 
        setUser(user);
        setSignedIn(true);
      }
      else{
        setSignedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    });
  }, [user]);


  if (isLoading){
    return (<LoadUpScreen/>)
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator id='1' screenOptions={{headerShown:false}} >
      { signedIn? (
          <Stack.Screen component={Home} name='HomePage'/>
      ): (
        <Stack.Group>
          
          <Stack.Screen component={LoginPage} name='LoginPage'/>
          <Stack.Screen component={ForgotPasswordPage} name='ForgotPassword'/>
          <Stack.Screen component={SignUpPage} name='SignUpPage'/>
        </Stack.Group>
       
      )
      }
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
