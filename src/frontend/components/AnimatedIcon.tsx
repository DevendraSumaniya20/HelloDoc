// AnimatedIcon.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../constants/color';
import { moderateScale } from '../constants/responsive';

interface AnimatedIconProps {
  icon: string | React.ReactNode; // Main icon content (emoji or string)
  emoji: string | React.ReactNode; // Smaller floating emoji/glow
  gradient?: string[]; // Optional gradient colors for background
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  emoji,
  gradient,
}) => {
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current; // Scale animation
  const floatAnim = useRef(new Animated.Value(0)).current; // Vertical float animation
  const rotateAnim = useRef(new Animated.Value(0)).current; // Background rotation

  useEffect(() => {
    // Pulse animation loop
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

    // Floating animation loop
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

    // Rotate background animation loop
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
      {/* Rotating background gradient circle */}
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
          colors={gradient || [Colors.primary, Colors.secondary, Colors.accent]}
          style={styles.gradientCircle}
        />
      </Animated.View>

      {/* Main icon container with pulse + float animation */}
      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ scale: pulseAnim }, { translateY: floatAnim }] },
        ]}
      >
        <View style={styles.iconWrapper}>
          {/* Main icon */}
          <View style={[styles.iconCircle, { borderColor: Colors.highlight }]}>
            <Text style={[styles.mainIcon, { color: Colors.textPrimary }]}>
              {icon}
            </Text>
          </View>

          {/* Small emoji/glow effect */}
          <View
            style={[
              styles.iconGlow,
              { backgroundColor: Colors.highlight, borderColor: Colors.white },
            ]}
          >
            <Text style={[styles.emojiIcon, { color: Colors.textPrimary }]}>
              {emoji}
            </Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default AnimatedIcon;

const styles = StyleSheet.create({
  // Rotating gradient background circle
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

  // Container for main icon + glow
  iconContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
    zIndex: 2,
  },
  iconWrapper: {
    position: 'relative',
  },

  // Circle behind main icon (used to replace BlurView)
  iconCircle: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  mainIcon: {
    fontSize: moderateScale(50),
  },

  // Glow/emoji effect near main icon
  iconGlow: {
    position: 'absolute',
    top: moderateScale(-6),
    right: moderateScale(-6),
    borderRadius: moderateScale(16),
    padding: moderateScale(5),
    borderWidth: 1,
  },
  emojiIcon: {
    fontSize: moderateScale(18),
  },
});
