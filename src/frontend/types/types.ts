// --- Navigation stack params

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Setting: undefined;
};

// --- Extend React Navigation types globally
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
