import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
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
import { useChat } from '../../hooks/useChat';
import ChatStyle from './ChatStyle';
import Icons from '../../constants/svgPath';
import { moderateScale } from '../../constants/responsive';
import LinearGradient from 'react-native-linear-gradient';
import { getGradientProps } from '../../utils/gradients';

type ChatProps = NativeStackScreenProps<MainStackParamList, 'Chat'>;

const Chat: React.FC<ChatProps> = ({ route, navigation }) => {
  const doctorFromRoute = route.params?.doctor;

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
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<number[]>([]);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
    new Set(),
  );

  // -------------------- Custom Chat Hook --------------------
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

  const flatListRef = useRef<FlatList>(null);

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
    setIsSearchVisible(true);
  };

  const handleClearChat = async () => {
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

  const handleExportChat = () => {
    console.log('Export chat functionality not implemented');
    Alert.alert('Export Chat', 'This feature will be available soon!');
  };

  const handleLongPress = (messageId: string) => {
    setIsSelectionMode(true);
    setSelectedMessages(new Set([messageId]));
  };

  const toggleMessageSelection = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);

    if (newSelected.size === 0) {
      setIsSelectionMode(false);
    }
  };

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

  const handleCancelSelection = () => {
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
  };

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
              onPress: async (newText: string | undefined) => {
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
  const filteredMessages = useMemo(() => {
    if (!searchQuery) return chatMessages;
    return chatMessages.filter(m =>
      m.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chatMessages, searchQuery]);

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

  // -------------------- Render Functions --------------------
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

  const renderListFooter = () => (
    <Components.TypingIndicator doctor={currentDoctor} isVisible={isTyping} />
  );

  // -------------------- UI Rendering --------------------
  return (
    <LinearGradient {...getGradientProps()} style={{ flex: 1 }}>
      <SafeAreaView style={ChatStyle.container}>
        {isSelectionMode ? (
          <View style={ChatStyle.selectionHeader}>
            <TouchableOpacity onPress={handleCancelSelection}>
              <Text style={ChatStyle.cancelText}>Cancel</Text>
            </TouchableOpacity>
            {/* FIX: Ensure the entire text is wrapped in Text component, 
               and complex expressions are clean. This is the most likely spot 
               where surrounding whitespace gets rendered as a text node. */}
            <Text style={ChatStyle.selectionCount}>
              {`${selectedMessages.size} selected`}
            </Text>
            <View style={ChatStyle.selectionActions}>
              {selectedMessages.size === 1 && (
                <TouchableOpacity
                  onPress={handleEditSelected}
                  style={ChatStyle.actionButton}
                >
                  <Text style={ChatStyle.actionText}>Edit</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleDeleteSelected}
                style={ChatStyle.actionButton}
              >
                <Text style={[ChatStyle.actionText, ChatStyle.deleteText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Components.ChatHeader
            doctor={currentDoctor}
            onBack={handleGoBack}
            onCall={handleCall}
            onVideoCall={handleVideoCall}
            onProfilePress={handleViewProfile}
            onSearch={handleSearch}
            onClearChat={handleClearChat}
            onExport={handleExportChat}
          />
        )}
        {/* Chat messages */}
        <KeyboardAvoidingView
          style={ChatStyle.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={filteredMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            getItemLayout={getItemLayout}
            contentContainerStyle={ChatStyle.messagesContainer}
            ListFooterComponent={renderListFooter}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (!isLoading && chatMessages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: false });
              }
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
        {/* Search Modal */}
        <Modal
          visible={isSearchVisible}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setIsSearchVisible(false);
            setSearchQuery(''); // Clear search when closing
          }}
        >
          <View style={ChatStyle.searchModal}>
            <View style={ChatStyle.modalHeader}>
              <Text style={ChatStyle.modalTitle}>Search Messages</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsSearchVisible(false);
                  setSearchQuery(''); // Clear search when closing
                }}
                style={ChatStyle.closeButtonContainer}
              >
                <Icons.Cross
                  width={moderateScale(30)}
                  height={moderateScale(30)}
                />
              </TouchableOpacity>
            </View>

            {/* Search input box */}
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search messages..."
              placeholderTextColor={Colors.grayDark}
              style={ChatStyle.searchInput}
              autoFocus
              returnKeyType="search"
            />

            {/* Navigation between matches - Show before results */}
            {matches.length > 0 && (
              <View style={ChatStyle.searchNavigation}>
                <TouchableOpacity
                  style={ChatStyle.navButton}
                  onPress={() =>
                    setActiveMatchIndex(
                      prev => (prev - 1 + matches.length) % matches.length,
                    )
                  }
                >
                  <Icons.LeftArrow
                    width={moderateScale(16)}
                    height={moderateScale(16)}
                    fill={Colors.white}
                  />
                </TouchableOpacity>
                <Text style={ChatStyle.matchCount}>
                  {`${activeMatchIndex + 1} of ${matches.length}`}
                </Text>
                <TouchableOpacity
                  style={ChatStyle.navButton}
                  onPress={() =>
                    setActiveMatchIndex(prev => (prev + 1) % matches.length)
                  }
                >
                  <Icons.LeftArrow
                    width={moderateScale(16)}
                    height={moderateScale(16)}
                    fill={Colors.white}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* List of ONLY matching messages */}
            {searchQuery ? (
              filteredMessages.length > 0 ? (
                <FlatList
                  data={filteredMessages}
                  keyExtractor={item => item.id}
                  renderItem={renderMessage}
                  contentContainerStyle={ChatStyle.searchResultsContainer}
                />
              ) : (
                <View style={ChatStyle.emptySearchContainer}>
                  <Text style={ChatStyle.emptySearchText}>
                    {`No messages found matching "${searchQuery}"`}
                  </Text>
                </View>
              )
            ) : (
              <View style={ChatStyle.emptySearchContainer}>
                <Text style={ChatStyle.emptySearchText}>
                  Type to search messages
                </Text>
              </View>
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Chat;
