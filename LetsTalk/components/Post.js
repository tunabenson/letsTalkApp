import React, { PureComponent } from 'react';
import { TouchableOpacity, Text, View, Pressable, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Timestamp, collection, getCountFromServer, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../api/firebaseConfig';
import CommentInput from './CommentInput';

class Post extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      disliked: false,
      numLikes: 0,
      numDislikes: 0
    };
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  // Fetch the liked status from Firestore
  getLikedStatus = async () => {
    try {
      const docSnapshot = await getDoc(doc(db, 'posts', this.props.item.id, 'likes', auth.currentUser.uid));
      return docSnapshot.exists();
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  // Fetch the disliked status from Firestore
  getDislikedStatus = async () => {
    try {
      const docSnapshot = await getDoc(doc(db, 'posts', this.props.item.id, 'dislikes', auth.currentUser.uid));
      return docSnapshot.exists();
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  // Fetch number of likes from Firestore
  getNumLikes = async () => {
    try {
      const coll = collection(db, 'posts', this.props.item.id, 'likes');
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  };

  // Fetch number of dislikes from Firestore
  getNumDislikes = async () => {
    try {
      const coll = collection(db, 'posts', this.props.item.id, 'dislikes');
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  };

  // Fetch initial like/dislike status and counts
  fetchInitialData = async () => {
    const likedStatus = await this.getLikedStatus();
    const dislikedStatus = await this.getDislikedStatus();
    const likesCount = await this.getNumLikes();
    const dislikesCount = await this.getNumDislikes();

    this.setState({
      liked: likedStatus,
      disliked: dislikedStatus,
      numLikes: likesCount,
      numDislikes: dislikesCount
    });
  };

  // Toggle like status
  toggleLike = async () => {
    const { liked, disliked, numLikes, numDislikes } = this.state;
    const { item } = this.props;

    try {
      if (liked) {
        await deleteDoc(doc(db, 'posts', item.id, 'likes', auth.currentUser.uid));
        this.setState({ numLikes: numLikes - 1 });
      } else {
        await setDoc(doc(db, 'posts', item.id, 'likes', auth.currentUser.uid), { time: Timestamp.now() });
        this.setState({ numLikes: numLikes + 1 });

        if (disliked) {
          await deleteDoc(doc(db, 'posts', item.id, 'dislikes', auth.currentUser.uid));
          this.setState({ disliked: false, numDislikes: numDislikes - 1 });
        }
      }

      this.setState({ liked: !liked });
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  // Toggle dislike status
  toggleDislike = async () => {
    const { liked, disliked, numLikes, numDislikes } = this.state;
    const { item } = this.props;

    try {
      if (disliked) {
        await deleteDoc(doc(db, 'posts', item.id, 'dislikes', auth.currentUser.uid));
        this.setState({ numDislikes: numDislikes - 1 });
      } else {
        await setDoc(doc(db, 'posts', item.id, 'dislikes', auth.currentUser.uid), { time: Timestamp.now() });
        this.setState({ numDislikes: numDislikes + 1 });

        if (liked) {
          await deleteDoc(doc(db, 'posts', item.id, 'likes', auth.currentUser.uid));
          this.setState({ liked: false, numLikes: numLikes - 1 });
        }
      }

      this.setState({ disliked: !disliked });
    } catch (error) {
      console.error('Error updating dislike status:', error);
    }
  };

  render() {
    const { item, navigation, fromAccount } = this.props;
    const { liked, disliked, numLikes, numDislikes } = this.state;
    const uid = item?.uid;

    const navTo = () => (fromAccount ? 'Full-Post' : 'Post');

    return (
      <TouchableOpacity
        className="m-2 p-4 bg-white rounded-lg shadow-lg"
        onPress={() => navigation.navigate(navTo(), { item, uid, fullScreen: true })}
        activeOpacity={0.7}
      >
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
        <Text className="absolute top-2 right-5 text-base font-bold text-black">#{item?.forum}</Text>
        <Text className="text-base text-gray-800 pb-2 mt-5">{item?.text}</Text>
        <Text className="text-sm text-gray-500 self-end">
          {new Date(item?.date?.seconds * 1000).toLocaleDateString()}
        </Text>

        {/* Uncomment the following block to display the article link (if applicable).
        {item?.article && (
          <TouchableOpacity
            className="mt-2 bg-gray-200 rounded-lg overflow-hidden"
            onPress={() => navigation.navigate('Article', { articleUrl: item.article.articleUrl })}
          >
            <Image source={{ uri: item.article.imageUrl }} className="w-full h-40" />
            <Text className="p-2 font-bold text-base">{item.article.title}</Text>
          </TouchableOpacity>
        )} */}

        <View className="flex-row items-center mt-2">
          <TouchableOpacity onPress={this.toggleLike} className="flex-row items-center">
            <FontAwesome name="thumbs-up" size={20} color={liked ? '#4CAF50' : 'gray'} />
            <Text className={`ml-1 text-sm ${liked ? 'text-green-500' : 'text-gray-500'}`}>{numLikes}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.toggleDislike} className="ml-4 flex-row items-center">
            <FontAwesome name="thumbs-down" size={20} color={disliked ? '#F44336' : 'gray'} />
            <Text className={`ml-1 text-sm ${disliked ? 'text-red-500' : 'text-gray-500'}`}>{numDislikes}</Text>
          </TouchableOpacity>
        </View>
        <CommentInput />
      </TouchableOpacity>
    );
  }
}

export default Post;
