import React, { Suspense } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import screens from '../screens';
import navigationStrings from '../constants/navigationString';
import { RootStackParamList } from '../types/types';
import Colors from '../constants/color';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const Navigation: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <NavigationContainer>
        <Suspense fallback={<ActivityIndicator size="large" color="blue" />}>
          <Stack.Navigator
            initialRouteName={navigationStrings.Splash}
            screenOptions={screenOptions}
          >
            <Stack.Screen
              name={navigationStrings.Splash}
              component={screens.Splash}
            />
            <Stack.Screen
              name={navigationStrings.Home}
              component={screens.Home}
            />
            <Stack.Screen
              name={navigationStrings.Login}
              component={screens.Login}
            />
            <Stack.Screen
              name={navigationStrings.Register}
              component={screens.Register}
            />
            <Stack.Screen
              name={navigationStrings.Setting}
              component={screens.Setting}
            />
          </Stack.Navigator>
        </Suspense>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
