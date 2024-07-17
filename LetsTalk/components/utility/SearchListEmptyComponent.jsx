
import React from 'react';
import { Text, View, Button } from 'react-native';

const SearchListEmptyComponent = ({ searchType, navigation, requestedForum}) => {
  return(
    <Text className="text-center text-gray-500">No results found</Text>
  );
};

export default SearchListEmptyComponent;
