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
};

/**
 * ROOT STACK PARAMS
 * (Holds Auth and Main as nested stacks + fallback splash)
 */
export type RootStackParamList = {
  AuthStack: undefined;
  MainStack: undefined;
  Login: undefined;
  Register: undefined;
  Splash: undefined;
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

/**
 * --- DOMAIN MODELS ---
 */
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  isOnline?: boolean;
}

export interface HealthCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}
