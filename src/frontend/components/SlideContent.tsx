import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

import Colors from '../constants/color'; // centralized color constants
import { moderateScale } from '../constants/responsive'; // scales
import Icons from '../constants/svgPath'; // SVG icons

// Interface for a single feature card
interface Feature {
  icon: React.ReactNode | string; // feature icon can be a ReactNode or string path
  text: string; // feature description
  color: string; // color for icon or feature (if needed)
}

// Interface for a slide
export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string | React.ReactNode; // main icon for the slide
  emoji: string | React.ReactNode; // optional emoji/icon
  gradient: string[]; // background gradient colors
  features: Feature[]; // array of features
}

// Props for SlideContent component
interface SlideContentProps {
  item: Slide; // slide data
  slideAnim: Animated.Value; // animated value for slide transition
  fadeAnim: Animated.Value; // animated value for fade effect
}

const SlideContent: React.FC<SlideContentProps> = ({
  item,
  slideAnim,
  fadeAnim,
}) => {
  return (
    <>
      {/* Animated text container */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim, // fade in/out animation
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20], // slide text up slightly
                }),
              },
            ],
          },
        ]}
      >
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>

      {/* Features list */}
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
                      outputRange: [0, index * 5], // staggered vertical movement
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Feature card background */}
            <View style={styles.featureBackground}>
              <View style={styles.featureContent}>
                {/* Feature icon */}
                <View style={styles.featureIconContainer}>{feature.icon}</View>

                {/* Feature text */}
                <Text style={styles.featureText}>{feature.text}</Text>

                {/* Arrow icon (rotated to point right) */}
                <View style={styles.featureArrow}>
                  <Icons.LeftArrow
                    height={moderateScale(24)}
                    width={moderateScale(24)}
                    fill={Colors.white}
                    style={{ transform: [{ rotate: '180deg' }] }}
                    stroke={Colors.white}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </>
  );
};

export default SlideContent;

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  // container for text content
  textContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
    zIndex: 2,
  },

  // subtitle style
  subtitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: moderateScale(1),
    textAlign: 'center',
  },
  subtitleContainer: {
    marginBottom: moderateScale(12),
  },
  subtitleBadge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // title style
  title: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: moderateScale(10),
    lineHeight: moderateScale(32),
  },

  // description text style
  description: {
    fontSize: moderateScale(14),
    color: Colors.white,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },

  // container for features
  featureContainer: {
    width: '100%',
    zIndex: 2,
  },

  // individual feature card
  featureCard: {
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(14),
    overflow: 'hidden',
  },

  // background for feature card
  featureBackground: {
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: Colors.grayUltraLight,
    backgroundColor: 'transparent',
  },

  // inner content of feature card
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
  },

  // container for icon in feature card
  featureIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
    backgroundColor: Colors.grayUltraLight,
    overflow: 'hidden',
    elevation: 1,
  },

  // feature text
  featureText: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.white,
  },

  // container for arrow icon
  featureArrow: {
    borderRadius: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
