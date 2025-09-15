import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/color';

const Divider = () => (
  <View style={styles.container}>
    <View style={styles.line} />
    <Text style={styles.text}>OR</Text>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  line: { flex: 1, height: 1, backgroundColor: Colors.grayLight },
  text: { marginHorizontal: 16, fontSize: 14, color: Colors.grayMedium },
});

export default Divider;
