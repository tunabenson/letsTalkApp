import React  from 'react';
import { TouchableOpacity, Text, View, Pressable, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import CommentInput from '../posts/deprecated/CommentInput';

export const ForumHeader=()=>{
    return (
        <View
     
      className="m-2 p-4 bg-white rounded-lg shadow-lg"
    >
      {this.props.item.biasEvaluation ?
        (<BiasBar biasEvaluation={this.props.item.biasEvaluation} />)
        : null}
      <View className="absolute top-2 right-2 flex-row items-center">
        <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
          <Entypo name="dots-three-horizontal" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {!fromAccount && (
        <View className="flex-shrink-0">
          <Pressable
            hitSlop={15}
            className="w-48"
            onPress={() => navigation.navigate('Account', { uid, username: item.username })}
          >
            <Text className="text-lg font-semibold text-amber-700">@{item.username}</Text>
          </Pressable>
        </View>
      )}
      <Text className="absolute top-3 right-11 text-base font-bold text-black">#{item?.forum}</Text>
      <Text className="text-base text-gray-800 pb-2 mt-5">{item?.text}</Text>
      <Text className="text-sm text-gray-500 self-end">
        {new Date(item?.date?.seconds * 1000).toLocaleDateString()}
      </Text>

      <View className="flex-row items-center mt-2">
        <TouchableOpacity hitSlop={25} onPress={this.toggleLike} className="flex-row items-center mr-3">
          <FontAwesome name="thumbs-up" size={20} color={liked ? '#4CAF50' : 'gray'} />
          <Text className={`ml-1 text-sm ${liked ? 'text-green-500' : 'text-gray-500'}`}>{numLikes}</Text>
        </TouchableOpacity>

        <TouchableOpacity hitSlop={25} onPress={this.toggleDislike} className="flex-row items-center">
          <FontAwesome name="thumbs-down" size={20} color={disliked ? '#F44336' : 'gray'} />
          <Text className={`ml-1 text-sm ${disliked ? 'text-red-500' : 'text-gray-500'}`}>{numDislikes}</Text>
        </TouchableOpacity>
      </View>

      <CommentInput itemPath={item.id.concat()}/>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => this.setState({ modalVisible: false })}
      >
        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View className="bg-white p-4 rounded-lg w-11/12 mb-2">
              {/* Edit Option for Post Owner */}
              {isPostOwner && (
                <View>
                <TouchableOpacity
                  className="p-2 "
                  onPress={this.openEditModal}
                >
                  <Text className="text-blue-500 text-lg">Edit Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 mt-2"
                  onPress={this.confirmDelete}
                >
                  <Text className="text-blue-500 text-lg">Delete Post</Text>
                </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                className="p-2 mt-2"
                onPress={this.reportPost}
              >
                <Text className="text-red-500 text-lg">Report Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 mt-2"
                onPress={() => this.setState({ modalVisible: false })}
              >
                <Text className="text-gray-600 text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => this.setState({ editModalVisible: false })}
      >
        <TouchableWithoutFeedback onPress={() => this.setState({ editModalVisible: false })}>
          <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
            <View className="w-64 bg-white rounded-lg p-4">
              <TextInput
                value={editText}
                onChangeText={this.handleEditChange}
                placeholder="Edit your post"
                className="border border-gray-300 rounded-md p-2 mb-4"
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity onPress={this.saveEdit} className="bg-blue-500 rounded-md p-2">
                <Text className="text-center text-white font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
export default ForumHeader;
