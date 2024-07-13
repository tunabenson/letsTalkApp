import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpStepOne from './signup-stage/SignUpStepOne';
import SignUpStepTwo from './signup-stage/SignUpStepTwo';
import SignUpStepThree from './signup-stage/SignUpStepThree';

const Stack = createStackNavigator();

const SignUpPage = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUpPage1" component={SignUpStepOne} />
      <Stack.Screen name="SignUpPage2" component={SignUpStepTwo} />
      <Stack.Screen name="SignUpPage3" component={SignUpStepThree} />
    </Stack.Navigator>
  );
};

export default SignUpPage;
