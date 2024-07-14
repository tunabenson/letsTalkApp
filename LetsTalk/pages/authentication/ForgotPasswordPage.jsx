import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../api/firebaseConfig';

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent. Check your inbox.');
      navigation.goBack(); // Navigate back after successful request
    } catch (error) {
      console.error('Password reset error:', error.message);
      Alert.alert('Error', 'There was an error sending the password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-lightblue-500 p-4">
        {/* Back Arrow */}
        <TouchableOpacity
          className="absolute top-10 left-5"
          onPress={() => navigation.goBack()}
          hitSlop={20}
        >
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-white text-3xl mb-8 font-semibold">Reset Password</Text>

        <TextInput
          hitSlop={20}
          className="w-64 p-3 mb-4 border border-gray-300 rounded-2xl text-blackraisin-100 bg-white"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          className="w-64 p-4 rounded-2xl bg-white items-center"
          onPress={handlePasswordReset}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <Text className="text-lightblue-500 font-bold">Sending...</Text>
          ) : (
            <Text className="text-lightblue-500 font-bold">Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordPage;
