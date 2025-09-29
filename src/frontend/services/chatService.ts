// src/services/chatService.ts
import { Doctor, Message } from '../types/types';
import firestore from '@react-native-firebase/firestore';

export class ChatService {
  private static instance: ChatService;
  private chatHistory: Map<string, Message[]> = new Map();

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Get chat reference
  private getChatRef(userId: string, doctorId: string) {
    return firestore()
      .collection('chats')
      .doc(`${userId}_${doctorId}`)
      .collection('messages');
  }

  // Generate initial greeting message
  generateGreeting(doctor: Doctor): Message {
    return {
      id: Date.now().toString(),
      text: `Hello! I'm Dr. ${doctor.name}. How can I help you today?`,
      sender: 'doctor',
      timestamp: new Date(),
      type: 'text',
      isLoading: false,
      error: false,
    };
  }

  // Load chat history
  async loadChatHistory(
    userId: string,
    doctorId: string,
    doctor?: Doctor,
  ): Promise<Message[]> {
    try {
      const chatRef = this.getChatRef(userId, doctorId);
      const snapshot = await chatRef
        .orderBy('timestamp', 'asc')
        .limit(100)
        .get();

      if (snapshot.empty && doctor) {
        const greeting = this.generateGreeting(doctor);
        this.chatHistory.set(doctorId, [greeting]);
        return [greeting];
      }

      const messages: Message[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: data.id,
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp?.toDate() || new Date(),
          type: data.type || 'text',
          isLoading: false,
          error: false,
        });
      });

      this.chatHistory.set(doctorId, messages);
      console.log(`✅ Loaded ${messages.length} messages from Firebase`);
      return messages;
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      if (doctor) {
        const greeting = this.generateGreeting(doctor);
        return [greeting];
      }
      return [];
    }
  }

  // Save message to Firebase
  async saveMessageToFirebase(
    userId: string,
    doctorId: string,
    message: Message,
  ): Promise<void> {
    try {
      const chatRef = this.getChatRef(userId, doctorId);

      await chatRef.doc(message.id).set({
        id: message.id,
        text: message.text,
        sender: message.sender,
        timestamp: firestore.Timestamp.fromDate(message.timestamp),
        type: message.type || 'text',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await firestore().collection('chats').doc(`${userId}_${doctorId}`).set(
        {
          userId,
          doctorId,
          lastMessage: message.text,
          lastMessageTime: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      console.log('✅ Message saved to Firebase:', message.id);
    } catch (error) {
      console.error('❌ Error saving message to Firebase:', error);
      throw error;
    }
  }

  // Get chat messages from memory
  getChatMessages(doctorId: string, doctor?: Doctor): Message[] {
    if (!this.chatHistory.has(doctorId) && doctor) {
      this.chatHistory.set(doctorId, [this.generateGreeting(doctor)]);
    }
    return this.chatHistory.get(doctorId) || [];
  }

  // Add message to memory
  addMessage(doctorId: string, message: Message): void {
    const messages = this.chatHistory.get(doctorId) || [];
    messages.push(message);
    this.chatHistory.set(doctorId, messages);
  }

  // Add message and save to Firebase
  async addMessageAndSave(
    userId: string,
    doctorId: string,
    message: Message,
  ): Promise<void> {
    this.addMessage(doctorId, message);
    await this.saveMessageToFirebase(userId, doctorId, message);
  }

  // --- New: Update a message ---
  async updateMessage(
    userId: string,
    doctorId: string,
    messageId: string,
    data: Partial<Message>,
  ): Promise<void> {
    try {
      const chatRef = this.getChatRef(userId, doctorId).doc(messageId);

      await chatRef.update({
        ...data,
        edited: true,
      });

      const messages = this.chatHistory.get(doctorId) || [];
      const updatedMessages = messages.map(msg =>
        msg.id === messageId ? { ...msg, ...data, edited: true } : msg,
      );
      this.chatHistory.set(doctorId, updatedMessages);

      console.log(`✅ Message ${messageId} updated`);
    } catch (error) {
      console.error('❌ Error updating message:', error);
      throw error;
    }
  }

  // --- New: Delete a message ---
  async deleteMessage(
    userId: string,
    doctorId: string,
    messageId: string,
  ): Promise<void> {
    try {
      const chatRef = this.getChatRef(userId, doctorId).doc(messageId);
      await chatRef.delete();

      const messages = this.chatHistory.get(doctorId) || [];
      this.chatHistory.set(
        doctorId,
        messages.filter(msg => msg.id !== messageId),
      );

      console.log(`✅ Message ${messageId} deleted`);
    } catch (error) {
      console.error('❌ Error deleting message:', error);
      throw error;
    }
  }

  // Clear chat history
  async clearChatHistory(userId: string, doctorId: string): Promise<void> {
    try {
      this.chatHistory.delete(doctorId);

      const chatRef = this.getChatRef(userId, doctorId);
      const snapshot = await chatRef.get();
      const batch = firestore().batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      await firestore()
        .collection('chats')
        .doc(`${userId}_${doctorId}`)
        .delete();
      console.log('✅ Chat history cleared');
    } catch (error) {
      console.error('❌ Error clearing chat history:', error);
    }
  }

  // Get all chat sessions
  getAllChatSessions(): string[] {
    return Array.from(this.chatHistory.keys());
  }

  // Generate automatic doctor response
  generateDoctorResponse(userMessage: string, doctor: Doctor): Message {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return this.createMessage(
        'Hello! How are you feeling today? Please tell me about your symptoms.',
        doctor,
      );
    }

    if (
      lowerMessage.includes('headache') ||
      lowerMessage.includes('head pain')
    ) {
      return this.createMessage(
        "I understand you're experiencing headaches. Can you describe the pain? Is it sharp, dull, or throbbing? When did it start?",
        doctor,
      );
    }

    if (
      lowerMessage.includes('fever') ||
      lowerMessage.includes('temperature')
    ) {
      return this.createMessage(
        'Fever can be a sign of infection. Have you measured your temperature? Do you have any other symptoms like chills or body aches?',
        doctor,
      );
    }

    if (lowerMessage.includes('cough') || lowerMessage.includes('cold')) {
      return this.createMessage(
        'I see you have a cough. Is it dry or productive? How long have you had these symptoms?',
        doctor,
      );
    }

    if (lowerMessage.includes('thank')) {
      return this.createMessage(
        "You're welcome! Feel free to reach out if you have any more questions. Take care!",
        doctor,
      );
    }

    const responses = [
      'Thank you for sharing that information. Could you please provide more details?',
      'I understand your concern. When did these symptoms first start?',
      "That's helpful. Have you experienced any other symptoms alongside this?",
      'Based on what you shared, I recommend scheduling an in-person consultation for a thorough examination.',
      'Let me help you with that. Can you tell me more about your medical history?',
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    return this.createMessage(randomResponse, doctor);
  }

  private createMessage(text: string, doctor: Doctor): Message {
    return {
      id: `doctor-${Date.now()}-${Math.random()}`,
      text,
      sender: 'doctor',
      timestamp: new Date(),
      type: 'text',
      isLoading: false,
      error: false,
    };
  }
}
