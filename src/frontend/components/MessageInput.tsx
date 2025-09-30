import React from 'react';
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Colors from '../constants/color';
import { moderateScale, scale } from '../constants/responsive';
import Icons from '../constants/svgPath';

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
    <View style={styles.inputWrapper}>
      <TouchableOpacity style={styles.attachButton} onPress={onAttachment}>
        <Icons.Clip height={moderateScale(30)} width={moderateScale(30)} />
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
        {value.trim().length > 0 ? (
          <Icons.SendIcon
            height={moderateScale(24)}
            width={moderateScale(24)}
            fill={Colors.white}
          />
        ) : (
          <Icons.MicroPhone
            height={moderateScale(24)}
            width={moderateScale(24)}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(26),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    minHeight: moderateScale(44),
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    backgroundColor: Colors.white,
    marginHorizontal: moderateScale(12),
    marginBottom: moderateScale(-14),
  },
  attachButton: {
    padding: moderateScale(6),
    marginRight: moderateScale(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: scale(12),
    color: Colors.black,
    maxHeight: moderateScale(80),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(4),
    textAlignVertical: 'center',
  },
  sendButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(4),
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonInactive: {
    backgroundColor: '#D1D5DB',
  },
  sendButtonText: {
    fontSize: scale(14),
    color: Colors.white,
    fontWeight: '600',
  },
});

export default MessageInput;
