import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList, Doctor, Message } from '../../types/types';
import Colors from '../../constants/color';
import Components from '../../components';
import { moderateScale } from '../../constants/responsive';
import { useChat } from '../../hooks/useChat';

type ChatProps = NativeStackScreenProps<MainStackParamList, 'Chat'>;

const Chat: React.FC<ChatProps> = ({ route, navigation }) => {
  const doctorFromRoute = route.params?.doctor;

  // If no doctor was passed, show error screen
  if (!doctorFromRoute) {
    return (
      <Components.ErrorScreen
        title="⚠️ Doctor Not Found"
        message="Unable to load doctor information. Please try again."
        onGoBack={() => navigation.goBack()}
      />
    );
  }

  const currentDoctor = doctorFromRoute;

  // Local state for messages, search modal, and search matches
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<number[]>([]);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  // Custom hook for chat messages and input handling
  const {
    messages: chatMessages,
    inputText,
    setInputText,
    sendMessage,
    isTyping,
    isLoading,
  } = useChat(currentDoctor);

  const flatListRef = useRef<FlatList>(null);

  // Sync localMessages with chatMessages
  useEffect(() => {
    setLocalMessages(chatMessages);
  }, [chatMessages]);

  // Scroll to end whenever messages change
  useEffect(() => {
    if (localMessages.length > 0 && !isLoading) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  }, [localMessages, isLoading]);

  // WhatsApp-style header actions
  const handleGoBack = () => navigation.goBack();
  const handleCall = () => console.log('Call functionality not implemented');
  const handleVideoCall = () =>
    console.log('Video call functionality not implemented');
  const handleViewProfile = () =>
    console.log('View profile functionality not implemented');
  const handleSearch = () => setIsSearchVisible(true);
  const handleClearChat = () => setLocalMessages([]);

  // Filter messages for search
  const filteredMessages = useMemo(() => {
    if (!searchQuery) return localMessages;
    return localMessages.filter(m =>
      m.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [localMessages, searchQuery]);

  // Update matches whenever searchQuery or filteredMessages change
  useEffect(() => {
    if (!searchQuery) {
      setMatches([]);
      setActiveMatchIndex(0);
      return;
    }

    // Compute matches based on localMessages, not filteredMessages
    const newMatches: number[] = [];
    localMessages.forEach((msg, idx) => {
      if (msg.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        newMatches.push(idx);
      }
    });

    setMatches(newMatches);
    setActiveMatchIndex(0);
  }, [searchQuery, localMessages]); // use localMessages as dependency

  // Scroll to the active search match
  useEffect(() => {
    if (matches.length > 0 && flatListRef.current) {
      try {
        flatListRef.current.scrollToIndex({
          index: matches[activeMatchIndex],
          animated: true,
          viewPosition: 0.5,
        });
      } catch {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    } else {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [activeMatchIndex, matches]);

  const getItemLayout = (_: any, index: number) => ({
    length: 80,
    offset: 80 * index,
    index,
  });

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isActiveMatch = matches[activeMatchIndex] === index;
    return (
      <Components.MessageBubble
        message={item}
        doctor={currentDoctor}
        searchQuery={isSearchVisible ? searchQuery : ''}
        isActiveMatch={isSearchVisible && isActiveMatch}
      />
    );
  };

  const renderListFooter = () => (
    <Components.TypingIndicator doctor={currentDoctor} isVisible={isTyping} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Components.ChatHeader
        doctor={currentDoctor}
        onBack={handleGoBack}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
        onProfilePress={handleViewProfile}
        onSearch={handleSearch}
        onClearChat={handleClearChat}
      />

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={filteredMessages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          getItemLayout={getItemLayout}
          renderItem={renderMessage}
          ListFooterComponent={renderListFooter}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => {
            if (localMessages.length > 0)
              flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />

        <Components.MessageInput
          value={inputText}
          onChangeText={setInputText}
          onSend={() =>
            sendMessage(status =>
              console.log(
                `Message sent. Doctor ${currentDoctor.name} status: ${status}`,
              ),
            )
          }
          placeholder={`Message Dr. ${currentDoctor.name}...`}
          maxLength={1000}
        />
      </KeyboardAvoidingView>

      {/* Search Modal */}
      {/* Search Modal */}
      <Modal
        visible={isSearchVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <View style={styles.searchModal}>
          {/* Close button */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Messages</Text>
            <Text
              style={styles.closeButton}
              onPress={() => setIsSearchVisible(false)}
            >
              ×
            </Text>
          </View>

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search messages..."
            style={styles.searchInput}
          />

          <FlatList
            data={filteredMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Button
              title="Prev"
              disabled={matches.length === 0}
              onPress={() =>
                setActiveMatchIndex(
                  prev => (prev - 1 + matches.length) % matches.length,
                )
              }
            />
            <Text>
              {matches.length
                ? `${activeMatchIndex + 1} of ${matches.length}`
                : '0 of 0'}
            </Text>
            <Button
              title="Next"
              disabled={matches.length === 0}
              onPress={() =>
                setActiveMatchIndex(prev => (prev + 1) % matches.length)
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.grayLight },
  chatContainer: { flex: 1 },
  messagesContainer: { flexGrow: 1, paddingVertical: moderateScale(16) },
  searchModal: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.grayDark,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  closeButton: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.grayDark,
    paddingHorizontal: 8,
  },
});

export default Chat;
