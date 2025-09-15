import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';

// Types
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  firstName?: string;
  lastName?: string;
  photoURL?: string | null;
  provider?: string;
  emailVerified?: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLaunch: boolean;
  initializing: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  markFirstLaunchComplete: () => void;
  sendEmailVerification: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);

  const isAuthenticated = !!user;

  console.log('AuthProvider mounted ✅');

  const getUserData = async (
    firebaseUser: FirebaseAuthTypes.User,
  ): Promise<User> => {
    console.log('Fetching Firestore data for user:', firebaseUser.uid);
    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .get();

      const userData = userDoc.data();
      console.log('Fetched user data:', userData);

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        provider: userData?.provider || 'email',
        ...userData,
      };
    } catch (error) {
      console.error('Error getting user data ❌:', error);
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
      };
    }
  };

  const createUserProfile = async (user: any, additionalData: any = {}) => {
    console.log('Creating user profile in Firestore for:', user.uid);
    try {
      const userRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.log('User profile does not exist, creating new one.');
        const { firstName, lastName, email, photoURL, provider } =
          additionalData;
        const createdAt = firestore.Timestamp.now();

        await userRef.set({
          firstName: firstName || '',
          lastName: lastName || '',
          email,
          displayName: user.displayName || `${firstName} ${lastName}`,
          photoURL: photoURL || null,
          provider: provider || 'email',
          createdAt,
          updatedAt: createdAt,
          ...additionalData,
        });
      } else {
        console.log('User profile already exists ✅');
      }
      return userRef;
    } catch (error) {
      console.error('Error creating user profile ❌:', error);
      throw error;
    }
  };

  const onAuthStateChanged = async (
    firebaseUser: FirebaseAuthTypes.User | null,
  ) => {
    console.log('Auth state changed:', firebaseUser?.uid || 'No user');
    try {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser);
        setUser(userData);
        console.log('User set in state:', userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
        console.log('User signed out, local data cleared.');
      }
    } catch (error) {
      console.error('Error in auth state change ❌:', error);
    }

    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      try {
        const hasLaunchedBefore = await AsyncStorage.getItem(
          'hasLaunchedBefore',
        );
        setIsFirstLaunch(!hasLaunchedBefore);
        console.log('Is first launch?', !hasLaunchedBefore);

        const cachedUser = await AsyncStorage.getItem('user');
        if (cachedUser) {
          console.log('Found cached user:', cachedUser);
          setUser(JSON.parse(cachedUser));
        }
      } catch (error) {
        console.error('Error initializing auth ❌:', error);
      }
    };

    initializeAuth();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt with email:', email);
    try {
      setIsLoading(true);
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      console.log('Login success ✅', userCredential.user?.uid);
      if (userCredential.user) {
        const userData = await getUserData(userCredential.user);
        setUser(userData);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error ❌:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    console.log('🔄 Google Sign-In attempt started...');
    try {
      setIsLoading(true);
      console.log('⏳ Checking Google Play Services...');

      // Check for Google Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.log('✅ Google Play Services available');

      // Perform Google Sign-In
      console.log('⏳ Opening Google Sign-In dialog...');
      const googleSignInResult = await GoogleSignin.signIn();
      console.log('📥 Google Sign-In result:', googleSignInResult);

      // Check if sign-in was successful
      if (!isSuccessResponse(googleSignInResult)) {
        console.error('❌ Google Sign-In was cancelled or failed');
        return false;
      }

      const { user: googleUser, idToken } =
        googleSignInResult.data || googleSignInResult;

      if (!idToken) {
        console.error('❌ No ID token found in Google sign-in response');
        return false;
      }

      console.log('✅ Google Sign-In success');
      console.log('👤 User Info:', {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        photo: googleUser.photo,
      });
      console.log('🔑 ID Token:', idToken);

      // Create Firebase credential and sign in
      console.log('⏳ Creating Firebase credential...');
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('✅ Firebase credential created');

      console.log('⏳ Signing in to Firebase with Google credential...');
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      console.log('✅ Signed in to Firebase:', userCredential.user?.email);

      // Parse user's display name
      const displayName = googleUser.name || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      console.log('📛 Parsed Name:', { firstName, lastName });

      // Create/update user profile in Firestore
      console.log('⏳ Saving user profile to Firestore...');
      await firestore().collection('users').doc(googleUser.id).set(
        {
          firstName,
          lastName,
          email: googleUser.email,
          displayName: googleUser.name,
          photoURL: googleUser.photo,
          provider: 'google',
          createdAt: firestore.Timestamp.now(),
          updatedAt: firestore.Timestamp.now(),
        },
        { merge: true },
      );
      console.log('✅ User profile saved in Firestore');

      // Create user data object
      const completeUserData: User = {
        uid: googleUser.id,
        email: googleUser.email,
        displayName: googleUser.name,
        firstName,
        lastName,
        photoURL: googleUser.photo,
        provider: 'google',
        emailVerified: true,
      };

      console.log('📦 Final User Object:', completeUserData);

      // Set user in state
      console.log('⏳ Updating state with user...');
      setUser(completeUserData);
      console.log('✅ User set in state');

      console.log('🎉 Google Sign-In flow completed successfully');
      return true;
    } catch (error: any) {
      console.error('🔥 Google Sign-In error:', error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('⚠️ User cancelled the sign-in flow');
            return false;
          case statusCodes.IN_PROGRESS:
            console.log('⚠️ Sign-in already in progress');
            return false;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.error('❌ Google Play Services not available or outdated');
            throw new Error('Google Play Services not available or outdated');
          default:
            console.error(
              '❌ Unhandled Google Sign-In error code:',
              error.code,
            );
            throw error;
        }
      }

      throw error;
    } finally {
      setIsLoading(false);
      console.log('🔚 Google Sign-In attempt finished (loading stopped)');
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    console.log('Registering new user:', userData.email);
    try {
      setIsLoading(true);
      const userCredential = await auth().createUserWithEmailAndPassword(
        userData.email,
        userData.password,
      );

      const firebaseUser = userCredential.user;
      console.log('Firebase user created ✅:', firebaseUser.uid);

      await firebaseUser.updateProfile({
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      await firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .set({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          displayName: `${userData.firstName} ${userData.lastName}`,
          provider: 'email',
          createdAt: firestore.Timestamp.now(),
          updatedAt: firestore.Timestamp.now(),
        });

      const completeUserData = await getUserData(firebaseUser);
      setUser(completeUserData);
      return true;
    } catch (error: any) {
      console.error('Registration error ❌:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log('Logging out user...');
    try {
      setIsLoading(true);
      if (user?.provider === 'google') {
        try {
          await GoogleSignin.signOut();
          console.log('Google sign-out successful ✅');
        } catch (error) {
          console.log('Google sign out error (non-critical):', error);
        }
      }
      await auth().signOut();
      await AsyncStorage.removeItem('user');
      setUser(null);
      console.log('User logged out successfully ✅');
    } catch (error) {
      console.error('Logout error ❌:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailVerification = async (): Promise<boolean> => {
    console.log('Sending email verification...');
    try {
      const currentUser = auth().currentUser;
      if (currentUser && !currentUser.emailVerified) {
        await currentUser.sendEmailVerification();
        console.log('Email verification sent ✅');
        return true;
      }
      console.log('No email verification needed.');
      return false;
    } catch (error) {
      console.error('Email verification error ❌:', error);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    console.log('Sending password reset email to:', email);
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent ✅');
      return true;
    } catch (error) {
      console.error('Password reset error ❌:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    console.log('Updating user profile with data:', data);
    try {
      if (!user) return false;
      setIsLoading(true);

      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          ...data,
          updatedAt: firestore.Timestamp.now(),
        });

      if (data.displayName || data.firstName || data.lastName) {
        const currentUser = auth().currentUser;
        if (currentUser) {
          await currentUser.updateProfile({
            displayName:
              data.displayName ||
              `${data.firstName || user.firstName} ${
                data.lastName || user.lastName
              }`,
          });
          console.log('Firebase profile updated ✅');
        }
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('User profile updated locally ✅');

      return true;
    } catch (error) {
      console.error('Update profile error ❌:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const markFirstLaunchComplete = async (): Promise<void> => {
    console.log('Marking first launch complete.');
    try {
      setIsFirstLaunch(false);
      await AsyncStorage.setItem('hasLaunchedBefore', 'true');
    } catch (error) {
      console.error('Error marking first launch complete ❌:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isFirstLaunch,
    initializing,
    login,
    loginWithGoogle,
    register,
    logout,
    setUser,
    markFirstLaunchComplete,
    sendEmailVerification,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
