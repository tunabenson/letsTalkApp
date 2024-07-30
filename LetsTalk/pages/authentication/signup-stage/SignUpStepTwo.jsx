import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

const SignUpStepTwo = ({ navigation, route }) => {
  const [selectedForums, setSelectedForums] = useState([]);
  const { email, username, password } = route.params;
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

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

  const onNext = () => {
    if (selectedForums.length < 3) {
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'Please select at least 3 interests',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
      return;
    }
    Keyboard.dismiss();
    navigation.navigate('SignUpPage3', { email, username, password, selectedForums });
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-lightblue-500 p-4">
      <Text className="text-white text-3xl mt-5 font-semibold">Select Your Interests</Text>
      <FlatList className='flex-auto'
        data={forums}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 m-2 rounded-full ${
              selectedForums.includes(item) ? 'bg-white' : 'bg-gray-400'
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
          selectedForums.length >= 3 ? 'bg-white' : 'bg-gray-400'
        }`}
        onPress={onNext}
        activeOpacity={selectedForums.length >= 3 ? 0.7 : 1}
      >
        <Text className={`text-center ${selectedForums.length >= 3 ? 'text-lightblue-500' : 'text-gray-700'}`}>
          Next
        </Text>
      </TouchableOpacity>
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
    </SafeAreaView>
  );
};

export default SignUpStepTwo;
