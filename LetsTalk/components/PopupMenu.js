import React, { useState, useRef, useEffect } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { deletePost } from '../api/firebaseConfig';
import AwesomeAlert from 'react-native-awesome-alerts';

function PopupMenu({ modalVisible, text, isUser, onClose, postId }) {
  const [visible, setVisible] = useState(modalVisible);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editText, setEditText] = useState(text);
  const [playAnimationReport, setPlayAnimationReport] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const handleClose = () => {
    onClose();
  };

  const reportPost = async () => {
    
    setPlayAnimationReport((prev) => !prev);
    setTimeout(() => {onClose()}, 2000); // delay to allow animation to play
  };

  const saveEdit = async () => {
    if (!editText.trim()) {
      setAlertConfig({
        show: true,
        title: 'Validation Error',
        message: 'Post content cannot be empty.',
        showConfirmButton: true,
        confirmText: 'OK',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
      return;
    }

    // Simulate API call
    try {
      successAnimationRef.current.play();
      setTimeout(() => setEditModalVisible(false), 2000); // delay to allow animation to play
      setAlertConfig({
        show: true,
        title: 'Post Updated',
        message: 'Your post has been updated successfully.',
        showConfirmButton: true,
        confirmText: 'OK',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Error updating post:', error);
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'There was an error updating your post. Please try again.',
        showConfirmButton: true,
        confirmText: 'OK',
        confirmButtonColor: '#DD6B55',
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
    }
  };

  const handleDelete = async () => {
    setAlertConfig({
      show: true,
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this post?',
      showCancelButton: true,
      showConfirmButton: true,
      cancelText: 'Cancel',
      confirmText: 'Delete',
      confirmButtonColor: '#DD6B55',
      onCancelPressed: () => setShowAlert(false),
      onConfirmPressed: async () => {
        try {
          await deletePost(postId);
          setVisible(false);
        } catch (error) {
          console.error('Error deleting post:', error);
          setAlertConfig({
            show: true,
            title: 'Error',
            message: 'There was an error deleting your post. Please try again.',
            showConfirmButton: true,
            confirmText: 'OK',
            confirmButtonColor: '#DD6B55',
            onConfirmPressed: () => setShowAlert(false)
          });
          setShowAlert(true);
        }
      }
    });
    setShowAlert(true);
  };

  return (
    <View>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
      >
        <TouchableWithoutFeedback>
          <View className="flex-1">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <View className="bg-white p-4 rounded-lg w-11/12 mb-2">
                {!playAnimationReport ? (
                  <View>
                    {isUser && (
                      <View>
                        <TouchableOpacity className="p-2 flex-row" onPress={() => setEditModalVisible(true)}>
                          <FontAwesome5 name="edit" size={24} color="blue" />
                          <Text className="text-blue-600 text-xl font-semibold ml-2">Edit Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2 mt-2 flex-row" onPress={handleDelete}>
                          <FontAwesome5 name="trash" size={24} color="red" />
                          <Text className="text-red-600 text-lg font-semibold ml-2"> Delete Post</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <TouchableOpacity className="p-2 mt-2 flex-row" onPress={reportPost}>
                      <FontAwesome5 name="flag" size={24} color="red" />
                      <Text className="text-red-600 text-lg font-semibold ml-2"> Report Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 mt-2 flex-row" onPress={handleClose}>
                      <FontAwesome name="close" size={24} color="gray" />
                      <Text className="text-gray-600 text-lg font-semibold ml-4">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <LottieView
                    autoPlay={true}
                    source={require('../animations/report-animation.json')}
                    loop={false}
                    style={{ width: 150, height: 150, alignSelf: 'center' }}
                  />
                )}
              </View>
            </View >
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
            <View className="w-64 bg-white rounded-lg p-4">
              <TextInput
                value={editText}
                onChangeText={(text) => setEditText(text)}
                placeholder="Edit your post"
                className="border border-gray-300 rounded-md p-2 mb-4"
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity onPress={saveEdit} className="bg-blue-500 rounded-md p-2">
                <Text className="text-center text-white font-medium">Save</Text>
                <LottieView
                  autoPlay={true}
                  source={require('../animations/loading-animation.json')}
                  loop={false}
                  style={{ width: 100, height: 100 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertConfig.title}
        message={alertConfig.message}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={alertConfig.showCancelButton}
        showConfirmButton={alertConfig.showConfirmButton}
        cancelText={alertConfig.cancelText}
        confirmText={alertConfig.confirmText}
        confirmButtonColor={alertConfig.confirmButtonColor}
        onCancelPressed={alertConfig.onCancelPressed}
        onConfirmPressed={alertConfig.onConfirmPressed}
      />
    </View>
  );
}

export default PopupMenu;
