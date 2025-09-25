import React, { Suspense } from 'react';
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
  </MainStackNav.Navigator>
);

// --- Root Navigation ---
const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        }
      >
        <RootStack.Navigator screenOptions={defaultScreenOptions}>
          {/* Splash screen is always first */}
          <RootStack.Screen
            name={navigationStrings.Splash}
            component={screens.Splash}
            options={{ animation: 'fade' }}
          />

          {/* Intro screen (Splash decides if it should navigate here) */}
          <RootStack.Screen
            name={navigationStrings.Intro}
            component={screens.Intro}
            options={{ animation: 'fade' }}
          />

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
