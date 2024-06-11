import React, { PureComponent } from 'react'
import { TouchableOpacity, Text, Pressable } from 'react-native'

export default class Post extends PureComponent {
       
  render() {
    const item= this.props.item
    return (
    <TouchableOpacity className="m-2 p-4 bg-white rounded-lg shadow-lg"
    onPress={() =>  this.props.navigation.navigate('Post', {item })}
    activeOpacity={0.7}>
        <Pressable className='flex-shrink' hitSlop={15} onPress={()=>this.props.navigation.navigate('Account')}>
            <Text className="text-lg font-semibold text-amber-700">@{this.props.item.user}</Text>
        </Pressable>
        <Text className="text-base text-gray-800 mb-2">{this.props.item.content}</Text>
        <Text className="text-sm text-gray-500 self-end">{this.props.item.date}</Text>
  </TouchableOpacity>
    )
  };
}
