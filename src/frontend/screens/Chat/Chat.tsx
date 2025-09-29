// src/screens/Chat/Chat.tsx
import React, { useRef, useEffect, useState } from 'react';
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

  if (!doctor) {
    return (
      <Components.ErrorScreen
        title="⚠️ Doctor Not Found"
        message="Unable to load doctor information. Please try again."
        onGoBack={() => navigation.goBack()}
      />
    );
  }

  // ✅ 1. Keep doctor in local state for dynamic updates
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>(
    route.params.doctor,
  );

  useEffect(() => {
    if (route.params?.doctor) {
      setCurrentDoctor(route?.params?.doctor);
    }
  }, [route.params?.doctor]);

  // Example: auto-update doctor status every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      // TODO: replace with actual API call to get latest status
      // const res = await fetchDoctorStatus(doctor.id);
      // setCurrentDoctor(prev => ({ ...prev, status: res.status, lastSeen: res.lastSeen }));

      // For demo purposes, simulate offline/online toggle

      setCurrentDoctor(prev => {
        if (prev.status === 'online') {
          return {
            ...prev,
            status: 'offline',
            lastSeen: new Date().toISOString(),
          };
        }
        return { ...prev, status: 'online' };
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [doctor.id]);

  const {
    messages,
    inputText,
    setInputText,
    sendMessage,
    isTyping,
    isLoading,
  } = useChat(currentDoctor);

  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  }, [messages, isLoading]);

  // Navigation & action handlers
  const handleGoBack = () => navigation.goBack();
  const handleCall = () => console.log('Call functionality not implemented');
  const handleVideoCall = () =>
    console.log('Video call functionality not implemented');
  const handleDoctorInfo = () =>
    console.log('Doctor info functionality not implemented');
  const handleViewProfile = () =>
    console.log('View profile functionality not implemented');
  const handleAttachment = () =>
    console.log('Attachment functionality not implemented');

  // Render functions
  const renderMessage = ({ item }: { item: Message }) => (
    <Components.MessageBubble message={item} doctor={currentDoctor} />
  );

  const renderListHeader = () => (
    <Components.DoctorInfoCard
      doctor={currentDoctor}
      onViewProfile={handleViewProfile}
    />
  );

  const renderListFooter = () => (
    <Components.TypingIndicator doctor={currentDoctor} isVisible={isTyping} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Components.ChatHeader
          doctor={currentDoctor}
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
        doctor={currentDoctor}
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
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />

        <Components.MessageInput
          value={inputText}
          onChangeText={setInputText}
          onSend={() =>
            sendMessage(status =>
              setCurrentDoctor(prev => ({
                ...prev,
                status,
                lastSeen:
                  status === 'offline'
                    ? new Date().toISOString()
                    : prev.lastSeen,
              })),
            )
          }
          onAttachment={handleAttachment}
          placeholder={`Message Dr. ${currentDoctor.name}...`}
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
