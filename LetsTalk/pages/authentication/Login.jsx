// LoginPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import useLogin from '../../hooks/useLogin';

const LoginPage = ({ navigation }) => {
  const [alertConfig, setAlertConfig] = useState({
    showAlert: false,
    title: '',
    message: '',
  });

  const {
    username,
    setUsername,
    password,
    setPassword,
    hiddenPassword,
    setHiddenPassword,
    pressedLogin,
    handleLogin
  } = useLogin(setAlertConfig, navigation);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-lightblue-500 p-4">
        <Text className="text-white text-3xl mb-8 font-semibold">Login</Text>
        <TextInput
          hitSlop={20}
          className="w-64 p-3 mb-3 border border-gray-300 rounded-2xl text-blackraisin-100 bg-white"
          onSubmitEditing={Keyboard.dismiss}
          placeholder="Email"
          value={username}
          autoComplete='email'
          autoCapitalize='none'
          onChangeText={newText => setUsername(newText.replace(/ /g, '').toLowerCase())}
          keyboardType='email-address'
        />
        <View className="flex flex-row items-center w-64 p-3 mb-4 border rounded-2xl border-gray-300 bg-white">
          <TextInput
            hitSlop={20}
            className="flex-1 text-blackraisin-100 bg-white"
            onSubmitEditing={Keyboard.dismiss}
            placeholder="Password"
            value={password}
            onChangeText={newText => setPassword(newText.replace(/ /g, ''))}
            secureTextEntry={hiddenPassword}
          />
          <Pressable onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={20}>
            <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
          </Pressable>
        </View>
        {pressedLogin ?
          <ActivityIndicator size="small" color={'#ffffff'} />
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
        <Pressable className='mt-10 mb-5 font-semibold' hitSlop={20} onPress={() => navigation.navigate('SignUpPage')}>
          <Text className='font-bold text-white'> Don't Have an Account? Sign Up Now!</Text>
        </Pressable>
        <Pressable className='mt-10 font-semibold' hitSlop={20} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text className='font-bold text-white'>Forgot Password?</Text>
        </Pressable>
      </View>

      <AwesomeAlert
        show={alertConfig.showAlert}
        showProgress={false}
        title={alertConfig.title}
        message={alertConfig.message}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => setAlertConfig({ ...alertConfig, showAlert: false })}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
