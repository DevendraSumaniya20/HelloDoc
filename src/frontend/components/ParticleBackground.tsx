// ParticleBackground.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

import { moderateScale } from '../constants/responsive';

const { width, height } = Dimensions.get('window');

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

const ParticleBackground: React.FC = () => {
  const particleAnims = useRef<Particle[]>(
    Array.from({ length: 15 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    })),
  ).current;

  useEffect(() => {
    particleAnims.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.y, {
            toValue: -50,
            duration: (4 + (index % 4)) * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: height + 50,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0.2,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  return (
    <View style={styles.particleContainer}>
      {particleAnims.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default ParticleBackground;

const styles = StyleSheet.create({
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0, // Behind everything
  },
  // Each particle (small dot)
  particle: {
    position: 'absolute',
    width: moderateScale(4),
    height: moderateScale(4),
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: moderateScale(8),
  },
});
