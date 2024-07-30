
import React from 'react';
import { Text, View, Button } from 'react-native';

const SearchListEmptyComponent = ({ searchType, navigation, requestedForum}) => {
  return searchType !== 'forum' ? (
    <Text className="text-center text-gray-500">No results found</Text>
  ) : (
    <View className="text-center">
      <Text className="text-gray-500">No results found</Text>
      <Button title="Request to create forum" onPress={() => {navigation.navigate('create-forum'), {forumName: requestedForum}}} />
    </View>
  );
};

export default SearchListEmptyComponent;
