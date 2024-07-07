import React, { PureComponent } from 'react';
import { TouchableOpacity, Text, View, Pressable, Modal, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { Timestamp, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, deletePost } from '../api/firebaseConfig';
import { updateLikesInFirebase, updateDislikesInFirebase } from '../api/DocumentFetcher'; // Import the helper functions
import CommentInput from './CommentInput';
import { fetchLikeDislikeCounts } from '../api/DocumentFetcher';
import BiasBar from './BiasBar';

class Post extends PureComponent {
  constructor(props) {
    super(props);
    if(props.fromSearch){
        this.id=props.item.objectID;
    }
    else{
      this.id=props.item.id;
    }
    this.state = {
      liked: false,
      disliked: false,
      numLikes: props.item.likeCount,
      numDislikes: props.item.dislikeCount,
      modalVisible: false,
      editModalVisible: false,
      editText: props.item.text,
    };
  }

  getDislikedStatus = async () => {
    try {
      const docSnapshot = await getDoc(doc(db, 'posts', this.id, 'dislikes', auth.currentUser.displayName));
      return docSnapshot.exists();
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  getLikedStatus = async () => {
    try {
      const docSnapshot = await getDoc(doc(db, 'posts', this.id, 'likes', auth.currentUser.displayName));
      return docSnapshot.exists();
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  async componentDidMount() {
    try {
      if (this.props?.fullScreen) {
        this.setState({ liked: this.props.liked, disliked: this.props.disliked });
      } else {
        const liked = await this.getLikedStatus();
        const disliked = await this.getDislikedStatus();
        this.setState({ liked, disliked });
      }
    } catch (error) {
      console.error('Error fetching initial like/dislike status:', error);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.liked !== prevState.liked || this.state.disliked !== prevState.disliked) {
      try {
        const { likes, dislikes } = await fetchLikeDislikeCounts(this.id);
        this.setState({
          numLikes: likes,
          numDislikes: dislikes,
        });
      } catch (error) {
        console.error('Error updating like/dislike counts:', error);
      }
    }
  }

  toggleLike = () => {
    const { liked, disliked, numLikes } = this.state;

    if (liked) {
      this.setState({ liked: false, numLikes: prev.numLikes - 1 }, () => {
        updateLikesInFirebase({ liked: false, id: this.props.item.id, displayName: auth.currentUser.displayName });
      });
    } else {
      this.setState({ liked: true, numLikes: numLikes + 1 }, () => {
        updateLikesInFirebase({ liked: true, id: this.props.item.id, displayName: auth.currentUser.displayName });
      });

      if (disliked) {
        this.setState({ disliked: false, numDislikes: this.state.numDislikes - 1 }, () => {
          updateDislikesInFirebase({ disliked: false, id: this.props.item.id, displayName: auth.currentUser.displayName });
        });
      }
    }
  };

  // Toggle dislike status
  toggleDislike = () => {
    const { liked, disliked, numDislikes } = this.state;

    if (disliked) {
      this.setState({ disliked: false, numDislikes: numDislikes - 1 }, () => {
        updateDislikesInFirebase({ disliked: false, id: this.props.item.id, displayName: auth.currentUser.displayName });
      });
    } else {
      this.setState({ disliked: true, numDislikes: numDislikes + 1 }, () => {
        updateDislikesInFirebase({ disliked: true, id: this.props.item.id, displayName: auth.currentUser.displayName });
      });

      if (liked) {
        this.setState({ liked: false, numLikes: this.state.numLikes - 1 }, () => {
          updateLikesInFirebase({ liked: false, id: this.props.item.id, displayName: auth.currentUser.displayName });
        });
      }
    }
  }; 

 
  reportPost = async () => {
    this.setState({ modalVisible: false });
    //setDoc(doc(db, "reports", this.id.concat('-', auth.currentUser.displayName)), { reasonForReport: "testing waters for now" });
  };

  // Open Edit Modal
  openEditModal = () => {
    this.setState({ modalVisible: false, editModalVisible: true });
  };

  // Handle text change in edit 
  handleEditChange = (text) => {
    this.setState({ editText: text });
  };

  // Save edited post to Firestore
  saveEdit = async () => {
    const { editText } = this.state;
    const { item } = this.props;

    // Ensure editText is not empty
    if (!editText.trim()) {
      Alert.alert('Validation Error', 'Post content cannot be empty.');
      return;
    }

    try {
      // Update the post content in Firestore
      await updateDoc(doc(db, 'posts', item.id), {
        text: editText,
        editedAt: Timestamp.now(), // Add an edited timestamp
      });

      // Close the edit modal
      this.setState({ editModalVisible: false });

      // Optional: Alert the user
      Alert.alert('Post Updated', 'Your post has been updated successfully.');
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'There was an error updating your post. Please try again.');
    }
  };

  confirmDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(this.id);
              this.setState({modalVisible:false})
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'There was an error deleting your post. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  

  render() {
    const { item, navigation, fromAccount, fromSearch } = this.props;
    const { liked, disliked, numLikes, numDislikes, modalVisible, editModalVisible, editText } = this.state;
    const uid = item?.uid;
    const isPostOwner = auth.currentUser && item.username === auth.currentUser.displayName;

    const navTo = () =>{
      if(fromAccount!==undefined){
        return fromAccount ? 'Full-Post' : 'Post'
      }
      else {
        return 'postPage'
      }
    }

    return (
      <TouchableOpacity
        disabled={this.props?.disabled}
        className="m-2 p-4 bg-white border border-lightblue-500 rounded-lg shadow-lg"
        onPress={() => navigation.navigate(navTo(), { item, liked, disliked })}
        activeOpacity={0.7}
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
          {!this.props.fromSearching?new Date(item?.date?.seconds * 1000).toLocaleDateString():item.date.toLocaleDateString()}
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

       


        {fromSearch?(null):
        
        (  
        <View>
        <CommentInput itemPath={item.id}/>
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
        )
      }
      </TouchableOpacity>
    );
  }
}

export default Post;
