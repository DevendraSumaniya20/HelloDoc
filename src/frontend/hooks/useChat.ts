import { useState, useCallback, useEffect } from "react";
import { Doctor, Message } from "../types/types";
import { ChatService } from "../services/chatService";
import { generateMessageId } from "../utils/chatHelpers";
import { sendChatMessage, testConnection } from "../apollo/client";

export function useChat(doctor: Doctor) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const chatService = ChatService.getInstance();

  // Load existing messages when component mounts
  useEffect(() => {
    if (doctor?.id) {
      const existingMessages = chatService.getChatMessages(doctor.id, doctor);
      setMessages(existingMessages);
      
      // Test connection on mount
      testConnection()
        .then(connected => {
          setIsConnected(connected);
          console.log(`GraphQL connection ${connected ? 'successful' : 'failed'}`);
        })
        .catch(error => {
          console.error('Connection test error:', error);
          setIsConnected(false);
        });
    }
  }, [doctor?.id]);

  const sendMessage = useCallback(async () => {
    console.log("sendMessage called with:", inputText);
    
    if (!inputText.trim()) {
      console.log("Empty input, not sending");
      return;
    }

    if (!doctor?.id) {
      console.error("No doctor ID available");
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: generateMessageId(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
      isLoading: false,
      error: false,
    };

    console.log("Created user message:", userMessage);

    // Add user message to local state and service
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      console.log("Updated messages with user message:", newMessages.length);
      return newMessages;
    });
    
    chatService.addMessage(doctor.id, userMessage);

    // Clear input and show typing indicator
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      // Try GraphQL first if we think we're connected
      if (isConnected !== false) {
        console.log("Attempting GraphQL request...");
        
        const result = await sendChatMessage(currentInput);
        
        if (result.success && result.data) {
          console.log("GraphQL request successful");
          
          const assistantMessage: Message = {
            id: generateMessageId(),
            text: result.data.content || 'No response received',
            sender: "doctor",
            timestamp: new Date(),
            type: "text",
            isLoading: false,
            error: false,
          };

          console.log("Created assistant message from GraphQL:", assistantMessage);
          setMessages(prev => [...prev, assistantMessage]);
          chatService.addMessage(doctor.id, assistantMessage);
          
          // Update connection status
          if (isConnected === null) {
            setIsConnected(true);
          }
          
        } else {
          console.log("GraphQL request failed, falling back to local service:", result.error);
          
          // Update connection status
          setIsConnected(false);
          
          // Use local ChatService as fallback
          await useLocalChatService(currentInput, doctor);
        }
      } else {
        console.log("Using local ChatService (no connection)");
        await useLocalChatService(currentInput, doctor);
      }
    } catch (err) {
      console.error("Error in sendMessage:", err);
      
      // Update connection status
      setIsConnected(false);
      
      // Try local service as last resort
      try {
        await useLocalChatService(currentInput, doctor);
      } catch (localError) {
        console.error("Local service also failed:", localError);
        
        // Add error message as final fallback
        const errorMessage: Message = {
          id: generateMessageId(),
          text: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
          sender: "doctor",
          timestamp: new Date(),
          type: "text",
          isLoading: false,
          error: true,
        };

        setMessages(prev => [...prev, errorMessage]);
        chatService.addMessage(doctor.id, errorMessage);
      }
    } finally {
      setIsTyping(false);
    }
  }, [inputText, doctor, isConnected]);

  // Helper function for local chat service
  const useLocalChatService = async (input: string, doctor: Doctor) => {
    console.log("Using local ChatService fallback");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    const doctorResponse = chatService.generateDoctorResponse(input, doctor);
    
    setMessages(prev => {
      const newMessages = [...prev, doctorResponse];
      console.log("Added doctor response from local service:", newMessages.length);
      return newMessages;
    });
    
    chatService.addMessage(doctor.id, doctorResponse);
  };

  const clearChat = useCallback(() => {
    if (doctor?.id) {
      chatService.clearChatHistory(doctor.id);
      setMessages([]);
    }
  }, [doctor?.id]);

  // Retry connection
  const retryConnection = useCallback(async () => {
    console.log("Retrying connection...");
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

  return { 
    messages, 
    inputText, 
    setInputText, 
    sendMessage, 
    clearChat, 
    isTyping,
    isConnected,
    retryConnection,
  };
}