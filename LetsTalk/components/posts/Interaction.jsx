import { FontAwesome } from '@expo/vector-icons';
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * this component is used to render the interactions component of the Post parent Component
 * 
 * @param {boolean} liked - status of liked interaction.
 * @param {boolean} disliked - status of disliked interaction
 * @param {function} toggleDislike- handler for toggling dislike interaction on screen
 * @param {function} toggleLike- handler for toggling like interaction on screen
 */


function Interaction({toggleDislike, toggleLike, liked, disliked}) {
  //TODO: implement animations for liking and disliking functionality. 
  return (
    <View className="flex-row items-center mt-2">
    <TouchableOpacity hitSlop={25} onPress={toggleLike} className="flex-row items-center mr-3">
      <FontAwesome name="thumbs-up" size={20} color={liked ? '#4CAF50' : 'gray'} />
    </TouchableOpacity>

    <TouchableOpacity hitSlop={25} onPress={toggleDislike} className="flex-row items-center">
      <FontAwesome name="thumbs-down" size={20} color={disliked ? '#F44336' : 'gray'} />
    </TouchableOpacity>
  </View>

  )
}

export default Interaction;