import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Colors from '../constants/color';

interface InputFieldProps extends TextInputProps {
  label: string;
  containerStyle?: object; // allows custom styling like width
  inputStyle?: object;
  labelStyle?: object;
  errorMessage?: string;
  errorStyle?: object;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  containerStyle,
  inputStyle,
  labelStyle,
  ...props
}) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={[styles.label, labelStyle]}>{label}</Text>
    <TextInput style={[styles.input, inputStyle]} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grayMedium,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Colors.grayLight,
  },
});

export default InputField;
