import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient'; // make sure you installed this
import Colors from '../../constants/color';
import { moderateScale } from '../../constants/responsive';
import { useNavigation } from '@react-navigation/native';
import navigationStrings from '../../constants/navigationString';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';

type SplashScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const Splash = () => {
  const navigation = useNavigation<SplashScreenNavigation>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: navigationStrings.Home }],
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.accent, Colors.secondary]}
        style={styles.container}
      >
        {/* App Title */}
        <Text style={styles.title}>Hello Doc</Text>
        <Text style={styles.subtitle}>Your health, our priority</Text>

        {/* Loader */}
        <ActivityIndicator
          size="large"
          color={Colors.accent}
          style={{ marginTop: moderateScale(20) }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.neutral,
    fontSize: moderateScale(32),
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.accent,
    fontSize: moderateScale(16),
    marginTop: moderateScale(8),
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default Splash;
