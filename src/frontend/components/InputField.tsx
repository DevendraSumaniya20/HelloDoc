import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Colors from '../constants/color';
import { moderateScale, scale } from '../constants/responsive';

interface InputFieldProps extends TextInputProps {
  label: string;
  containerStyle?: object; // allows custom styling like width
  inputStyle?: object;
  labelStyle?: object;
  errorMessage?: string;
  errorStyle?: object;
  required?: boolean;
  disabled?: boolean;
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
  ...props
}) => {
  const hasError = Boolean(errorMessage);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          hasError && styles.inputError,
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        editable={!disabled}
        {...props}
      />
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
  input: {
    height: moderateScale(44),
    borderWidth: 1,
    borderColor: Colors.neutral,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    fontSize: scale(14),
    backgroundColor: Colors.grayLight,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.grayLight,
  },
  inputDisabled: {
    backgroundColor: Colors.white,
    color: Colors.grayMedium,
  },
  errorText: {
    color: Colors.error,
    fontSize: scale(12),
    marginTop: moderateScale(4),
    marginLeft: moderateScale(4),
  },
});

export default InputField;
