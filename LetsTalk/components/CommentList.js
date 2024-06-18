import React, { PureComponent } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import Comment from './Comment';

// Example data for comments
const commentsData = [
  {
    id: '1',
    username: 'john_doe',
    content: 'This is the first comment with sub-comments.',
    timestamp: '2 hours ago',
    subComments: [
      {
        id: '1-1',
        username: 'jane_doe',
        content: 'This is a sub-comment.',
        timestamp: '1 hour ago',
        subComments: [
          {
            id: '1-1-1',
            username: 'alice_smith',
            content: 'This is a nested sub-comment.',
            timestamp: '30 minutes ago',
            subComments: [
              {
                id: '1-1-1-1',
                username: 'bob_johnson',
                content: 'Another level of nesting.',
                timestamp: '15 minutes ago',
                subComments: [], // This can go on infinitely
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    username: 'jane_smith',
    content: 'This is another comment without sub-comments.',
    timestamp: '1 day ago',
    subComments: [],
  },
  // Add more comments as needed
];

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
