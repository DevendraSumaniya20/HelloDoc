import React from 'react';
import {
  TouchableOpacity,
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
  icon?: React.ReactNode; // Optional icon
  title?: string; // Optional custom text
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
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.text}>{title || 'Continue'}</Text>
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(8),
    marginVertical: moderateScale(8),
    justifyContent: 'center',
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
    borderWidth: 0.2,
    borderColor: Colors.black,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    color: '#000',
  },
  icon: {
    marginRight: moderateScale(6),
  },
});
