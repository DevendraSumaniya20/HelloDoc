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

// Create separate navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const MainStackNav = createNativeStackNavigator<MainStackParamList>();

// Screen options
const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
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

const modalScreenOptions: NativeStackNavigationOptions = {
  presentation: 'modal',
  animation: 'slide_from_bottom',
  headerShown: false,
};

// --- AUTH STACK (Login/Register) ---
const AuthStack = () => (
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

// --- MAIN STACK (Home/Settings) ---
const MainStack = () => (
  <MainStackNav.Navigator
    initialRouteName={navigationStrings.Home}
    screenOptions={mainScreenOptions}
  >
    <MainStackNav.Screen
      name={navigationStrings.Home}
      component={screens.Home}
    />
    <MainStackNav.Screen
      name={navigationStrings.Setting}
      component={screens.Setting}
    />
  </MainStackNav.Navigator>
);

// --- ROOT NAVIGATOR ---
const Navigation: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // If auth finished loading → wait 1.5s then hide splash
    if (!isLoading) {
      const timer = setTimeout(() => setShowSplash(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={styles.suspenseContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        }
      >
        <RootStack.Navigator screenOptions={defaultScreenOptions}>
          {showSplash ? (
            // ✅ Splash always shown on every launch until auth is ready
            <RootStack.Screen
              name={navigationStrings.Splash}
              component={screens.Splash}
            />
          ) : !isAuthenticated ? (
            // Not authenticated → Auth flow
            <RootStack.Screen
              name="AuthStack"
              component={AuthStack}
              options={{ headerShown: false }}
            />
          ) : (
            // Authenticated → Main app
            <>
              <RootStack.Screen
                name="MainStack"
                options={{ headerShown: false }}
              >
                {() => <MainStack />}
              </RootStack.Screen>

              {/* Optional: login/register as modals */}
              <RootStack.Screen
                name={navigationStrings.Login}
                component={screens.Login}
                options={modalScreenOptions}
              />
              <RootStack.Screen
                name={navigationStrings.Register}
                component={screens.Register}
                options={modalScreenOptions}
              />
            </>
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
    backgroundColor: '#fff',
  },
  suspenseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default Navigation;
