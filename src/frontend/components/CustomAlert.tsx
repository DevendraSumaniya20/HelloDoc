import React, { FC, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckboxWithTerms from './CheckboxWithTerms'; // Import your checkbox

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  description: string;
  variant?: AlertVariant;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftText?: string;
  rightText?: string;
}

const CustomAlert: FC<CustomAlertProps> = ({
  visible,
  title,
  description,
  variant = 'info',
  onLeftPress,
  onRightPress,
  leftText = 'Cancel',
  rightText = 'OK',
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FF9800';
      case 'info':
      default:
        return '#2196F3';
    }
  };

  const handleDismiss = async (callback?: () => void) => {
    if (dontShowAgain) {
      await AsyncStorage.setItem('dontShowAIAlert', 'true');
    }
    callback?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { borderColor: getVariantColor() }]}>
          <Text style={[styles.title, { color: getVariantColor() }]}>
            {title}
          </Text>
          <Text style={styles.description}>{description}</Text>

          {/* Don't show again checkbox */}
          <CheckboxWithTerms
            checked={dontShowAgain}
            onToggle={() => setDontShowAgain(prev => !prev)}
            onTermsPress={() => {}}
            onPrivacyPress={() => {}}
            label="Don't show this again"
            containerStyle={{ marginBottom: 20 }}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDismiss(onLeftPress)}
            >
              <Text style={styles.buttonText}>{leftText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDismiss(onRightPress)}
            >
              <Text style={styles.buttonText}>{rightText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
