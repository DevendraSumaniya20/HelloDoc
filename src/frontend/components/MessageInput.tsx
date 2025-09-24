import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import Colors from '../constants/color';
import { moderateScale } from '../constants/responsive';

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttachment?: () => void;
  placeholder?: string;
  maxLength?: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChangeText,
  onSend,
  onAttachment,
  placeholder = 'Type your message...',
  maxLength = 1000,
}) => {

  const handleSend = () => {
    if (value.trim().length === 0) return;
    onSend();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.inputContainer}
    >
      <View style={styles.inputWrapper}>
        <TouchableOpacity style={styles.attachButton} onPress={onAttachment}>
          <Text style={styles.attachButtonText}>📎</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.grayDark}
          multiline
          maxLength={maxLength}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            value.trim().length > 0
              ? styles.sendButtonActive
              : styles.sendButtonInactive,
          ]}
          onPress={handleSend}
          disabled={value.trim().length === 0}
        >
          <Text style={styles.sendButtonText}>
            {value.trim().length > 0 ? '➤' : '🎤'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: Colors.white,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    minHeight: moderateScale(48),
  },
  attachButton: {
    padding: moderateScale(8),
    marginRight: moderateScale(8),
  },
  attachButtonText: {
    fontSize: 20,
    color: Colors.grayDark,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    maxHeight: moderateScale(100),
    paddingVertical: moderateScale(8),
    lineHeight: 20,
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(8),
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: Colors.grayLight,
  },
  sendButtonText: {
    fontSize: 18,
    color: Colors.white,
  },
});

export default MessageInput;
