import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../api/firebaseConfig';

const getUsernameAndEmailAvailability = async (email, username) => {
    console.log(email);
    console.log(username);
  const checkAvailabilityFunction = httpsCallable(functions, 'checkUsernameAndEmailAvailability');
  try {
    const available = await checkAvailabilityFunction({ email, username });
    return available.data;
  } catch (error) {
    console.error('Error with checking username availability', error.message);
  }
};

const SignUpStepOne = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const checkInputsValid = async () => {
    const availability = await getUsernameAndEmailAvailability(email, username);
    if (availability.usernameExists) {
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'Username Taken',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
      return false;
    }
    if (availability.emailExists) {
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'Email is already in use',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    Keyboard.dismiss();
    if (password !== confirmPassword) {
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'Passwords do not match',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
      return;
    }
    if (!email || !username || !password || !confirmPassword) {
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'Please fill all fields',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
      return;
    }
    setIsLoading(true);
    const valid = await checkInputsValid();
    if (valid) {
      navigation.navigate('SignUpPage2', { email, username, password });
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-lightblue-500 p-4">
        <Text className="text-white text-3xl mb-15 font-semibold">Sign Up</Text>
        <TextInput
          className="w-64 p-3 mb-3 mt-5 border border-gray-300 rounded-2xl bg-white text-black"
          hitSlop={15}
          placeholder="Email"
          keyboardType='email-address'
          value={email}
          autoCorrect={false}
          onSubmitEditing={() => Keyboard.dismiss()}
          inputMode='email'
          autoComplete='email'
          onChangeText={(newText) => setEmail(newText)}
        />
        <TextInput
          className="w-64 p-3 mb-3 border border-gray-300 rounded-2xl bg-white text-black"
          hitSlop={15}
          placeholder="Username"
          keyboardType='ascii-capable'
          value={username}
          autoCorrect={false}
          autoComplete='username-new'
          onChangeText={(newText) => setUsername(newText.replace(/ /g, ''))}
        />
        <View className="flex flex-row items-center w-64 p-3 mb-4 border border-gray-300 rounded-2xl bg-white">
          <TextInput
            hitSlop={15}
            className="flex-1 text-black"
            placeholder="Password"
            keyboardType='ascii-capable'
            value={password}
            autoCorrect={false}
            onChangeText={(newText) => setPassword(newText.replace(/ /g, ''))}
            secureTextEntry={hiddenPassword}
          />
          <TouchableOpacity onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={10}>
            <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center w-64 p-3 mb-4 border border-gray-300 rounded-2xl bg-white">
          <TextInput
            className="flex-1 text-black"
            placeholder="Confirm Password"
            keyboardType='ascii-capable'
            value={confirmPassword}
            onChangeText={(newText) => setConfirmPassword(newText.replace(/ /g, ''))}
            secureTextEntry={hiddenPassword}
          />
          <TouchableOpacity onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={5}>
            <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
          </TouchableOpacity>
        </View>
        {isLoading ?
          <ActivityIndicator size="small" color={'#ffffff'} />
          :
          <TouchableOpacity
            hitSlop={15}
            className="w-64 p-4 bg-white items-center rounded-2xl"
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text className="text-lightblue-500 font-bold">Next</Text>
          </TouchableOpacity>
        }
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={alertConfig.title}
          message={alertConfig.message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor={alertConfig.confirmButtonColor}
          onConfirmPressed={alertConfig.onConfirmPressed}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpStepOne;
