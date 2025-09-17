import React, { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import screens from '../screens';
import navigationStrings from '../constants/navigationString';
import {
  RootStackParamList,
  AuthStackParamList,
  MainStackParamList,
} from '../types/types';
import { useAuth } from '../hooks/AuthContext';
import Colors from '../constants/color';
import TabNavigation from './TabNavigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const MainStackNav = createNativeStackNavigator<MainStackParamList>();

const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};
const authScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
};
const mainScreenOptions: NativeStackNavigationOptions = { headerShown: false };

const AuthStack: React.FC = () => (
  <AuthStackNav.Navigator
    initialRouteName={navigationStrings.Login}
    screenOptions={authScreenOptions}
  >
    <AuthStackNav.Screen
      name={navigationStrings.Login}
      component={screens.Login}
    />
    <AuthStackNav.Screen
      name={navigationStrings.Register}
      component={screens.Register}
    />
  </AuthStackNav.Navigator>
);

const MainStack: React.FC = () => (
  <MainStackNav.Navigator screenOptions={mainScreenOptions}>
    <MainStackNav.Screen name="Tabs" component={TabNavigation} />
    <MainStackNav.Screen
      name={navigationStrings.Profile}
      component={screens.Profile}
    />
  </MainStackNav.Navigator>
);

const Navigation: React.FC = () => {
  const { isAuthenticated, initializing } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!initializing) {
      timeoutId = setTimeout(() => setShowSplash(false), 1500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.info} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.info} />
          </View>
        }
      >
        <RootStack.Navigator screenOptions={defaultScreenOptions}>
          {showSplash ? (
            <RootStack.Screen
              name={navigationStrings.Splash}
              component={screens.Splash}
            />
          ) : !isAuthenticated ? (
            <RootStack.Screen name="AuthStack" component={AuthStack} />
          ) : (
            <RootStack.Screen name="MainStack" component={MainStack} />
          )}
        </RootStack.Navigator>
      </Suspense>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});

export default Navigation;
