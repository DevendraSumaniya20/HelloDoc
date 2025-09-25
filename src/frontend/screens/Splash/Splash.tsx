import React, { FC, useEffect } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/color';
import SplashStyle from './SplashStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import navigationStrings from '../../constants/navigationString';
import {
  checkFirstLaunch,
  getUserFromStorage,
  setFirstLaunch,
} from '../../services/storageService';
import { getGradientProps } from '../../utils/gradients';

const Splash: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const hasLaunched = await checkFirstLaunch();
        const user = await getUserFromStorage();

        if (!hasLaunched) {
          // First launch → show Intro
          await setFirstLaunch();
          navigation.replace(navigationStrings.Intro);
        } else {
          // Not first launch → check if user is logged in
          if (user) {
            navigation.replace('MainStack'); // logged in → home
          } else {
            navigation.replace('AuthStack'); // not logged in → login/signup
          }
        }
      } catch (error) {
        console.error('Splash navigation error:', error);
        navigation.replace('AuthStack');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient {...getGradientProps()} style={SplashStyle.container}>
        <Text style={SplashStyle.title}>Hello Doc</Text>
        <Text style={SplashStyle.subtitle}>Your health, our priority</Text>
        <ActivityIndicator
          size="large"
          color={Colors.accent}
          style={SplashStyle.loader}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Splash;
