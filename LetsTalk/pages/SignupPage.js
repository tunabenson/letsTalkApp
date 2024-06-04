import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignUpPage1, SignUpPage2 } from '../components/Signup';

const Stack = createStackNavigator();

const SignUpScreen = () => {
  return (
    <Stack.Navigator id={'3'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUpPage1" component={SignUpPage1} />
      <Stack.Screen name="SignUpPage2" component={SignUpPage2} />
    </Stack.Navigator>
  );
};

export default SignUpScreen;
