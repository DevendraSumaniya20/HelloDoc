import { Alert } from 'react-native';

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string): string | null => {
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (!/(?=.*[a-z])/.test(password))
    return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password))
    return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password))
    return 'Password must contain at least one number';
  return null;
};

export { validateEmail, validatePassword };
