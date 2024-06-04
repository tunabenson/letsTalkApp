import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, TouchableOpacity, Icon} from 'react-native';
// import { styled } from 'nativewind';
// import Home from './Home';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import SignUpScreen from './SignupPage';
//import {signInWithEmailAndPassword} from '@react-native-firebase/auth'

const LoginPage = ({ navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenPassword, setHiddenPassword]=useState(true);
  //const {setIsLoggedIn}= route.params;
  const handleLogin = () => {
    if (username === 'user' && password === 'pass') {
      Alert.alert('Login Successful', 'Welcome!', [
        { text: 'OK', onPress: () => {navigation.replace('HomePage');}}
      ]);
    } else {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  

  
  return (
    <View className="flex-1 justify-center items-center bg-lightblue-500 p-4">
      <Text className="text-white text-3xl mb-8 font-semibold">Login</Text>
      <TextInput
        className="w-64 p-3 mb-3 border border-gray-300 rounded bg-white text-black"
        
        placeholder="Username"
        value={username}
        onChangeText={newText=> setUsername(newText.replace(/ /g, ''))}
        secureTextEntry={false}
      />
        <View className="flex flex-row items-center w-64 p-3 mb-4 border border-gray-300 rounded bg-white">
      <TextInput
        className="flex-1 text-black"
        placeholder="Password"
        value={password}
        onChangeText={newText => setPassword(newText.replace(/ /g, ''))}
        secureTextEntry={hiddenPassword}
      />
      <Pressable onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={5}>
        <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
      </Pressable>
    </View>
      <TouchableOpacity
        className="w-64 p-4 rounded bg-white items-center"
        onPress={handleLogin}
        activeOpacity={0.7}
      >
        <Text className="text-lightblue-500 font-bold">Login</Text>
      </TouchableOpacity>

      <Pressable className='mt-10' onPress={()=>navigation.navigate('SignUpPage')}>
        <Text className= 'font-normal'> Don't Have an account? Sign up now!</Text>
      </Pressable>
    </View>
  );
};

export default LoginPage;
