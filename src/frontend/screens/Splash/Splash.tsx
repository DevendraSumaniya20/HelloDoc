import React, { FC } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { getGradientProps } from '../../utils/gradients';
import Colors from '../../constants/color';
import SplashStyle from './SplashStyle';

const Splash: FC = () => {
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient {...getGradientProps()} style={SplashStyle.container}>
        {/* App Title */}
        <Text style={SplashStyle.title}>Hello Doc</Text>
        <Text style={SplashStyle.subtitle}>Your health, our priority</Text>

        {/* Loader */}
        <ActivityIndicator size="large" color={Colors.accent} style={SplashStyle.loader} />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Splash;
