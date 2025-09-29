// src/screens/Chat/Chat.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList, Doctor, Message } from '../../types/types';
import Colors from '../../constants/color';
import { useChat } from '../../hooks/useChat';
import Components from '../../components';
import { moderateScale } from '../../constants/responsive';

type ChatProps = NativeStackScreenProps<MainStackParamList, 'Chat'>;

const Chat: React.FC<ChatProps> = ({ route, navigation }) => {
  const doctor = route.params?.doctor;

  // Error handling for missing doctor data
  if (!doctor) {
    return (
      <Components.ErrorScreen
        title="⚠️ Doctor Not Found"
        message="Unable to load doctor information. Please try again."
        onGoBack={() => navigation.goBack()}
      />
    );
  }

  const {
    messages,
    inputText,
    setInputText,
    sendMessage,
    isTyping,
    isLoading,
  } = useChat(doctor);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  // Handle back navigation
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Handle call functionality (placeholder)
  const handleCall = () => {
    console.log('Call functionality not implemented');
    // TODO: Implement call functionality
  };

  // Handle video call functionality (placeholder)
  const handleVideoCall = () => {
    console.log('Video call functionality not implemented');
    // TODO: Implement video call functionality
  };

  // Handle doctor info
  const handleDoctorInfo = () => {
    console.log('Doctor info functionality not implemented');
    // TODO: Navigate to doctor profile or show info modal
  };

  // Handle view profile
  const handleViewProfile = () => {
    console.log('View profile functionality not implemented');
    // TODO: Navigate to doctor profile
  };

  // Handle attachment (placeholder)
  const handleAttachment = () => {
    console.log('Attachment functionality not implemented');
    // TODO: Implement attachment functionality
  };

  // Render message item
  const renderMessage = ({ item }: { item: Message }) => (
    <Components.MessageBubble message={item} doctor={doctor} />
  );

  // Render header component for FlatList
  const renderListHeader = () => (
    <Components.DoctorInfoCard
      doctor={doctor}
      onViewProfile={handleViewProfile}
    />
  );

  // Render footer component for FlatList (typing indicator)
  const renderListFooter = () => (
    <Components.TypingIndicator doctor={doctor} isVisible={isTyping} />
  );

  // Render loading state while fetching chat history
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Components.ChatHeader
          doctor={doctor}
          onBack={handleGoBack}
          onCall={handleCall}
          onVideoCall={handleVideoCall}
          onInfo={handleDoctorInfo}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading chat history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Components.ChatHeader
        doctor={doctor}
        onBack={handleGoBack}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
        onInfo={handleDoctorInfo}
      />

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          renderItem={renderMessage}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
          onContentSizeChange={() => {
            // Auto-scroll when content size changes
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            // Auto-scroll when layout changes
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />

        <Components.MessageInput
          value={inputText}
          onChangeText={setInputText}
          onSend={sendMessage}
          onAttachment={handleAttachment}
          placeholder={`Message Dr. ${doctor.name}...`}
          maxLength={1000}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayLight,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: moderateScale(16),
    fontSize: 16,
    color: Colors.grayDark,
    fontWeight: '500',
  },
});

export default Chat;
