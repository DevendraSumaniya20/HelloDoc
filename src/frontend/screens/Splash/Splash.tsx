import React, { FC, useEffect } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { getGradientProps } from '../../utils/gradients';
import Colors from '../../constants/color';
import SplashStyle from './SplashStyle';
import { useAuth } from '../../hooks/AuthContext';
import navigationStrings from '../../constants/navigationString';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
import {
  checkFirstLaunch,
  setFirstLaunch,
} from '../../services/storageService';

const Splash: FC = () => {
  const { isAuthenticated } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const hasLaunched = await checkFirstLaunch();

        if (!hasLaunched) {
          // first launch → navigate to Intro
          await setFirstLaunch();
          navigation.replace(navigationStrings.Intro);
        } else {
          // not first launch → navigate to Auth or Main
          if (isAuthenticated) {
            navigation.replace('MainStack');
          } else {
            navigation.replace('AuthStack');
          }
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        navigation.replace('AuthStack');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

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
