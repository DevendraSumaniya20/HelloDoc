// SlideContent.tsx
import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur'; // For iOS-style frosted glass effect
import LinearGradient from 'react-native-linear-gradient'; // For gradient backgrounds
import Colors from '../constants/color'; // Custom color palette
import { moderateScale } from '../constants/responsive'; // Utility for scaling sizes across devices

// Feature card interface (icon + text + color)
interface Feature {
  icon: React.ReactNode | string; // Icon can be a React component or plain string (emoji/symbol)
  text: string; // Feature label
  color: string; // Color for icon or background
}

// Slide interface (each onboarding slide data model)
export interface Slide {
  id: number; // Unique ID
  title: string; // Slide title
  subtitle: string; // Small badge-like subtitle
  description: string; // Supporting text
  icon: string | React.ReactNode; // Icon for slide
  emoji: string | React.ReactNode; // Decorative emoji or icon
  gradient: string[]; // Gradient colors for backgrounds
  features: Feature[]; // List of feature cards
}

// Props passed into SlideContent
interface SlideContentProps {
  item: Slide; // Current slide data
  slideAnim: Animated.Value; // Animation value for vertical translation
  fadeAnim: Animated.Value; // Animation value for opacity fade
}

// Main component rendering the content of a slide
const SlideContent: React.FC<SlideContentProps> = ({
  item,
  slideAnim,
  fadeAnim,
}) => {
  return (
    <>
      {/* Animated container for title, subtitle, and description */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim, // Fade in/out effect
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20], // Subtle upward motion
                }),
              },
            ],
          },
        ]}
      >
        {/* Subtitle badge with gradient background */}
        <View style={styles.subtitleContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
            style={styles.subtitleBadge}
          >
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </LinearGradient>
        </View>

        {/* Slide title */}
        <Text style={styles.title}>{item.title}</Text>
        {/* Slide description */}
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>

      {/* Features list (cards under description) */}
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
                      outputRange: [0, index * 5], // Small staggered effect for stacked cards
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Card with frosted-glass background */}
            <BlurView
              style={styles.featureBlur}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor={Colors.white}
            >
              <View style={styles.featureContent}>
                {/* Icon inside circle background */}
                <View style={styles.featureIconContainer}>
                  {typeof feature.icon === 'string' ? (
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                  ) : (
                    feature.icon
                  )}
                </View>
                {/* Feature label text */}
                <Text style={styles.featureText}>{feature.text}</Text>
                {/* Arrow on the right side */}
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
  // Container for all text (subtitle, title, description)
  textContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
    zIndex: 2,
  },
  // Wrapper for subtitle badge
  subtitleContainer: {
    marginBottom: moderateScale(8),
  },
  // Subtitle badge style with border + gradient
  subtitleBadge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  // Subtitle text
  subtitle: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: moderateScale(1),
  },
  // Title text (large bold heading)
  title: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: moderateScale(10),
    lineHeight: moderateScale(32),
  },
  // Description text (supportive paragraph)
  description: {
    fontSize: moderateScale(14),
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  // Container for all feature cards
  featureContainer: {
    width: '100%',
    zIndex: 2,
  },
  // Individual feature card
  featureCard: {
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(14),
    overflow: 'hidden', // Ensures BlurView + children stay inside rounded border
  },
  // BlurView style for frosted glass background
  featureBlur: {
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: Colors.grayUltraLight,
  },
  // Inner row of feature card (icon + text + arrow)
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  // Circle container for feature icon
  featureIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
    backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent background
  },
  // Feature icon text style
  featureIcon: {
    fontSize: moderateScale(18),
  },
  // Feature text style
  featureText: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Small rounded arrow container
  featureArrow: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: moderateScale(10),
    width: moderateScale(20),
    height: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Arrow text style
  arrowIcon: {
    fontSize: moderateScale(12),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
