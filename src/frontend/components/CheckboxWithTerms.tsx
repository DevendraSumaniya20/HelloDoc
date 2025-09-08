import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  text: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20 },
  link: { color: '#007AFF', fontWeight: '500' },
});

export default CheckboxWithTerms;
