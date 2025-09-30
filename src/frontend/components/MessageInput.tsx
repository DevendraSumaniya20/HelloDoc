import React from 'react';
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Platform, // Import Platform for OS-specific logic
  KeyboardAvoidingView, // Import KeyboardAvoidingView
} from 'react-native';
import Colors from '../constants/color';
import { moderateScale, scale, verticalScale } from '../constants/responsive';
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
    // The KeyboardAvoidingView now uses absolute positioning
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // Adjust offset for iOS safe area (if needed, or match padding on other container)
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? verticalScale(5) : moderateScale(0)
      }
      style={styles.keyboardAvoidingContainer}
    >
      {/* WhatsApp's input is a single rounded box, so the attach button is outside the text box */}
      <View style={styles.contentContainer}>
        <View style={styles.textInputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={onAttachment}>
            {/* The clip icon is usually within the text input box on WhatsApp */}
            <Icons.Clip height={moderateScale(24)} width={moderateScale(24)} />
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
        </View>

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // *** Main container with Absolute positioning and solid background ***
  keyboardAvoidingContainer: {
    position: 'absolute',
    bottom: 0, // Stick to the very bottom
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.white, // Solid white background for the input bar area
    paddingVertical: verticalScale(8), // Add padding to space out the content
  },
  contentContainer: {
    // This replaces your old inputWrapper and holds both the rounded text input and the send button
    flexDirection: 'row',
    alignItems: 'flex-end', // Align items to the bottom, especially with multiline
    marginHorizontal: moderateScale(12),
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: moderateScale(26),
    backgroundColor: Colors.white, // The text input box background (usually slightly lighter gray)
    minHeight: moderateScale(44),
    paddingHorizontal: moderateScale(8),
    marginRight: moderateScale(8),
    // WhatsApp input box style: small border, no top border from the old design
    borderWidth: 1,
    borderColor: Colors.grayLight, // Subtle border
  },
  attachButton: {
    padding: moderateScale(8),
    justifyContent: 'center',
    alignSelf: 'flex-end', // Stick to the bottom of the input container
  },
  textInput: {
    flex: 1,
    fontSize: scale(12),
    color: Colors.black,
    maxHeight: moderateScale(80),
    paddingVertical: moderateScale(8), // Increased vertical padding for better feel
    paddingHorizontal: moderateScale(4),
    textAlignVertical: 'center', // Important for Android to align text vertically
  },
  sendButton: {
    width: moderateScale(40), // Slightly larger than before
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    // Position the send button to align with the text input's bottom
    marginBottom: moderateScale(2),
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
    backgroundColor: '#D1D5DB', // A light gray for the microphone/inactive send button
  },
  // The sendButtonText style is no longer needed since we use an Icon for sending.
});

export default MessageInput;
