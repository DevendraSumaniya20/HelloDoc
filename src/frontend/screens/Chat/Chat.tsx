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
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList, Doctor, Message } from '../../types/types';
import Colors from '../../constants/color';
import Components from '../../components';
import { moderateScale } from '../../constants/responsive';
import { useChat } from '../../hooks/useChat';

// Define props for Chat screen from navigation stack
type ChatProps = NativeStackScreenProps<MainStackParamList, 'Chat'>;

const Chat: React.FC<ChatProps> = ({ route, navigation }) => {
  // Get doctor info from navigation route
  const doctorFromRoute = route.params?.doctor;

  // If doctor is missing, show error screen
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

  // -------------------- State Management --------------------
  // Search modal
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<number[]>([]); // Indices of messages matching search
  const [activeMatchIndex, setActiveMatchIndex] = useState(0); // Currently highlighted match

  // Selection mode (for multi-selecting messages)
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
    new Set(),
  );

  // More options modal (⋮ menu)
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);

  // -------------------- Custom Chat Hook --------------------
  // Handles messages, input, sending, editing, deleting
  const {
    messages: chatMessages,
    inputText,
    setInputText,
    sendMessage,
    isTyping,
    isLoading,
    editMessage,
    deleteMessage,
    clearChat,
  } = useChat(currentDoctor);

  const flatListRef = useRef<FlatList>(null); // Reference to scroll FlatList

  // Scroll to end whenever new messages arrive
  useEffect(() => {
    if (chatMessages.length > 0 && !isLoading) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  }, [chatMessages, isLoading]);

  // -------------------- Event Handlers --------------------
  const handleGoBack = () => navigation.goBack();
  const handleCall = () => console.log('Call functionality not implemented');
  const handleVideoCall = () =>
    console.log('Video call functionality not implemented');
  const handleViewProfile = () =>
    console.log('View profile functionality not implemented');

  const handleSearch = () => {
    setIsMoreOptionsVisible(false);
    setIsSearchVisible(true);
  };

  const handleClearChat = async () => {
    setIsMoreOptionsVisible(false);
    // Confirmation alert before clearing all messages
    Alert.alert('Clear Chat', 'Are you sure you want to delete all messages?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearChat();
          } catch (err) {
            console.error('Failed to clear chat:', err);
          }
        },
      },
    ]);
  };

  // Long press on a message activates selection mode
  const handleLongPress = (messageId: string) => {
    setIsSelectionMode(true);
    setSelectedMessages(new Set([messageId]));
  };

  // Toggle selection of a message in multi-select mode
  const toggleMessageSelection = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);

    // Exit selection mode if no messages selected
    if (newSelected.size === 0) {
      setIsSelectionMode(false);
    }
  };

  // Delete selected messages in batch
  const handleDeleteSelected = async () => {
    Alert.alert(
      'Delete Messages',
      `Delete ${selectedMessages.size} message(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const msgId of selectedMessages) {
                await deleteMessage(msgId);
              }
              setSelectedMessages(new Set());
              setIsSelectionMode(false);
            } catch (err) {
              console.error('Failed to delete messages:', err);
            }
          },
        },
      ],
    );
  };

  // Cancel selection mode
  const handleCancelSelection = () => {
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
  };

  // Edit a single selected message
  const handleEditSelected = () => {
    if (selectedMessages.size === 1) {
      const msgId = Array.from(selectedMessages)[0];
      const message = chatMessages.find(m => m.id === msgId);
      if (message) {
        Alert.prompt(
          'Edit Message',
          'Enter new text:',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Save',
              onPress: async newText => {
                if (newText && newText !== message.text) {
                  try {
                    await editMessage(msgId, newText);
                    setSelectedMessages(new Set());
                    setIsSelectionMode(false);
                  } catch (err) {
                    console.error('Failed to edit message:', err);
                  }
                }
              },
            },
          ],
          'plain-text',
          message.text,
        );
      }
    }
  };

  // -------------------- Search Functionality --------------------
  // Filter messages based on search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery) return chatMessages;
    return chatMessages.filter(m =>
      m.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chatMessages, searchQuery]);

  // Track all message indices that match search
  useEffect(() => {
    if (!searchQuery) {
      setMatches([]);
      setActiveMatchIndex(0);
      return;
    }

    const newMatches: number[] = [];
    chatMessages.forEach((msg, idx) => {
      if (msg.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        newMatches.push(idx);
      }
    });

    setMatches(newMatches);
    setActiveMatchIndex(0);
  }, [searchQuery, chatMessages]);

  // Scroll to the currently highlighted search match
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

  // Optimize FlatList performance by providing item layout
  const getItemLayout = (_: any, index: number) => ({
    length: 80,
    offset: 80 * index,
    index,
  });

  // -------------------- Render Functions --------------------
  // Render a single message bubble
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isActiveMatch = matches[activeMatchIndex] === index;
    const isSelected = selectedMessages.has(item.id);

    return (
      <Components.MessageBubble
        message={item}
        doctor={currentDoctor}
        searchQuery={isSearchVisible ? searchQuery : ''}
        isActiveMatch={isSearchVisible && isActiveMatch}
        isSelectionMode={isSelectionMode}
        isSelected={isSelected}
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => {
          if (isSelectionMode) {
            toggleMessageSelection(item.id);
          }
        }}
        onSwipeDelete={async () => {
          Alert.alert(
            'Delete Message',
            'Are you sure you want to delete this message?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await deleteMessage(item.id);
                  } catch (err) {
                    console.error('Failed to delete message:', err);
                  }
                },
              },
            ],
          );
        }}
      />
    );
  };

  // Render typing indicator at the end of messages
  const renderListFooter = () => (
    <Components.TypingIndicator doctor={currentDoctor} isVisible={isTyping} />
  );

  // -------------------- UI Rendering --------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Header: Shows selection mode or normal chat header */}
      {isSelectionMode ? (
        <View style={styles.selectionHeader}>
          <TouchableOpacity onPress={handleCancelSelection}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.selectionCount}>
            {selectedMessages.size} selected
          </Text>
          <View style={styles.selectionActions}>
            {selectedMessages.size === 1 && (
              <TouchableOpacity
                onPress={handleEditSelected}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleDeleteSelected}
              style={styles.actionButton}
            >
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.headerContainer}>
          {/* Normal chat header */}
          <Components.ChatHeader
            doctor={currentDoctor}
            onBack={handleGoBack}
            onCall={handleCall}
            onVideoCall={handleVideoCall}
            onProfilePress={handleViewProfile}
          />
          {/* More options button */}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setIsMoreOptionsVisible(true)}
          >
            <Text style={styles.moreIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chat messages */}
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
            if (chatMessages.length > 0)
              flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />

        {/* Input box for sending messages */}
        {!isSelectionMode && (
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
        )}
      </KeyboardAvoidingView>

      {/* More Options Modal (⋮) */}
      <Modal
        visible={isMoreOptionsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMoreOptionsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMoreOptionsVisible(false)}
        >
          <View style={styles.moreOptionsMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSearch}>
              <Text style={styles.menuItemText}>🔍 Search Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleClearChat}>
              <Text style={[styles.menuItemText, styles.dangerText]}>
                🗑️ Clear All Chat
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Search Modal */}
      <Modal
        visible={isSearchVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <View style={styles.searchModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Messages</Text>
            <Text
              style={styles.closeButton}
              onPress={() => setIsSearchVisible(false)}
            >
              ×
            </Text>
          </View>

          {/* Search input box */}
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search messages..."
            style={styles.searchInput}
          />

          {/* List of messages matching search */}
          <FlatList
            data={filteredMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
          />

          {/* Navigation between matches */}
          <View style={styles.searchNavigation}>
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

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.grayLight },
  chatContainer: { flex: 1 },
  messagesContainer: { flexGrow: 1, paddingVertical: moderateScale(16) },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moreButton: {
    padding: moderateScale(12),
    position: 'absolute',
    right: moderateScale(8),
    top: moderateScale(8),
  },
  moreIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    backgroundColor: Colors.primary,
  },
  cancelText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  selectionCount: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  selectionActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: moderateScale(12),
  },
  actionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteText: {
    color: '#ffcccb',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: moderateScale(60),
    paddingRight: moderateScale(16),
  },
  moreOptionsMenu: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(8),
    minWidth: moderateScale(200),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.black,
  },
  dangerText: {
    color: Colors.error || '#FF0000',
  },
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
  searchNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

export default Chat;
