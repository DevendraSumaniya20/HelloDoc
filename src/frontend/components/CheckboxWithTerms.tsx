import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/color';

interface CheckboxWithTermsProps {
  checked: boolean;
  onToggle: () => void;
  onTermsPress: () => void;
  onPrivacyPress: () => void;
  disabled?: boolean;
  errorMessage?: string;
  errorStyle?: object;
  containerStyle?: object;
}

const CheckboxWithTerms: React.FC<CheckboxWithTermsProps> = ({
  checked,
  onToggle,
  onTermsPress,
  onPrivacyPress,
  disabled = false,
  errorMessage,
  errorStyle,
  containerStyle,
}) => {
  const hasError = Boolean(errorMessage);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.container,
          hasError && styles.containerError,
          disabled && styles.containerDisabled,
        ]}
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.checkbox,
            checked && styles.checkboxActive,
            hasError && !checked && styles.checkboxError,
            disabled && styles.checkboxDisabled,
          ]}
        >
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[
            styles.text,
            disabled && styles.textDisabled,
            hasError && styles.textError,
          ]}
        >
          I agree to the{' '}
          <Text
            style={[styles.link, disabled && styles.linkDisabled]}
            onPress={disabled ? undefined : onTermsPress}
          >
            Terms & Conditions
          </Text>{' '}
          and{' '}
          <Text
            style={[styles.link, disabled && styles.linkDisabled]}
            onPress={disabled ? undefined : onPrivacyPress}
          >
            Privacy Policy
          </Text>
        </Text>
      </TouchableOpacity>
      {hasError && (
        <Text style={[styles.errorText, errorStyle]}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 30,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerError: {
    // Optional: Add subtle background or border for error state
  },
  containerDisabled: {
    opacity: 0.6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.grayLight,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.info,
    borderColor: Colors.info,
  },
  checkboxError: {
    borderColor: '#ef4444',
  },
  checkboxDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
  },
  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: Colors.grayDark,
    lineHeight: 20,
  },
  textError: {
    color: '#374151', // Keep text readable but indicate error state
  },
  textDisabled: {
    color: '#9ca3af',
  },
  link: {
    color: Colors.info,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  linkDisabled: {
    color: '#9ca3af',
    textDecorationLine: 'none',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 32, // Align with text, accounting for checkbox width + margin
  },
});

export default CheckboxWithTerms;
