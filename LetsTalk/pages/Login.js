import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Pressable, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform , Keyboard, Alert} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { auth} from '../api/firebaseConfig';
import {signInWithEmailAndPassword } from 'firebase/auth'
import { UserContext } from '../App';




const LoginPage = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenPassword, setHiddenPassword]=useState(true);

  const [pressedLogin, setPressedLogin]= useState(false);
  const {User}= useContext(UserContext);

  const handleLogin = async () => {
      try {
        if(username && password){
          await signInWithEmailAndPassword(auth, username, password).then(user => {
            User.setUser(user);
            setUsername('');
            setPassword('');
            
          });
        }
        else{
          Alert.alert('Error', 'You left one or more fields blank')
        }
      }catch (e){
        setPressedLogin(false);
        let msg= e.message;
        console.log(msg);
        if(msg.includes('auth/invalid-email')){Alert.alert('Error', 'Account Does not Exist')}
        if(msg.includes('auth/invalid-credential')){Alert.alert('Error', 'Invalid Email or Password')}
      }
  };

  

  
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex:1 }}>
    <View className="flex-1 justify-center items-center bg-lightblue-500 p-4">
      <Text className="text-white text-3xl mb-8 font-semibold">Login</Text>
      <TextInput hitSlop={20}
        className="w-64 p-3 mb-3 border border-gray-300 rounded-2xl text-blackraisin-100 bg-white"
        onSubmitEditing={()=>Keyboard.dismiss()}
        placeholder="Username"
        value={username}
        onChangeText={newText=> setUsername(newText.replace(/ /g, ''))}
        secureTextEntry={false}
      />
        <View className="flex flex-row items-center w-64 p-3 mb-4 border rounded-2xl border-gray-300  bg-white">
      <TextInput hitSlop={20}
        className="flex-1 text-blackraisin-100 bg-white "
        onSubmitEditing={()=>Keyboard.dismiss()}
        placeholder="Password"
        value={password}
        onChangeText={newText => setPassword(newText.replace(/ /g, ''))}
        secureTextEntry={hiddenPassword}
      />
      <Pressable onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={20}>
        <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} /> 
      </Pressable>
    </View>
    { pressedLogin?
      <ActivityIndicator size="small" color={'#ffffff'}/>
      :
      <TouchableOpacity
      hitSlop={15}
        className="w-64 p-4 rounded-2xl bg-white items-center"
        onPress={handleLogin}
        activeOpacity={0.7}
      >
        <Text className="text-lightblue-500 font-bold">Login</Text>
      </TouchableOpacity>
    }
      <Pressable className='mt-10 font-semibold' hitSlop={30} onPress={()=>navigation.navigate('SignUpPage')}>
        <Text className= 'font-bold '> Don't Have an Account? Sign Up Now!</Text>
      </Pressable>
    </View>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
