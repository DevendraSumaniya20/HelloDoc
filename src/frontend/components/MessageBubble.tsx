import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { Doctor, Message } from '../types/types';
import Colors from '../constants/color';
import { moderateScale, scale } from '../constants/responsive';

// Threshold for swipe-to-delete to trigger animation
const SWIPE_THRESHOLD = 40;

// Props for MessageBubble
interface MessageBubbleProps {
  message: Message; // Message object containing text, sender, timestamp
  doctor?: Doctor; // Doctor info for doctor messages
  searchQuery?: string; // Search text to highlight in message
  isActiveMatch?: boolean; // If the message is currently active search match
  isSelectionMode?: boolean; // True when multi-select mode is active
  isSelected?: boolean; // True if this message is selected
  onLongPress?: () => void; // Long press handler (to enable selection)
  onPress?: () => void; // Normal press handler
  onSwipeDelete?: () => void; // Swipe to delete callback
  onEdit?: (message: Message) => void; // Edit callback
  onDelete?: (message: Message) => void; // Delete callback
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  doctor,
  searchQuery,
  isActiveMatch = false,
  isSelectionMode = false,
  isSelected = false,
  onLongPress,
  onPress,
  onSwipeDelete,
  onEdit,
  onDelete,
}) => {
  const isUserMessage = message.sender === 'user'; // Determine if message is from user
  const translateX = useRef(new Animated.Value(0)).current; // Swipe X position
  const lastOffset = useRef(0);

  // For delete icon animation
  const deleteAnim = useRef(new Animated.Value(0)).current; // 0 = hidden, 1 = visible

  // Format message timestamp to HH:MM
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Highlight search query text inside message
  const getHighlightedText = (text: string, highlight?: string) => {
    if (!highlight) return <Text>{text}</Text>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <Text
          key={index}
          style={[
            isActiveMatch ? styles.activeHighlight : styles.highlight,
            { borderRadius: 4, paddingHorizontal: 2 },
          ]}
        >
          {part}
        </Text>
      ) : (
        <Text key={index}>{part}</Text>
      ),
    );
  };

  // -------------------- Swipe to delete logic --------------------
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isSelectionMode,
      onMoveShouldSetPanResponder: (_, g) =>
        !isSelectionMode && Math.abs(g.dx) > 5,
      onPanResponderGrant: () => {
        translateX.setOffset(lastOffset.current);
        translateX.setValue(0);
      },
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) {
          translateX.setValue(g.dx);

          // Animate trash icon when swipe passes threshold
          if (Math.abs(g.dx) > SWIPE_THRESHOLD) {
            Animated.spring(deleteAnim, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.spring(deleteAnim, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        }
      },
      onPanResponderRelease: (_, g) => {
        translateX.flattenOffset();
        if (g.dx < -80) {
          // If swiped enough, trigger delete
          Animated.timing(translateX, {
            toValue: -200,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSwipeDelete?.();
            translateX.setValue(0);
            lastOffset.current = 0;
            deleteAnim.setValue(0);
          });
        } else {
          // Reset position if not swiped enough
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
          lastOffset.current = 0;
          Animated.spring(deleteAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.messageWrapper}>
      {/* Animated Delete Indicator (trash icon slides in while swiping) */}
      <Animated.View
        style={[
          styles.deleteIndicator,
          {
            opacity: deleteAnim,
            transform: [
              {
                scale: deleteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
              {
                translateX: deleteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0], // slides in from right
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.messageContainer,
          isUserMessage
            ? styles.userMessageContainer
            : styles.doctorMessageContainer,
          { transform: [{ translateX }] },
          isSelected && styles.selectedMessage,
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onLongPress={onLongPress}
          onPress={onPress}
          delayLongPress={500}
          activeOpacity={0.7}
          style={{ flexDirection: 'row' }}
        >
          {/* Checkbox for selection mode */}
          {isSelectionMode && (
            <View style={styles.checkboxContainer}>
              <View
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              >
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          )}

          {/* Avatar for doctor messages */}
          {!isUserMessage && doctor && (
            <Image
              source={{ uri: doctor.image }}
              style={styles.messageAvatar}
            />
          )}

          {/* Message bubble */}
          <View
            style={[
              styles.messageBubble,
              isUserMessage
                ? styles.userMessageBubble
                : styles.doctorMessageBubble,
            ]}
          >
            {/* Message text with search highlight */}
            <Text
              style={[
                styles.messageText,
                isUserMessage
                  ? styles.userMessageText
                  : styles.doctorMessageText,
              ]}
            >
              {getHighlightedText(message.text, searchQuery)}
            </Text>

            {/* Message timestamp */}
            <Text
              style={[
                styles.messageTime,
                isUserMessage
                  ? styles.userMessageTime
                  : styles.doctorMessageTime,
              ]}
            >
              {formatTime(message.timestamp)}
              {message.edited && ' (edited)'}
            </Text>

            {/* Optional Edit & Delete buttons */}
            {(onEdit || onDelete) && (
              <View style={styles.actionContainer}>
                {onEdit && (
                  <Text style={styles.editText} onPress={() => onEdit(message)}>
                    Edit
                  </Text>
                )}
                {onDelete && (
                  <Text
                    style={styles.deleteActionText}
                    onPress={() => onDelete(message)}
                  >
                    Delete
                  </Text>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  messageWrapper: {
    position: 'relative', // For positioning delete icon absolutely
    marginBottom: moderateScale(16),
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
    paddingHorizontal: moderateScale(16),
  },
  userMessageContainer: {
    justifyContent: 'flex-end', // Align user messages to right
    alignSelf: 'flex-end',
  },
  doctorMessageContainer: {
    justifyContent: 'flex-start', // Align doctor messages to left
  },
  selectedMessage: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)', // Highlight selected message
    borderRadius: moderateScale(8),
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
    fontSize: scale(14),
    lineHeight: moderateScale(20),
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
  highlight: {
    backgroundColor: '#FFF176', // Highlight search matches
    color: '#000',
  },
  activeHighlight: {
    backgroundColor: '#FFA726', // Highlight currently active search match
    color: '#000',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: moderateScale(4),
  },
  editText: {
    color: Colors.info, // Edit button color
    marginRight: moderateScale(12),
    fontWeight: '500',
  },
  deleteActionText: {
    color: Colors.error, // Delete button color
    fontWeight: '500',
  },
  deleteIndicator: {
    position: 'absolute', // Trash icon for swipe-to-delete
    right: moderateScale(16),
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(80),
  },
  deleteText: {
    color: '#FF0000',
    fontSize: 20,
    fontWeight: '600',
  },
  checkboxContainer: {
    justifyContent: 'center', // Container for selection checkbox
    marginRight: moderateScale(8),
  },
  checkbox: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary, // Checked state color
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MessageBubble;
