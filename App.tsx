import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/frontend/hooks/AuthContext';
import Navigation from './src/frontend/navigation/Navigation';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
      <Navigation />
    </AuthProvider>
  );
};

export default App;
