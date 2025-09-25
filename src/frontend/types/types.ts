import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

/**
 * AUTH STACK PARAMS
 * (Login/Register flow)
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/**
 * MAIN STACK PARAMS
 * (Home/Settings flow, plus optional Splash if first launch)
 */
export type MainStackParamList = {
  Splash: undefined;
  Home: undefined;
  Setting: undefined;
  Chat: { doctor: Doctor };
  Tabs: undefined;
  Profile: undefined;
};

/**
 * ROOT STACK PARAMS
 * (Holds Auth and Main as nested stacks + fallback splash)
 */
export type RootStackParamList = {
  AuthStack: undefined;
  MainStack: undefined;
  Intro: undefined;
  Login: undefined;
  Register: undefined;
  Splash: undefined;
  Setting: undefined;
  Profile: undefined;
};

// --- Extend React Navigation types globally ---
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/**
 * --- SCREEN PROPS (typed hooks into navigation/route params) ---
 */
export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;
export type SplashNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export type IntroScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Intro'
>;
export type IntroNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Intro'
>;

export type HomeScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'Home'
>;
export type SettingScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'Setting'
>;
export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Login'
>;
export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

export interface User {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  firstName?: string;
  lastName?: string;
  photoURL?: string | null;
  provider?: string;
  emailVerified?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * --- DOMAIN MODELS ---
 */

export interface HealthCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
  type?: 'text' | 'image' | 'voice';
  isLoading?: boolean; // For showing loading state
  error?: boolean; // For error states
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  status?: 'online' | 'offline' | 'busy';
  lastSeen?: string;
  isAI?: boolean; // Flag to identify AI doctors
  isOnline?: boolean;
}

export interface OpenAIResponse {
  role: string;
  content: string;
}
