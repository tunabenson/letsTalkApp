import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { setDoc, Timestamp, doc } from 'firebase/firestore';
import { auth, db, uploadImageForUser } from '../../../api/firebaseConfig';
import { storage } from '../../../api/firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';

const SignUpStepThree = ({ navigation, route }) => {
  const { email, username, password, selectedForums } = route.params;
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  useEffect(() => {
    (async () => {
        const {granted}= await ImagePicker.getMediaLibraryPermissionsAsync();
        if(!granted){
            ImagePicker.requestMediaLibraryPermissionsAsync();
        }

    })();
  }, []);



  const selectImage = async () => {
    let response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
      base64: true
    });
    if (!response.canceled) {
      setProfilePicture(response.assets[0]);
    }
  };

  const loadImagetoUser = async () => {
    try {
      if (profilePicture) {
        uploadImageForUser(profilePicture.base64);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadDataToUser = async () => {
    try {
      Keyboard.dismiss();
      setIsSubmitted(true);
      await createUserWithEmailAndPassword(auth, email, password); //Now in authenticated state
      const user = auth.currentUser;
      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        joinDate: Timestamp.now(),
        interests: selectedForums,
        bio: bio,
        url: " ",
      });
      await loadImagetoUser();
      await signOut(auth);
      navigation.navigate("LoginPage");
    } catch (error) {
      console.log(error.message);
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'There was an error during the sign-up process. Please try again.',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View className="flex-1 justify-center items-center bg-lightblue-500 p-4">
        <Text className="text-white text-3xl mb-8 font-semibold">Sign Up - Step 3</Text>
        <TouchableOpacity onPress={selectImage} className="mb-4">
          {profilePicture ? (
            <Image source={{ uri: profilePicture.uri }} className="w-32 h-32 rounded-full" />
          ) : (
            <View className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <FontAwesome name="camera" size={32} color="white" />
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          className="w-64 p-3 mb-4 border border-gray-300 rounded-2xl bg-white text-black"
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          blurOnSubmit={true}
        />
        {isSubmitted ?
          <ActivityIndicator size="small" color={'#ffffff'} />
          :
          <TouchableOpacity
            className="w-full p-4 rounded-2xl bg-white text-lightblue-500 items-center"
            onPress={loadDataToUser}
          >
            <Text className="text-lightblue-500">Sign Up</Text>
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

export default SignUpStepThree;
