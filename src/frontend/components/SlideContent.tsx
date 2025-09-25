// SlideContent.tsx
import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/color';
import { moderateScale } from '../constants/responsive';

interface Feature {
  icon: React.ReactNode | string;
  text: string;
  color: string;
}

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string | React.ReactNode;
  emoji: string;
  gradient: string[];
  features: Feature[];
}

interface SlideContentProps {
  item: Slide;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
}

const SlideContent: React.FC<SlideContentProps> = ({
  item,
  slideAnim,
  fadeAnim,
}) => {
  return (
    <>
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.subtitleContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
            style={styles.subtitleBadge}
          >
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </LinearGradient>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>

      <View style={styles.featureContainer}>
        {item.features.map((feature, index) => (
          <Animated.View
            key={index}
            style={[
              styles.featureCard,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, index * 5],
                    }),
                  },
                ],
              },
            ]}
          >
            <BlurView
              style={styles.featureBlur}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor={Colors.white}
            >
              <View style={styles.featureContent}>
                <View
                  style={[
                    styles.featureIconContainer,
                    { backgroundColor: '#FFD70020' },
                  ]}
                >
                  <View style={styles.featureIconContainer}>
                    {typeof feature.icon === 'string' ? (
                      <Text style={styles.featureIcon}>{feature.icon}</Text>
                    ) : (
                      feature.icon
                    )}
                  </View>
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
                <View style={styles.featureArrow}>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        ))}
      </View>
    </>
  );
};

export default SlideContent;

const styles = StyleSheet.create({
  // SlideContent styles
  textContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
    zIndex: 2,
  },
  subtitleContainer: {
    marginBottom: moderateScale(8),
  },
  subtitleBadge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  subtitle: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: moderateScale(1),
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: moderateScale(10),
    lineHeight: moderateScale(32),
  },
  description: {
    fontSize: moderateScale(14),
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  featureContainer: {
    width: '100%',
    zIndex: 2,
  },
  featureCard: {
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(14),
    overflow: 'hidden',
  },
  featureBlur: {
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  featureIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  featureIcon: {
    fontSize: moderateScale(18),
  },
  featureText: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featureArrow: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: moderateScale(10),
    width: moderateScale(20),
    height: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: moderateScale(12),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
