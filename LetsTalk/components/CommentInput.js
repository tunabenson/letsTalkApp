import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const CommentInput = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-inherit "
    >
      <View className="flex-row items-center bg-white p-2 mt-10 rounded-lg shadow">
        <TextInput
          className="flex-1 p-2 border border-gray-300 rounded-2xl"
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
          multiline
          blurOnSubmit={true}
        />
        <TouchableOpacity
          className="ml-2 p-2 bg-lightblue-500 rounded-2xl"
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <FontAwesome name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentInput;
