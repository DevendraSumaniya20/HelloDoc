// AnimatedIcon.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../constants/color';
import { moderateScale } from '../constants/responsive';

interface AnimatedIconProps {
  icon: string | React.ReactNode;
  emoji: string;
  gradient?: string[];
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  emoji,
  gradient,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 5,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <>
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
              { translateY: floatAnim },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={gradient || ['#667eea', '#764ba2', '#f093fb']}
          style={styles.gradientCircle}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ scale: pulseAnim }, { translateY: floatAnim }] },
        ]}
      >
        <View style={styles.iconWrapper}>
          <BlurView
            style={styles.iconBlur}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor={Colors.white}
          >
            <Text style={styles.mainIcon}>{icon}</Text>
          </BlurView>
          <View style={styles.iconGlow}>
            <Text style={styles.emojiIcon}>{emoji}</Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default AnimatedIcon;

const styles = StyleSheet.create({
  backgroundCircle: {
    position: 'absolute',
    width: moderateScale(220),
    height: moderateScale(220),
    top: '20%',
    opacity: 0.08,
    zIndex: 0,
  },
  gradientCircle: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(110),
  },
  // Container for main icon + glow effect
  iconContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
    zIndex: 2,
  },
  iconWrapper: {
    position: 'relative',
  },
  // Blur effect behind main icon
  iconBlur: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  mainIcon: {
    fontSize: moderateScale(50),
  },
  // Glow/emoji effect near main icon
  iconGlow: {
    position: 'absolute',
    top: moderateScale(-6),
    right: moderateScale(-6),
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: moderateScale(16),
    padding: moderateScale(5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  emojiIcon: {
    fontSize: moderateScale(18),
  },
});
