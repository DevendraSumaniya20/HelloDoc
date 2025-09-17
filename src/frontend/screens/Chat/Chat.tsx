import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../../types/types';
import { moderateScale } from '../../constants/responsive';
import Colors from '../../constants/color';

const { width, height } = Dimensions.get('window');

type ChatScreenRouteProp = RouteProp<MainStackParamList, 'Chat'>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
  type?: 'text' | 'image' | 'voice';
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  status?: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

const Chat: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const doctor: Doctor | undefined = route.params?.doctor;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm Dr. ${doctor?.name}. How can I help you today?`,
      sender: 'doctor',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: '2',
      text: 'Hi Doctor, I have been experiencing some symptoms lately.',
      sender: 'user',
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    },
    {
      id: '3',
      text: 'I understand your concern. Could you please describe the symptoms in detail? When did they start?',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Text style={styles.errorTitle}>⚠️ No Doctor Data</Text>
          <Text style={styles.errorMessage}>
            Unable to load doctor information
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const sendMessage = (): void => {
    if (inputText.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate doctor typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for sharing that information. Let me review your symptoms and provide appropriate guidance.',
        sender: 'doctor',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUserMessage = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage
            ? styles.userMessageContainer
            : styles.doctorMessageContainer,
        ]}
      >
        {!isUserMessage && (
          <Image source={{ uri: doctor.image }} style={styles.messageAvatar} />
        )}

        <View
          style={[
            styles.messageBubble,
            isUserMessage
              ? styles.userMessageBubble
              : styles.doctorMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUserMessage ? styles.userMessageText : styles.doctorMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isUserMessage ? styles.userMessageTime : styles.doctorMessageTime,
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.doctorMessageContainer]}>
        <Image source={{ uri: doctor.image }} style={styles.messageAvatar} />
        <View
          style={[
            styles.messageBubble,
            styles.doctorMessageBubble,
            styles.typingBubble,
          ]}
        >
          <Text style={styles.typingText}>Dr. {doctor.name} is typing</Text>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>

        <View style={styles.doctorInfo}>
          <Image source={{ uri: doctor.image }} style={styles.headerAvatar} />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <View style={styles.doctorStatus}>
              <View
                style={[
                  styles.statusDot,
                  doctor.status === 'online'
                    ? styles.onlineStatus
                    : styles.offlineStatus,
                ]}
              />
              <Text style={styles.statusText}>
                {doctor.status === 'online' ? 'Online' : 'Last seen 2h ago'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>ⓘ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Doctor Info Card */}
      <View style={styles.doctorCard}>
        <View style={styles.cardContent}>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {doctor.rating}</Text>
            <Text style={styles.reviews}>({doctor.reviews} reviews)</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachButtonText}>📎</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={Colors.grayDark}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim().length > 0
                ? styles.sendButtonActive
                : styles.sendButtonInactive,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim().length === 0}
          >
            <Text style={styles.sendButtonText}>
              {inputText.trim().length > 0 ? '➤' : '🎤'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
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
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backIcon: {
    padding: moderateScale(8),
    marginRight: moderateScale(8),
  },
  backIconText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '600',
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(12),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: moderateScale(2),
  },
  doctorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(6),
  },
  onlineStatus: {
    backgroundColor: '#10B981',
  },
  offlineStatus: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: moderateScale(8),
    marginLeft: moderateScale(4),
  },
  actionButtonText: {
    fontSize: 20,
    color: Colors.white,
  },
  doctorCard: {
    backgroundColor: Colors.white,
    marginHorizontal: moderateScale(16),
    marginVertical: moderateScale(12),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flex: 1,
  },
  specialty: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: moderateScale(4),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
    marginRight: moderateScale(8),
  },
  reviews: {
    fontSize: 12,
    color: Colors.grayDark,
  },
  viewProfileButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(6),
  },
  viewProfileText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: moderateScale(16),
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
    paddingHorizontal: moderateScale(16),
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
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
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(16),
  },
  typingText: {
    fontSize: 14,
    color: Colors.grayDark,
    fontStyle: 'italic',
    marginRight: moderateScale(8),
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: Colors.grayDark,
    marginHorizontal: moderateScale(1),
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.4,
  },
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
