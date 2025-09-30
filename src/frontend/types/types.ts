import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

/**
 * AUTH STACK PARAMS
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  WebView: { url: string; title?: string };
};

export type TabStackParamList = {
  Home: undefined; // The actual Home screen
  Chat: undefined; // The actual Chat screen (with no initial params needed for the tab)
  Setting: undefined; // The actual Setting screen
  Search: undefined; // Optional: if Search is also a tab
};

// --------------------------------------------------------------------------
/**
 * MAIN STACK PARAMS
 */
export type MainStackParamList = {
  Tabs: undefined; // Main entry point for tab navigation (Home/Search/etc)
  Chat: { doctor: Doctor };
  Profile: undefined;
  Setting: undefined;
  WebView: { url: string; title?: string };
  Search: { categoryQuery: string } | undefined;
};
// --------------------------------------------------------------------------

/**
 * ROOT STACK PARAMS
 * Contains only the nested stacks and initial flow screens (Splash/Intro).
 */
export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  AuthStack: undefined;
  MainStack: undefined;
};

// --- Extend React Navigation types globally ---
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/**
 * --- SCREEN PROPS (typed hooks into navigation/route params) ---
 * (These remain mostly the same, but ensure they use the correct param list)
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
  'Tabs'
>;
export type SettingScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'Setting'
>;

export type WebScreenProps = NativeStackScreenProps<
  MainStackParamList | AuthStackParamList,
  'WebView'
>;
export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Login'
>;
export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

/**
 * --- DOMAIN MODELS ---
 * (Ensure these interfaces are included as they are used by the navigation types)
 */

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
  isLoading?: boolean;
  error?: boolean;
  edited?: boolean;
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
  isAI?: boolean;
  isOnline?: boolean;
}

export interface OpenAIResponse {
  role: string;
  content: string;
}
