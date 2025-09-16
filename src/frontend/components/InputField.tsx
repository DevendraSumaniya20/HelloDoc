import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/color';
import { moderateScale, scale } from '../constants/responsive';
import Icons from '../constants/svgPath';

interface InputFieldProps extends TextInputProps {
  label: string;
  containerStyle?: object;
  inputStyle?: object;
  labelStyle?: object;
  errorMessage?: string;
  errorStyle?: object;
  required?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  containerStyle,
  inputStyle,
  labelStyle,
  errorMessage,
  errorStyle,
  required = false,
  disabled = false,
  secureTextEntry,
  leftIcon,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorMessage);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus && props.onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur && props.onBlur(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            hasError && styles.inputError,
            disabled && styles.inputDisabled,
            inputStyle,
          ]}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.grayMedium}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <Icons.EyeOn
                width={20}
                height={20}
                fill={isFocused ? Colors.primary : Colors.grayDark}
              />
            ) : (
              <Icons.EyeOff
                width={20}
                height={20}
                fill={isFocused ? Colors.primary : Colors.grayDark}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <Text style={[styles.errorText, errorStyle]}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateScale(20),
  },
  label: {
    fontSize: scale(14),
    fontWeight: '400',
    color: Colors.grayDark,
    marginBottom: moderateScale(8),
  },
  required: {
    color: Colors.error,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.1,
    borderColor: Colors.neutral,
    borderRadius: moderateScale(14),
    backgroundColor: Colors.white,
    height: moderateScale(50),
    paddingHorizontal: moderateScale(16),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    borderWidth: 1,
    shadowOpacity: 0.12,
    elevation: 4,
  },
  inputWrapperError: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
  inputWrapperDisabled: {
    backgroundColor: Colors.grayLight,
    shadowOpacity: 0.04,
    elevation: 1,
  },
  leftIconContainer: {
    marginRight: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: scale(14),
    paddingHorizontal: moderateScale(4),
    color: Colors.black,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  inputWithLeftIcon: {},
  eyeButton: {
    padding: moderateScale(8),
    marginLeft: moderateScale(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {},
  inputDisabled: {
    color: Colors.grayMedium,
  },
  errorText: {
    color: Colors.error,
    fontSize: scale(12),
    marginTop: moderateScale(4),
    marginLeft: moderateScale(16),
  },
});

export default InputField;
