import { Message } from '../types/types';

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

export const formatMessageDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export const groupMessagesByDate = (
  messages: Message[],
): Array<{ date: string; messages: Message[] }> => {
  const groups: { [key: string]: Message[] } = {};

  messages.forEach(message => {
    const dateKey = formatMessageDate(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages: messages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    ),
  }));
};
