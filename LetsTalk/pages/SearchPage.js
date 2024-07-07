import React, { useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import UserResult from '../components/UserResult';
import Post from '../components/Post';
import {  searchClient } from '../api/firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import { FullPostScreen } from './FullPostScreen';
import ProfilePage from './Account';
import { InstantSearch, useInfiniteHits, useSearchBox } from 'react-instantsearch-core';

export const SearchStackPage=()=>{
  const Stack= createStackNavigator();
return(
 <Stack.Navigator initialRouteName='searchPage' screenOptions={{headerShown:false}}>
  <Stack.Screen name='searchPage' component={SearchPage}></Stack.Screen>
  <Stack.Screen name='postPage' component={FullPostScreen}></Stack.Screen>
  <Stack.Screen name='accountPage' component={ProfilePage}></Stack.Screen>
 </Stack.Navigator>
)
}




const SearchPage= ({ navigation }) => {
  const [searchType, setSearchType] = useState('usernames'); // Default search type

  const ResultList=({searchType})=>{

    const { hits, isLastPage, showMore } = useInfiniteHits({
      escapeHTML: false,
    });
  
  
  
  
    const renderResult = ({ item }) => {
      if (searchType === 'usernames') {
        return <UserResult user={item} navigation={navigation}/>;
      } else if (searchType === 'posts') {
        return <Post item={item} navigation={navigation}  fromSearch={true} />;
      }
    };
    
  
  
    return (
      <FlatList
      data={hits}
      keyExtractor={( item,index) => index.toString()}
      renderItem={renderResult}
      onEndReached={() => {
        if (!isLastPage) {
          showMore();
        }
      }}
      ListEmptyComponent={<Text className="text-center text-gray-500">No results found</Text>}
    />
    );
  }
 
  const SearchBox=()=>{
    const { query, refine } = useSearchBox();
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);
  
  
  
    const handleSearch = async () => {
      Keyboard.dismiss();
      handleInput(search);
    };
  
    const handleInput=(search)=>{
      setSearch(search);
      refine(search);
    }
  
  
    
    if (query !== search && !inputRef.current?.isFocused()) {
      setInputValue(query);
    }
  
    return(
          <View className="flex-row items-center mb-4">
            <TextInput
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              placeholder="Search..."
              ref={inputRef}
              value={search}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              autoComplete="off"
              onChangeText={(text)=>handleInput(text)}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} className="ml-2 p-2 bg-lightblue-500 rounded-lg">
              <FontAwesome name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
    );
  }
  


  return (
    <View className="flex-1 bg-lightblue-500 rounded-lg shadow-lg">
      <View className=" m-4 mt-10 p-5 justify-center bg-white rounded-xl">
      <InstantSearch searchClient={searchClient} indexName={searchType}>
        <SearchBox/>
        <View className="flex-row justify-around mb-4">
          <TouchableOpacity onPress={() => {setSearchType('usernames'); }} className={`p-2 rounded-lg ${searchType === 'usernames' ? 'bg-lightblue-500' : 'bg-gray-200'}`}>
            <Text className={searchType === 'usernames' ? 'text-white' : 'text-black'}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSearchType('forums'); }} className={`p-2 rounded-lg ${searchType === 'forums' ? 'bg-lightblue-500' : 'bg-gray-200'}`}>
            <Text className={searchType === 'forums' ? 'text-white' : 'text-black'}>Forums</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSearchType('posts'); }} className={`p-2 rounded-lg ${searchType === 'posts' ? 'bg-lightblue-500' : 'bg-gray-200'}`}>
            <Text className={searchType === 'posts' ? 'text-white' : 'text-black'}>Posts</Text>
          </TouchableOpacity>
        </View>
        <ResultList searchType={searchType}/>
        </InstantSearch>
      </View>

    
    </View>
  );
};
export default SearchPage;













