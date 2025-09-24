import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Doctor, Message } from '../types/types';
import Colors from '../constants/color';
import { moderateScale } from '../constants/responsive';

interface MessageBubbleProps {
  message: Message;
  doctor?: Doctor;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, doctor }) => {
  const isUserMessage = message.sender === 'user';

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View
      style={[
        styles.messageContainer,
        isUserMessage
          ? styles.userMessageContainer
          : styles.doctorMessageContainer,
      ]}
    >
      {!isUserMessage && doctor && (
        <Image source={{ uri: doctor.image }} style={styles.messageAvatar} />
      )}

      <View
        style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessageBubble : styles.doctorMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUserMessage ? styles.userMessageText : styles.doctorMessageText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isUserMessage ? styles.userMessageTime : styles.doctorMessageTime,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
    paddingHorizontal: moderateScale(16),
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
      alignSelf: 'flex-end', 
  },
  doctorMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    marginRight: moderateScale(8),
    marginTop: moderateScale(4),
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(18),
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  userMessageBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: moderateScale(4),
  },
  doctorMessageBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: moderateScale(4),
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: moderateScale(4),
  },
  userMessageText: {
    color: Colors.white,
  },
  doctorMessageText: {
    color: Colors.black,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  doctorMessageTime: {
    color: Colors.grayDark,
  },
});

export default MessageBubble;
