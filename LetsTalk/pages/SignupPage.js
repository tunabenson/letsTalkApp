import React, { useState }from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Pressable, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Image, Linking} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  FontAwesome from '@expo/vector-icons/FontAwesome';
import { db,auth, storage, usersRef, uploadImageForUser } from '../api/firebaseConfig';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, sendEmailVerification, signInWithCredential, signOut, updateProfile } from 'firebase/auth';
import { setDoc, Timestamp, doc, query, where, getDocs, collection, limit, getDoc} from 'firebase/firestore';
import  * as ImagePicker from 'expo-image-picker'
import {  ref, uploadBytes } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';



const SignUpStepOne = ({navigation}) => {

  const [name, setName] = useState('');
  const [email, setEmail]= useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hiddenPassword, setHiddenPassword]=useState(true);
  const [isLoading, setIsLoading]= useState(false);



  const checkInputsValid=async()=>{
    setUsername(username.toLowerCase())
    const userCheck = doc(db, "users", username);
    const querySnapshot = await getDoc(userCheck);
   if(querySnapshot.exists()){
        Alert.alert('Error', "username Taken");
        return false;
    };
    // const emailExists= await fetchSignInMethodsForEmail(auth, );
    // console.log(emailExists)
    // if(emailExists.length>0){
    //   Alert.alert('Error', 'Email is already in use');
    //   return false;
    // }
    return true;
  }
  
  const handleNext =  async() => {
    Keyboard.dismiss();
    try{
    if (password !== confirmPassword ) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if(!name || !email || !username || !password || !confirmPassword){
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setIsLoading(true);
    const valid= await checkInputsValid();
    if(valid){
      navigation.navigate('SignUpPage2', {name ,email, username, password}); //perhaps add name decide if you want that 
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  
    }catch(e){
      setIsLoading(false);   
        console.log(e.message);
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex:1 }}>
      <View className="flex-1 justify-center items-center bg-lightblue-500 p-4">
    <Text className="text-white text-3xl mb-15  font-semibold">Sign Up</Text>
    <TextInput
      className="w-64 p-3 mb-3 mt-5 border border-gray-300 rounded-2xl bg-white text-black"
      hitSlop={15}
      placeholder="Full Name"
      value={name}
      onSubmitEditing={()=>Keyboard.dismiss()}
      autoCorrect={false}
      onChangeText={(newText) => setName(newText)}
    />
     <TextInput
      className="w-64 p-3 mb-3 border border-gray-300 rounded-2xl bg-white text-black"
      hitSlop={15}
      placeholder="Email"
      keyboardType='email-address'
      value={email}
      autoCorrect={false}
      onSubmitEditing={()=>Keyboard.dismiss()}
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
      <Pressable onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={10}>
        <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
      </Pressable>
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
      <Pressable onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={5}>
        <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
      </Pressable>
    </View>
    { isLoading?
      <ActivityIndicator size="small" color={'#ffffff'}/>
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
    </View>
</KeyboardAvoidingView>
  );
};

const SignUpStepTwo = ({navigation, route}) => {
  const [selectedForums, setSelectedForums] = useState([]);
  const {name, email,username, password}=route.params;

  const forums = [
    'Abortions', 'General', 'Health', 'Technology', 'Lifestyle', 'Politics', 'Science',
    'Climate Change', 'Gun Control', 'Immigration', 'Healthcare Reform', 'Education Policy',
    'Economic Inequality', 'Technology and Privacy', 'Free Speech', 'Globalization',
    'Social Media', 'Death Penalty', 'Artificial Intelligence', 'Censorship', 'Veganism',
  ];

  const toggleForumSelection = (forum) => {
    setSelectedForums((prev) =>
      prev.includes(forum) ? prev.filter((f) => f !== forum) : [...prev, forum]
    );
  };

  
  const onNext=()=>{
    Keyboard.dismiss();
    navigation.navigate('SignUpPage3', {name,email,username,password,selectedForums})
  }

  //TODO fetch from firebase forums instead of auto provider!
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-lightblue-500 p-4">
      <Text className="text-white text-3xl mt-5 font-semibold">Select Your Interests</Text>
      <FlatList className='flex-auto '
        data={forums} 
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 m-2 rounded-full ${
              selectedForums.includes(item) ? 'bg-white' : 'bg-gray-300'
            }`}
            hitSlop={10}
            onPress={() => toggleForumSelection(item)}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center ${
                selectedForums.includes(item) ? 'text-lightblue-500' : 'text-gray-700'
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={{ alignItems: 'center' }}
      />
      <TouchableOpacity
        className={`w-64 p-4 rounded mt-2 ${
          selectedForums.length >= 3 ? 'bg-white' : 'bg-gray-300'
        }`}
        onPress={()=>onNext()}
        activeOpacity={selectedForums.length >= 3 ? 0.7 : 1}
        disabled={selectedForums.length < 3}
      >
        <Text className={`text-center ${selectedForums.length >= 3 ? 'text-lightblue-500' : 'text-gray-700'}`}>
          Next
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
    
  );


};

const SignUpStepThree = ({navigation, route}) => {
  
  const {name,email,username,password,selectedForums} = route.params;
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState();
  const [isSubmitted, setIsSubmitted]= useState(false);

  const selectImage = async () => {
    let response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });
    if (!response.canceled) {
        setProfilePicture(response.assets[0]);
      }
    };
  
  const loadImagetoUser=async()=>{
    try {
    if(profilePicture){
      await uploadImageForUser(profilePicture.base64);
    }
    } catch (error) {
      console.log(error);
    }
  }
  
  const loadDataToUser=async()=>{
        try {
        Keyboard.dismiss();
        setIsSubmitted(true);
        navigation.navigate("LoginPage");
        await createUserWithEmailAndPassword(auth, email, password);
        const user= auth.currentUser;
        await updateProfile(user, {displayName:username})
        await setDoc(doc(db, 'users', user.uid), {
                name:name, 
                username:username, 
                joinDate: Timestamp.now(),
                interests:selectedForums,
                bio:bio,
                url:" ",
          });
          await loadImagetoUser();
          await sendEmailVerification(user);
          signOut(auth);
        } catch (error) {
          
          console.log(error.message);
        }
  }

  return (
    
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex:1 }}>
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
        { isSubmitted?
      <ActivityIndicator size="small" color={'#ffffff'}/>
      :
      <TouchableOpacity
        className="w-full p-4 rounded-2xl bg-white text-lightblue-500 items-center"
        onPress={() => loadDataToUser({navigation})}
      >
        <Text className="text-lightblue-500">Sign Up</Text>
      </TouchableOpacity>
      }
    </View>
    </KeyboardAvoidingView>
  );
};



const Stack = createStackNavigator();

const SignUpPage = () => {
  return (
    <Stack.Navigator  id={'5'}  screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUpPage1" component={SignUpStepOne} />
      <Stack.Screen name="SignUpPage2" component={SignUpStepTwo} />
      <Stack.Screen name="SignUpPage3" component={SignUpStepThree}/>
    </Stack.Navigator>
  );
};

export default SignUpPage;
