import React, { Suspense, useEffect, useState, useRef } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
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
  animation: 'slide_from_right',
};

const authScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
  animation: 'slide_from_right',
};

const mainScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

// --- Auth Stack ---
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
    {/* WebView is globally defined, but often needed in Auth for T&C */}
    <AuthStackNav.Screen
      name={navigationStrings.WebView}
      component={screens.WebView}
      options={{ headerShown: false }}
    />
  </AuthStackNav.Navigator>
);

// --- Main Stack ---
const MainStack: React.FC = () => (
  <MainStackNav.Navigator
    initialRouteName="Tabs" // Start flow on the Tabs container
    screenOptions={mainScreenOptions}
  >
    <MainStackNav.Screen name="Tabs" component={TabNavigation} />
    <MainStackNav.Screen
      name={navigationStrings.Profile}
      component={screens.Profile}
    />
    <MainStackNav.Screen
      name={navigationStrings.Setting}
      component={screens.Setting}
    />
    <MainStackNav.Screen
      name={navigationStrings.WebView}
      component={screens.WebView}
    />
    <MainStackNav.Screen
      name={navigationStrings.Chat}
      component={screens.Chat}
    />
    <MainStackNav.Screen
      name={navigationStrings.Search}
      component={screens.Search}
    />
  </MainStackNav.Navigator>
);

// --- Root Navigation ---
const Navigation: React.FC = () => {
  const { isAuthenticated, initializing, isFirstLaunch } = useAuth();

  // Use a state variable for the initial screen to handle the very first boot.
  const [isReady, setIsReady] = useState(false);
  const navigationRef = useRef<any>(null);
  const prevAuthState = useRef<boolean | null>(null);

  // Set the navigation reference as ready
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Handle authentication state changes and navigate accordingly
  useEffect(() => {
    if (initializing || !navigationRef.current || !isReady) {
      prevAuthState.current = isAuthenticated;
      return;
    }

    // Logic to run AFTER Splash/Intro is completed and auth state changes
    if (
      prevAuthState.current !== null &&
      prevAuthState.current !== isAuthenticated
    ) {
      const targetStack = isAuthenticated ? 'MainStack' : 'AuthStack';
      console.log(`Auth state changed. Navigating to ${targetStack}`);

      // Reset the navigation stack to the target root stack
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: targetStack }],
        }),
      );
    }

    prevAuthState.current = isAuthenticated;
  }, [isAuthenticated, initializing, isReady]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} onReady={() => setIsReady(true)}>
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        }
      >
        <RootStack.Navigator
          // Splash screen is ALWAYS the first screen shown while `initializing` is true.
          initialRouteName={navigationStrings.Splash}
          screenOptions={defaultScreenOptions}
        >
          <RootStack.Screen
            name={navigationStrings.Splash}
            component={screens.Splash}
            options={{ animation: 'fade' }}
          />

          {/* Intro screen is injected if it's the first launch */}
          {isFirstLaunch && (
            <RootStack.Screen
              name={navigationStrings.Intro}
              component={screens.Intro}
              options={{ animation: 'fade' }}
            />
          )}

          {/* Auth flow (Accessed via navigation reset) */}
          <RootStack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ animation: 'slide_from_bottom' }}
          />

          {/* Main flow (Accessed via navigation reset) */}
          <RootStack.Screen
            name="MainStack"
            component={MainStack}
            options={{ animation: 'slide_from_right' }}
          />
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
