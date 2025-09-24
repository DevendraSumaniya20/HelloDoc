export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_DELAY_MIN: 1000,
  TYPING_DELAY_MAX: 3000,
  AUTO_SCROLL_DELAY: 100,
  MESSAGE_LOAD_LIMIT: 50,
};

export const DOCTOR_RESPONSES = [
  'Thank you for sharing that information. Let me review your symptoms and provide appropriate guidance.',
  'I understand your concern. Could you please provide more details about when this started?',
  "Based on what you've told me, I'd like to ask a few more questions to better understand your condition.",
  "That's helpful information. Have you experienced any other symptoms alongside this?",
  'I see. Let me suggest some initial steps we can take to address your concerns.',
  'Could you tell me more about the intensity and frequency of these symptoms?',
  'Have you taken any medication or tried any treatments for this condition?',
  "It's important that we monitor this carefully. How long have you been experiencing this?",
  "I'd like to understand your medical history better. Do you have any chronic conditions?",
  "Based on your symptoms, I may recommend some tests. Let's discuss your options.",
];

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VOICE: 'voice',
  DOCUMENT: 'document',
  SYSTEM: 'system',
} as const;

export const DOCTOR_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  BUSY: 'busy',
} as const;
