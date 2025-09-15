import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/color';

interface FooterLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  text,
  linkText,
  onPress,
  disabled,
}) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>{text} </Text>
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text style={[styles.linkText, disabled && styles.disabledText]}>
        {linkText}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  footerText: { fontSize: 14, color: Colors.grayMedium },
  linkText: { fontSize: 14, color: Colors.info, fontWeight: '600' },
  disabledText: { color: Colors.grayLight },
});

export default FooterLink;
