import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { Doctor } from '../types/types';
import { moderateScale } from '../constants/responsive';
import Colors from '../constants/color';

interface TypingIndicatorProps {
  doctor: Doctor;
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  doctor,
  isVisible,
}) => {
  const dot1Opacity = useRef(new Animated.Value(1)).current;
  const dot2Opacity = useRef(new Animated.Value(0.7)).current;
  const dot3Opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (isVisible) {
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dot1Opacity, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.7,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isVisible) {
            animateDots();
          }
        });
      };
      animateDots();
    }
  }, [isVisible, dot1Opacity, dot2Opacity, dot3Opacity]);

  if (!isVisible) return null;

  return (
    <View style={[styles.messageContainer, styles.doctorMessageContainer]}>
      <Image source={{ uri: doctor.image }} style={styles.messageAvatar} />
      <View style={[styles.messageBubble, styles.typingBubble]}>
        <Text style={styles.typingText}>Dr. {doctor.name} is typing</Text>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
    paddingHorizontal: moderateScale(16),
  },
  doctorMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    marginRight: moderateScale(8),
    marginTop: moderateScale(4),
  },
  messageBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: moderateScale(4),
    maxWidth: '75%',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(18),
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(16),
  },
  typingText: {
    fontSize: 14,
    color: Colors.grayDark,
    fontStyle: 'italic',
    marginRight: moderateScale(8),
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: Colors.grayDark,
    marginHorizontal: moderateScale(1),
  },
});

export default TypingIndicator;
