import { Text, View } from 'react-native';
import React from 'react';
import { RootStackParamList } from '../../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type HomeScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigation>();

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
