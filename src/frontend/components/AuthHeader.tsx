import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/color';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  header: { marginTop: 60, marginBottom: 40, alignItems: 'center' },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: Colors.secondary, textAlign: 'center' },
});

export default AuthHeader;
