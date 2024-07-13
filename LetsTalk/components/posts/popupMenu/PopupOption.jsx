import React from 'react'
import {TouchableOpacity,Text, View} from 'react-native'

/**
 * @param {string} text- header of popup option (required)
 * @param {ExpoIcon} icon- any expo Icon to appear in the popup (required)
 * @param {function} handler- a handler for the event to happen when option is pressed
 * @param {string} style- a className styling
 * @returns react JSX component to represent that option
 */
 const PopupOption=({text, icon, handler, style, textStyle})=> {
  return (
    <TouchableOpacity className={style} onPress={handler}>
            {icon}
            <Text className={textStyle}>{text}</Text>
    </TouchableOpacity>

  )
}
export default PopupOption;
