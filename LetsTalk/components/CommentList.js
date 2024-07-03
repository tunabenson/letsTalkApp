import React, { PureComponent } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import Comment from './Comment';

// Example data for comments
let commentsData = [];

class CommentList extends PureComponent {
  render() {
    return (
      <KeyboardAvoidingView     
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-row self-stretch content-stretch w-96 bg-lightblue-500 p-5"
      >
        <FlatList
          contentContainerStyle={{ width: 384, alignItems: 'stretch' }}
          data={commentsData}
          renderItem={({ item }) => <Comment key={item.id} comment={item} />}
          keyExtractor={item => item.id}
        />
      </KeyboardAvoidingView>
    );
  }
}

export default CommentList;
