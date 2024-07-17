import LottieView from 'lottie-react-native';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';

function MoreInfoPopup({ infoScreenConfig, infoScreenVisible, onClose }) {
  return (
    <Modal transparent={true} visible={infoScreenVisible}>
      <TouchableWithoutFeedback onPress={onClose} >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="bg-white p-5 rounded-xl shadow-lg max-w-11/12 m-4">
          <View className="flex-row justify-between items-center mb-5">
            <Text className='text-4xl font-bold'>More Info</Text>
          </View>
          <View className="flex-row justify-start items-center mb-5">
            <LottieView
              source={require('../../../../assets/animations/likeAnimation.json')}
              autoPlay
              loop={false}
              style={{ width: 40, height: 40, marginBottom:8 }}
            />
            <Text className='text-2xl text-green-600 font-semibold ml-2'>{infoScreenConfig?.likes}</Text>
            <LottieView
              source={require('../../../../assets/animations/dislikeAnimation.json')}
              autoPlay
              loop={false}
              style={{ width: 80, height: 80, marginTop:12 }}
            />
            <Text className='text-2xl text-red-600 font-semibold ml-2'>{infoScreenConfig?.dislikes}</Text>
          </View>
          <View className="flex-row justify-start items-center mb-5">
            <Text className="text-2xl font-medium">Last Edited:</Text>
            <Text className="text-xl pl-4">{new Date(infoScreenConfig?.editDate?.seconds * 1000 + infoScreenConfig?.editDate?.nanoseconds / 1000000).toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-start mb-5">
            <Text className="text-2xl font-medium">Author:</Text>
            <Text className="text-2xl pl-2">{infoScreenConfig?.author}</Text>
          </View>
        </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default MoreInfoPopup;