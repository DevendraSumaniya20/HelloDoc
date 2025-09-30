import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/color';
import { moderateScale } from '../constants/responsive';
import { getGradientProps } from '../utils/gradients';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textStyle?: object;
  buttonStyle?: object;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  leftIcon,
  rightIcon,
  textStyle,
  buttonStyle,
}) => {
  const getVariantStyle = () => {
    if (loading) {
      return { backgroundColor: Colors.grayDark, borderWidth: 0 };
    }

    switch (variant) {
      case 'secondary':
        return { backgroundColor: Colors.grayDark, borderWidth: 0 };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: moderateScale(1),
          borderColor: Colors.info,
        };
      case 'danger':
        return { backgroundColor: Colors.error, borderWidth: 0 };
      case 'gradient':
        return {};
      default:
        return { backgroundColor: Colors.info, borderWidth: 0 };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          height: moderateScale(40),
          paddingHorizontal: moderateScale(12),
        };
      case 'large':
        return {
          height: moderateScale(60),
          paddingHorizontal: moderateScale(24),
        };
      default:
        return {
          height: moderateScale(50),
          paddingHorizontal: moderateScale(16),
        };
    }
  };

  const getTextColor = () => {
    if (disabled || loading) {
      return Colors.white;
    }
    switch (variant) {
      case 'outline':
        return Colors.info;
      default:
        return Colors.white;
    }
  };

  const getLoaderColor = () => {
    if (variant === 'outline') {
      return Colors.info;
    }
    return Colors.white;
  };

  const gradientProps = getGradientProps({ x: 0, y: 0 }, { x: 1, y: 1 });

  const Content = () =>
    loading ? (
      <ActivityIndicator size="small" color={getLoaderColor()} />
    ) : (
      <View style={styles.content}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
    );

  const finalButtonStyle = [
    styles.button,
    getSizeStyle(),
    disabled && styles.disabled,
    buttonStyle,
  ];

  const finalNonGradientButtonStyle = [...finalButtonStyle, getVariantStyle()];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={[
        fullWidth && { width: '100%' },
        (disabled || loading) && styles.touchableDisabled,
      ]}
    >
      {variant === 'gradient' ? (
        <LinearGradient
          {...gradientProps}
          style={[styles.button, getSizeStyle(), buttonStyle]}
        >
          <Content />
        </LinearGradient>
      ) : (
        <View style={finalNonGradientButtonStyle}>
          <Content />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(20),
    flexDirection: 'row',
  },
  disabled: {
    backgroundColor: Colors.grayLight,
    borderColor: Colors.grayLight,
  },
  touchableDisabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: moderateScale(6),
  },
});

export default PrimaryButton;
