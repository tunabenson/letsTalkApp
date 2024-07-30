import React, { PureComponent, createRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CommentInput from './CommentInput';

 /**
  * a component to render responses to posts 
  * @deprecated as of 7/11/2024, use post component to sub
  */


class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSubComments: false,
      liked: false,
      disliked: false,
      showReplyInput: false,
      replyContent: ''
    };
    //this.replyInputRef = createRef();
  }

  handleLike = () => {
    this.setState(prevState => ({
      liked: !prevState.liked,
      disliked: false
    }));
  };

  handleDislike = () => {
    this.setState(prevState => ({
      disliked: !prevState.disliked,
      liked: false
    }));
  };

  toggleReplyInput = () => {
    this.setState(
      prevState => ({ showReplyInput: !prevState.showReplyInput }),
      () => {
        if (this.state.showReplyInput) {
        } else {
          Keyboard.dismiss();
        }
      }
    );
  };

  handleReply = () => {
    console.log('Reply submitted:', this.state.replyContent);
    this.setState({ showReplyInput: false, replyContent: '' });
    Keyboard.dismiss();
  };

  render() {
    const { comment, depth = 0 } = this.props;
    const { showSubComments, liked, disliked, showReplyInput, replyContent } = this.state;

    return (
      <View className='bg-inherit flex-1'>
        <View className={`p-3 bg-white rounded-2xl shadow-md m-2 ml-${depth * 4} ml w-96 max-w-2xl`}>
          <View className="flex-row mb-1">
            <Text className="font-semibold text-black">@{comment.username}</Text>
            <Text className="text-xs text-gray-500 ml-2">{comment.timestamp}</Text>
          </View>
          <Text className="text-gray-800 mb-1">{comment.content}</Text>
          <View className="flex-row mt-2 items-center space-x-4">
            {/* Like button */}
            <TouchableOpacity className="flex-row items-center" onPress={this.handleLike}>
              <FontAwesome name="thumbs-up" size={16} color={liked ? 'green' : 'gray'} />
            </TouchableOpacity>

            {/* Dislike button */}
            <TouchableOpacity className="flex-row items-center" onPress={this.handleDislike}>
              <FontAwesome name="thumbs-down" size={16} color={disliked ? 'red' : 'gray'} />
            </TouchableOpacity>

            {/* Reply button */}
            <TouchableOpacity onPress={this.toggleReplyInput} className="flex-row items-center">
              <FontAwesome name="reply" size={16} color="gray" />
              <Text className="ml-1 text-gray-500 text-xs">Reply</Text>
            </TouchableOpacity>

            {/* Toggle SubComments */}
            {comment.subComments?.length > 0 && (
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => this.setState({ showSubComments: !showSubComments })}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name={showSubComments ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="gray"
                />
                <Text className="ml-1 text-gray-500 text-xs">
                  {showSubComments ? 'Hide' : 'View'} {comment.subComments.length} {comment.subComments.length > 1 ? 'Replies' : 'Reply'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Reply Input */}
          {showReplyInput && (
            <CommentInput
              value={replyContent}
              onChangeText={text => this.setState({ replyContent: text })}
              //ref={this.replyInputRef}
            />
          )}
        </View>

        {/* Render SubComments */}
        {showSubComments && (
          <FlatList
            data={comment.subComments}
            contentContainerStyle={{ flex: 2, width: 400, alignItems: 'stretch' }}
            renderItem={({ item }) => <Comment key={item.id} comment={item} depth={depth + 2} />}
            keyExtractor={item => item.id}
            nestedScrollEnabled
          />
        )}
      </View>
    );
  }
}

export default Comment;
