import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/color';

interface CheckboxWithTermsProps {
  checked: boolean;
  onToggle: () => void;
  onTermsPress: () => void;
  onPrivacyPress: () => void;
  disabled?: boolean;
}

const CheckboxWithTerms: React.FC<CheckboxWithTermsProps> = ({
  checked,
  onToggle,
  onTermsPress,
  onPrivacyPress,
  disabled,
}) => (
  <TouchableOpacity
    style={styles.container}
    onPress={onToggle}
    disabled={disabled}
    activeOpacity={0.8}
  >
    <View style={[styles.checkbox, checked && styles.checkboxActive]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.text}>
      I agree to the{' '}
      <Text style={styles.link} onPress={onTermsPress}>
        Terms & Conditions
      </Text>{' '}
      and{' '}
      <Text style={styles.link} onPress={onPrivacyPress}>
        Privacy Policy
      </Text>
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
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
  checkboxActive: { backgroundColor: Colors.info, borderColor: Colors.info },
  checkmark: { color: Colors.white, fontSize: 12, fontWeight: 'bold' },
  text: { flex: 1, fontSize: 14, color: Colors.grayDark, lineHeight: 20 },
  link: { color: Colors.info, fontWeight: '500' },
});

export default CheckboxWithTerms;
