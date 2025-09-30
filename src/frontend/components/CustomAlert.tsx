import React, { FC, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckboxWithTerms from './CheckboxWithTerms';

import Colors from '../constants/color';
import { moderateScale, scale } from '../constants/responsive';

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
  showTerms?: boolean; // new optional prop
  showPrivacy?: boolean; // new optional prop
  onTermsPress?: () => void; // optional callback
  onPrivacyPress?: () => void; // optional callback
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
  showTerms = false,
  showPrivacy = false,
  onTermsPress,
  onPrivacyPress,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      case 'info':
      default:
        return Colors.info;
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

          {/* Optional Terms & Privacy checkbox */}
          {(showTerms || showPrivacy) && (
            <CheckboxWithTerms
              checked={dontShowAgain}
              onToggle={() => setDontShowAgain(prev => !prev)}
              onTermsPress={onTermsPress || (() => {})}
              onPrivacyPress={onPrivacyPress || (() => {})}
              label="Don't show this again"
              containerStyle={{ marginBottom: moderateScale(16) }}
              showTerms={showTerms}
              showPrivacy={showPrivacy}
            />
          )}

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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    padding: moderateScale(20),
    borderWidth: 2,
  },
  title: {
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: moderateScale(10),
    textAlign: 'center',
  },
  description: {
    fontSize: scale(14),
    marginBottom: moderateScale(16),
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: moderateScale(10),
    marginHorizontal: moderateScale(5),
    backgroundColor: Colors.grayLight,
    borderRadius: moderateScale(6),
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});
