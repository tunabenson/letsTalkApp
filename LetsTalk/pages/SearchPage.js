import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import UserResult from '../components/UserResult';
import Post from '../components/Post';
import { FieldPath, collection, documentId, getDocs, limit, query, queryEqual, where } from 'firebase/firestore';
import { db } from '../api/firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import { FullPostScreen } from './FullPostScreen';
import ProfilePage from './Account';
import { useNavigation } from '@react-navigation/native';


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
  const [searchType, setSearchType] = useState('users'); // Default search type
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    // Perform the search based on searchType and query
    // This is a placeholder for the actual search logic
    Keyboard.dismiss();
    let q; 
    switch (searchType){
      case 'users': q= query(collection(db , searchType), where(documentId() ,'>=', search ), where(documentId() ,'<=', search+'\uf8ff' ), limit(10));
    }
    const searchResults = await performSearch(q);
   
    setResults(searchResults);
  };

  const performSearch = async (query) => {
    // Replace with actual search logic
    let data=[];
    const snapshot= await getDocs(query);
    snapshot.forEach((result)=>{
      console.log(result.data())
      data.push( {...result.data(), id:result.id});
    })
    return data;
  };

  const renderResult = ({ item }) => {
    if (searchType === 'users') {
      return <UserResult user={item} navigation={navigation}/>;
    } else if (searchType === 'posts') {
      return <Post item={item} navigation={navigation} />;
    }
  };

  return (
    <View className="flex-1 bg-lightblue-500 rounded-lg shadow-lg">
      <View className=" m-4 mt-10 p-5 justify-center bg-white rounded-xl">
        <View className="flex-row items-center mb-4">
          <TextInput
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} className="ml-2 p-2 bg-lightblue-500 rounded-lg">
            <FontAwesome name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-around mb-4">
          <TouchableOpacity onPress={() => {setSearchType('users'); setResults([]);}} className={`p-2 rounded-lg ${searchType === 'users' ? 'bg-lightblue-500' : 'bg-gray-200'}`}>
            <Text className={searchType === 'users' ? 'text-white' : 'text-black'}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSearchType('forums'); setResults([]);}} className={`p-2 rounded-lg ${searchType === 'forums' ? 'bg-lightblue-500' : 'bg-gray-200'}`}>
            <Text className={searchType === 'forums' ? 'text-white' : 'text-black'}>Forums</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSearchType('posts'); setResults([]);}} className={`p-2 rounded-lg ${searchType === 'posts' ? 'bg-lightblue-500' : 'bg-gray-200'}`}>
            <Text className={searchType === 'posts' ? 'text-white' : 'text-black'}>Posts</Text>
          </TouchableOpacity>
        </View>
        <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderResult}
        ListEmptyComponent={<Text className="text-center text-gray-500">No results found</Text>}
      />
      </View>

    
    </View>
  );
};

export default SearchPage;
