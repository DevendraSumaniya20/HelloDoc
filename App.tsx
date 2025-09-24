import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/frontend/hooks/AuthContext';
import Navigation from './src/frontend/navigation/Navigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './src/frontend/apollo/client';

const App: React.FC = () => {
  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId:
        '249301927840-a5l991cd19kgc2kef8ti566oqfru7pti.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
          translucent={false}
        />
        <Navigation />
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
