// src/hooks/useChat.ts
import { useState, useCallback, useEffect } from 'react';
import { Doctor, Message } from '../types/types';
import { ChatService } from '../services/chatService';
import { generateMessageId } from '../utils/chatHelpers';
import { sendChatMessage, testConnection } from '../apollo/client';
import { useAuth } from './AuthContext';

export function useChat(
  doctor: Doctor,
  onDoctorStatusChange?: (status: 'online' | 'offline' | 'busy') => void,
) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const chatService = ChatService.getInstance();

  // Load chat history from Firebase when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!doctor?.id || !user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('📥 Loading chat history from Firebase...');
        setIsLoading(true);

        // Load from Firebase
        const firebaseMessages = await chatService.loadChatHistory(
          user.uid,
          doctor.id,
          doctor,
        );

        setMessages(firebaseMessages);
        console.log(`✅ Loaded ${firebaseMessages.length} messages`);

        // Test GraphQL connection
        testConnection()
          .then(connected => {
            setIsConnected(connected);
            console.log(
              `GraphQL connection ${connected ? 'successful' : 'failed'}`,
            );
          })
          .catch(error => {
            console.error('Connection test error:', error);
            setIsConnected(false);
          });
      } catch (error) {
        console.error('❌ Error loading chat history:', error);

        // Fallback to memory cache
        const cachedMessages = chatService.getChatMessages(doctor.id, doctor);
        setMessages(cachedMessages);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [doctor?.id, user?.uid]);

  const sendMessage = useCallback(
    async (
      onDoctorStatusChange?: (status: 'online' | 'offline' | 'busy') => void,
    ) => {
      console.log('sendMessage called with:', inputText);

      if (!inputText.trim()) {
        console.log('Empty input, not sending');
        return;
      }

      if (!doctor?.id || !user?.uid) {
        console.error('No doctor ID or user ID available');
        return;
      }

      // Create user message
      const userMessage: Message = {
        id: generateMessageId(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
        isLoading: false,
        error: false,
      };

      console.log('Created user message:', userMessage);

      // Add user message to local state
      setMessages(prev => [...prev, userMessage]);

      // Clear input and show typing indicator
      const currentInput = inputText;
      setInputText('');
      setIsTyping(true);

      // ✅ Set doctor online while responding
      if (onDoctorStatusChange) onDoctorStatusChange('online');

      try {
        // Save user message to Firebase
        await chatService.addMessageAndSave(user.uid, doctor.id, userMessage);
        console.log('✅ User message saved to Firebase');

        // Try GraphQL first if connected
        if (isConnected !== false) {
          console.log('Attempting GraphQL request...');
          const result = await sendChatMessage(currentInput);

          if (result.success && result.data) {
            console.log('GraphQL request successful');

            const assistantMessage: Message = {
              id: generateMessageId(),
              text: result.data.content || 'No response received',
              sender: 'doctor',
              timestamp: new Date(),
              type: 'text',
              isLoading: false,
              error: false,
            };

            console.log(
              'Created assistant message from GraphQL:',
              assistantMessage,
            );
            setMessages(prev => [...prev, assistantMessage]);

            // Save to Firebase
            await chatService.addMessageAndSave(
              user.uid,
              doctor.id,
              assistantMessage,
            );

            if (isConnected === null) setIsConnected(true);
          } else {
            console.log(
              'GraphQL request failed, falling back to local service:',
              result.error,
            );
            setIsConnected(false);
            await useLocalChatService(currentInput, doctor);
          }
        } else {
          console.log('Using local ChatService (no connection)');
          await useLocalChatService(currentInput, doctor);
        }
      } catch (err) {
        console.error('Error in sendMessage:', err);
        setIsConnected(false);

        try {
          await useLocalChatService(currentInput, doctor);
        } catch (localError) {
          console.error('Local service also failed:', localError);
          const errorMessage: Message = {
            id: generateMessageId(),
            text: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
            sender: 'doctor',
            timestamp: new Date(),
            type: 'text',
            isLoading: false,
            error: true,
          };
          setMessages(prev => [...prev, errorMessage]);
          chatService.addMessage(doctor.id, errorMessage);
        }
      } finally {
        setIsTyping(false);

        // ✅ Set doctor offline / last seen after response
        if (onDoctorStatusChange) onDoctorStatusChange('offline');
      }
    },
    [inputText, doctor, user?.uid, isConnected],
  );

  // Helper function for local chat service
  const useLocalChatService = async (input: string, doctor: Doctor) => {
    console.log('Using local ChatService fallback');

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 800 + Math.random() * 1200),
    );

    const doctorResponse = chatService.generateDoctorResponse(input, doctor);

    setMessages(prev => [...prev, doctorResponse]);

    // Save to Firebase
    if (user?.uid) {
      try {
        await chatService.addMessageAndSave(
          user.uid,
          doctor.id,
          doctorResponse,
        );
        console.log('✅ Doctor response saved to Firebase');
      } catch (error) {
        console.error('❌ Error saving doctor response:', error);
        // Still add to memory cache
        chatService.addMessage(doctor.id, doctorResponse);
      }
    }
  };

  const clearChat = useCallback(async () => {
    if (doctor?.id && user?.uid) {
      try {
        await chatService.clearChatHistory(user.uid, doctor.id);
        setMessages([]);
        console.log('✅ Chat cleared');
      } catch (error) {
        console.error('❌ Error clearing chat:', error);
      }
    }
  }, [doctor?.id, user?.uid]);

  // Retry connection
  const retryConnection = useCallback(async () => {
    console.log('Retrying connection...');
    setIsConnected(null); // Set to loading state

    try {
      const connected = await testConnection();
      setIsConnected(connected);
      console.log(`Retry connection ${connected ? 'successful' : 'failed'}`);
      return connected;
    } catch (error) {
      console.error('Retry connection error:', error);
      setIsConnected(false);
      return false;
    }
  }, []);

  const editMessage = useCallback(
    async (messageId: string, newText: string) => {
      if (!user?.uid || !doctor?.id) return;

      try {
        // Update locally
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, text: newText, edited: true } // Marks message as edited
              : msg,
          ),
        );

        // Update in Firebase
        await chatService.updateMessage(user.uid, doctor.id, messageId, {
          text: newText,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [user?.uid, doctor?.id],
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!user?.uid || !doctor?.id) return;

      try {
        // Remove locally
        setMessages(prev => prev.filter(msg => msg.id !== messageId));

        // Delete from Firebase
        await chatService.deleteMessage(user.uid, doctor.id, messageId);
      } catch (error) {
        console.error(error);
      }
    },
    [user?.uid, doctor?.id],
  );

  return {
    messages,
    inputText,
    setInputText,
    sendMessage,
    clearChat,
    isTyping,
    isLoading,
    isConnected,
    retryConnection,
    editMessage,
    deleteMessage,
  };
}
