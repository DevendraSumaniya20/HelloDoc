import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent,
} from 'react-native';
import { moderateScale } from '../constants/responsive';
import Colors from '../constants/color';

type SocialVariant = 'border' | 'noBorder' | 'withIcon';

interface SocialButtonProps {
  variant: SocialVariant;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  title?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  variant,
  onPress,
  disabled = false,
  icon,
  title,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'border':
        return styles.borderButton;
      case 'noBorder':
        return styles.noBorderButton;
      case 'withIcon':
        return styles.withIconButton;
      default:
        return styles.noBorderButton;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: Colors.grayLight }}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.text}>{title || 'Continue'}</Text>
    </Pressable>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(6),
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  borderButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  noBorderButton: {
    backgroundColor: Colors.neutral,
  },
  withIconButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  disabledButton: {
    backgroundColor: Colors.grayLight,
    borderColor: Colors.grayLight,
    opacity: 0.7,
  },
  pressedButton: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontWeight: '600',
    fontSize: moderateScale(14),
    color: Colors.black,
    textAlign: 'center',
  },
  icon: {
    marginRight: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
