import React from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import BiasBar from '../posts/subcomponents/BiasBar'
import { Entypo } from '@expo/vector-icons'

function PostResult(props) {
    const item=props.item;
    const onPressHandler=async()=>{
      props.navigation.navigate('postPage', { item:item})
    }


  return (
        <TouchableOpacity
          disabled={props?.disabled}
          className="m-2 p-4 bg-white border border-lightblue-500 rounded-lg shadow-lg"
          onPress={onPressHandler}
          activeOpacity={0.7}
        >
        
            <View className="flex-shrink-0">
              <Pressable
                hitSlop={15}
                className="w-48"
                onPress={() => props.navigation.navigate('Account', {username: item.username })}
              >
                <Text className="text-lg font-semibold text-amber-700">@{item.username}</Text>
              </Pressable>
            </View>
          <Text className="absolute top-3 right-4 text-base font-bold text-black">#{item?.forum}</Text>
          <Text className="text-base text-gray-800 pb-2 mt-5">{item?.text}</Text>     
            {item.biasEvaluation && 
            <BiasBar className="absolute right-3 bottom-6 " biasEvaluation={item.biasEvaluation} />
        
          }   
        </TouchableOpacity>
  )
}

export default PostResult