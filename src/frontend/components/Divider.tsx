import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Divider = () => (
  <View style={styles.container}>
    <View style={styles.line} />
    <Text style={styles.text}>OR</Text>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  text: { marginHorizontal: 16, fontSize: 14, color: '#999' },
});

export default Divider;
