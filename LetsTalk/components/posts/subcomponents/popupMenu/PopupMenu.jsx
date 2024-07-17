import React, { useState, useRef, useEffect } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { auth, deletePost, fetchLikeDislikeCounts } from '../../../../api/firebaseConfig';
import AwesomeAlert from 'react-native-awesome-alerts';
import PopupOption from '../../../utility/Option';
import Option from '../../../utility/Option';
import MoreInfoPopup from './MoreInfoPopup';

function PopupMenu({ modalVisible, text, isUser, onClose, path , requestInfo }) {

  const [visible, setVisible] = useState(modalVisible);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editText, setEditText] = useState(text);
  const [playAnimationReport, setPlayAnimationReport] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});
  const [infoScreenVisible, setInfoScreenVisible] = useState(false);
  const [infoScreenConfig, setInfoScreenConfig] = useState();

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
    setVisible(false);

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
          await deletePost(path);
          onClose();
        } catch (error) {
          console.error('Error deleting post:', error);
          setAlertConfig({
            show: true,
            title: 'Error',
            message: 'There was an error deleting your post. Please try again.',
            showConfirmButton: true,
            confirmText: 'OK',
            confirmButtonColor: '#DD6B55',
            onConfirmPressed: () => {setShowAlert(false); onClose()}
          });
          setShowAlert(true);
        }
      }
    });
    setShowAlert(true);
  };



  const handleMoreInfo=async()=>{
    setVisible(false);
    const data= await fetchLikeDislikeCounts(path);
    const additional=requestInfo()
    
    setInfoScreenConfig({likes:data.likes, dislikes:data.dislikes, author: additional.author, editDate: additional.editDate});
    setInfoScreenVisible(true);
  }

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
                        <Option style='p-2 flex-row'
                         handler={()=>{setVisible(false);setEditModalVisible(true)}}
                        icon={<FontAwesome5 name="edit" size={24} color="blue" />}
                        text='Edit Post'
                        textStyle='text-blue-600 text-xl font-semibold ml-2'
                        />

                        <Option style='p-2 mt-2 flex-row'
                         handler={()=>handleDelete()}
                        icon={<FontAwesome5 name="trash" size={24} color="red" />}
                        text='Delete Post'
                        textStyle='text-red-600 text-xl font-semibold ml-2'
                        />
                      </View>
                    )}
                      <Option style='p-2 mt-2 flex-row'
                         handler={()=>reportPost()}
                        icon={<FontAwesome5 name="flag" size={24} color="red" />}
                        text='Report Post'
                        textStyle='text-red-600 text-xl font-semibold ml-2'
                    />
                    <Option style='p-2 mt-2 flex-row'
                         handler={()=>handleMoreInfo()}
                        icon={<FontAwesome name="info-circle" size={24} color="gray" />}
                        text='More Information'
                        textStyle='text-gray-500 text-xl font-semibold ml-2'
                    />

                    <Option style='p-2 mt-1 flex-row'
                         handler={()=>handleClose()}
                        icon={<FontAwesome name="close" size={24} color="gray" />}
                        text='Cancel'
                        textStyle='text-gray-600 text-xl font-semibold ml-2'
                      />
                  </View>
                ) : (
                  <LottieView
                    autoPlay={true}
                    source={require('../../../../assets/animations/report-animation.json')}
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
        onRequestClose={() => onClose()}
      >
        <TouchableWithoutFeedback onPress={() => onClose()}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <View className="bg-white p-4 rounded-lg w-11/12 mb-2">
              <TextInput
                value={editText}
                onChangeText={(text) => setEditText(text)}
                placeholder="Edit your post"
                className="border border-gray-300 rounded-md p-2 mb-4"
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity onPress={saveEdit} className="bg-lightblue-500 rounded-md p-2">
                <Text className="text-center text-white font-medium">Save</Text>
              </TouchableOpacity>
              {/** TODO: add posting animation */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>





{infoScreenConfig && (      <MoreInfoPopup infoScreenConfig={infoScreenConfig} onClose={onClose} infoScreenVisible={infoScreenVisible}/>
)}
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
