import { Doctor, Message } from '../types/types';

export class ChatService {
  private static instance: ChatService;
  private chatHistory: Map<string, Message[]> = new Map();

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Generate initial greeting message
  generateGreeting(doctor: Doctor): Message {
    return {
      id: Date.now().toString(),
      text: `Hello! I'm Dr. ${doctor.name}. How can I help you today?`,
      sender: 'doctor',
      timestamp: new Date(),
      type: 'text',
    };
  }

  // Get chat messages for a specific doctor
  getChatMessages(doctorId: string, doctor?: Doctor): Message[] {
    if (!this.chatHistory.has(doctorId) && doctor) {
      // Initialize with greeting if no chat history exists
      this.chatHistory.set(doctorId, [this.generateGreeting(doctor)]);
    }
    return this.chatHistory.get(doctorId) || [];
  }

  // Add a new message to chat
  addMessage(doctorId: string, message: Message): void {
    const messages = this.getChatMessages(doctorId);
    messages.push(message);
    this.chatHistory.set(doctorId, messages);
  }

  // Generate automatic doctor responses (you can replace this with API calls)
  generateDoctorResponse(userMessage: string, doctor: Doctor): Message {
    const responses = [
      'Thank you for sharing that information. Let me review your symptoms and provide appropriate guidance.',
      'I understand your concern. Could you please provide more details about when this started?',
      "Based on what you've told me, I'd like to ask a few more questions to better understand your condition.",
      "That's helpful information. Have you experienced any other symptoms alongside this?",
      'I see. Let me suggest some initial steps we can take to address your concerns.',
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now().toString(),
      text: randomResponse,
      sender: 'doctor',
      timestamp: new Date(),
      type: 'text',
    };
  }

  // Clear chat history for a doctor
  clearChatHistory(doctorId: string): void {
    this.chatHistory.delete(doctorId);
  }

  // Get all chat sessions
  getAllChatSessions(): string[] {
    return Array.from(this.chatHistory.keys());
  }
}
