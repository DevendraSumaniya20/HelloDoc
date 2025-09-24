import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/color';
import { moderateScale } from '../constants/responsive';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onGoBack: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = '⚠️ Something went wrong',
  message = 'Unable to load chat information',
  onGoBack,
}) => {
  return (
    <SafeAreaView style={styles.errorContainer}>
      <View style={styles.errorContent}>
        <Text style={styles.errorTitle}>{title}</Text>
        <Text style={styles.errorMessage}>{message}</Text>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(40),
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: moderateScale(12),
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.grayDark,
    textAlign: 'center',
    marginBottom: moderateScale(30),
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorScreen;
