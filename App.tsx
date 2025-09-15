import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/frontend/hooks/AuthContext';
import Navigation from './src/frontend/navigation/Navigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const App: React.FC = () => {
  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId:
        '249301927840-a5l991cd19kgc2kef8ti566oqfru7pti.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      // Add other configuration options as needed
    });
  }, []);

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
