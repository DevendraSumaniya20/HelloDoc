import React, { Suspense, useEffect, useState, useRef } from 'react';
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
import { CommonActions } from '@react-navigation/native';

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
    {/* Add WebView to AuthStack so it's accessible during registration */}
    <AuthStackNav.Screen
      name={navigationStrings.WebView}
      component={screens.WebView}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  </AuthStackNav.Navigator>
);

// --- Main Stack ---
const MainStack: React.FC = () => (
  <MainStackNav.Navigator screenOptions={mainScreenOptions}>
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
  </MainStackNav.Navigator>
);

// --- Root Navigation ---
const Navigation: React.FC = () => {
  const { isAuthenticated, initializing, isFirstLaunch } = useAuth();
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);
  const navigationRef = useRef<any>(null);
  const prevAuthState = useRef<boolean | null>(null);

  useEffect(() => {
    // Splash is always the first route
    setInitialRoute(navigationStrings.Splash);
  }, []);

  // Handle authentication state changes and navigate accordingly
  useEffect(() => {
    if (initializing || !navigationRef.current) return;

    // Only act on actual auth state changes, not initial render
    if (
      prevAuthState.current !== null &&
      prevAuthState.current !== isAuthenticated
    ) {
      if (!isAuthenticated) {
        // User logged out - navigate to AuthStack
        console.log('🚪 User logged out, navigating to AuthStack');
        navigationRef.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AuthStack' }],
          }),
        );
      } else {
        // User logged in - navigate to MainStack
        console.log('✅ User logged in, navigating to MainStack');
        navigationRef.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainStack' }],
          }),
        );
      }
    }

    prevAuthState.current = isAuthenticated;
  }, [isAuthenticated, initializing]);

  if (initializing || initialRoute === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        }
      >
        <RootStack.Navigator
          initialRouteName={initialRoute}
          screenOptions={defaultScreenOptions}
        >
          {/* Always show splash first */}
          <RootStack.Screen
            name={navigationStrings.Splash}
            component={screens.Splash}
            options={{ animation: 'fade' }}
          />

          {/* Show intro only if first launch */}
          {isFirstLaunch && (
            <RootStack.Screen
              name={navigationStrings.Intro}
              component={screens.Intro}
              options={{ animation: 'fade' }}
            />
          )}

          {/* Auth flow */}
          <RootStack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ animation: 'slide_from_bottom' }}
          />

          {/* Main flow */}
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
