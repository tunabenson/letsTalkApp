import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Pressable} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import  FontAwesome from '@expo/vector-icons/FontAwesome';
import { auth, app } from '../api/firebase';
import { createUserWithEmailAndPassword } from '@react-native-firebase/auth';


const SignUpPage1 = ({navigation}) => {

  const [name, setName] = useState('');
  const [email, setEmail]= useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hiddenPassword, setHiddenPassword]=useState(true);

  const handleNext = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    navigation.navigate('SignUpPage2', { name, email,username, password });
  };

  return (
    <View className="flex-1 justify-center items-center bg-lightblue-500 p-4">
    <Text className="text-white text-3xl mb-8 font-semibold">Sign Up</Text>
    <TextInput
      className="w-64 p-3 mb-3 border border-gray-300 rounded bg-white text-black"
      placeholder="Name"
      value={name}
      onChangeText={(newText) => setName(newText)}
    />
     <TextInput
      className="w-64 p-3 mb-3 border border-gray-300 rounded bg-white text-black"
      placeholder="Email"
      value={email}
      onChangeText={(newText) => setEmail(newText)}
    />
    <TextInput
      className="w-64 p-3 mb-3 border border-gray-300 rounded bg-white text-black"
      placeholder="Username"
      value={username}
      onChangeText={(newText) => setUsername(newText.replace(/ /g, ''))}
    />
    <View className="flex flex-row items-center w-64 p-3 mb-4 border border-gray-300 rounded bg-white">
      <TextInput
        className="flex-1 text-black"
        placeholder="Password"
        value={password}
        onChangeText={(newText) => setPassword(newText.replace(/ /g, ''))}
        secureTextEntry={hiddenPassword}
      />
      <Pressable onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={5}>
        <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
      </Pressable>
    </View>
    <View className="flex flex-row items-center w-64 p-3 mb-4 border border-gray-300 rounded bg-white">
      <TextInput
        className="flex-1 text-black"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(newText) => setConfirmPassword(newText.replace(/ /g, ''))}
        secureTextEntry={hiddenPassword}
      />
      <Pressable onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={5}>
        <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
      </Pressable>
    </View>
    <TouchableOpacity
      className="w-64 p-4 rounded bg-white items-center"
      onPress={handleNext}
      activeOpacity={0.7}
    >
      <Text className="text-lightblue-500 font-bold">Next</Text>
    </TouchableOpacity>
  </View>
  );
};

const SignUpPage2 = ({navigation, route}) => {
  const { name, email, username, password } = route.params;
  const [selectedForums, setSelectedForums] = useState([]);

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
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //   });

  //   return () => unsubscribe();
  // }, [auth]);

  const handleFinish = async ({email, password}) => {
    if (selectedForums.length >= 3) {
       try{
       await createUserWithEmailAndPassword(auth, email, password)
       .then((userCredential)=>{
        const user=userCredential.user;
        console.log(user);
       })
      // Proceed to the next step or complete the signup process
      Alert.alert('Success', 'Sign up complete!' ,[{text:'OK', onPress:()=>navigation.replace('LoginPage')}] );
       }catch(e){
        Alert.alert('Error with writing', 'sorry')
       }
    }
  };

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
        onPress={()=>handleFinish({username,password})}
        activeOpacity={selectedForums.length >= 3 ? 0.7 : 1}
        disabled={selectedForums.length < 3}
      >
        <Text className={`text-center ${selectedForums.length >= 3 ? 'text-lightblue-500' : 'text-gray-700'}`}>
          Finish
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export { SignUpPage1, SignUpPage2 };
