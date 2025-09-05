import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>🏠 Home Screen </Text>
    </SafeAreaView>
  );
};

export default Home;
