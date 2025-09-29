import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import {
  loginWithEmail,
  loginWithGoogle as googleLogin,
  registerWithEmail,
  sendVerificationEmail,
  resetPassword as resetPasswordService,
  logoutFirebase,
} from '../services/authService';

import {
  getUserDoc,
  setUserDoc,
  updateUserDoc,
  listenToUserDoc,
} from '../services/firestoreService';

import {
  saveUserToStorage,
  getUserFromStorage,
  clearUserFromStorage,
  checkFirstLaunch,
  setFirstLaunch,
} from '../services/storageService';
import { RegisterData, User } from '../types/types';

// Types

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
  checkUserExists: () => Promise<boolean>;
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

  // Use refs to avoid stale closures
  const firestoreListenerRef = useRef<(() => void) | null>(null);
  const authListenerRef = useRef<(() => void) | null>(null);
  const userCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserRef = useRef<User | null>(null);

  type FirebaseErrorLike = Error & { code?: string };

  // Keep current user in sync with ref
  useEffect(() => {
    currentUserRef.current = user;
  }, [user]);

  const isAuthenticated = !!user;

  console.log('🔧 AuthProvider mounted ✅');

  const getUserData = async (
    firebaseUser: FirebaseAuthTypes.User,
  ): Promise<User> => {
    console.log('📥 Fetching Firestore data for user:', firebaseUser.uid);
    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .get();

      if (!userDoc.exists) {
        console.log('🚨 User document does not exist - account deleted');
        throw new Error('USER_DOCUMENT_NOT_FOUND');
      }

      const userData = userDoc.data();
      console.log('✅ Fetched user data successfully');

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
    } catch (error: any) {
      console.error('❌ Error getting user data:', error);
      throw error;
    }
  };

  // Force logout function - guaranteed to work
  const forceLogout = async (reason = 'Account deletion detected') => {
    console.log(`🚨 FORCE LOGOUT: ${reason}`);

    try {
      // 1️⃣ Clear periodic user check
      if (userCheckIntervalRef.current) {
        clearInterval(userCheckIntervalRef.current);
        userCheckIntervalRef.current = null;
      }

      // 2️⃣ Clear Firestore listener
      if (firestoreListenerRef.current) {
        try {
          firestoreListenerRef.current(); // unsubscribe
        } catch (error) {
          console.log('Error cleaning up Firestore listener:', error);
        }
        firestoreListenerRef.current = null;
      }

      // 3️⃣ Store provider before clearing user
      const currentProvider = currentUserRef.current?.provider;

      // 4️⃣ Clear user state immediately to trigger navigation
      setUser(null);
      currentUserRef.current = null;

      // 5️⃣ Clear AsyncStorage
      try {
        await clearUserFromStorage();
        console.log('✅ Storage cleared');
      } catch (error) {
        console.log('Error clearing storage:', error);
      }

      // 6️⃣ Google signout if needed
      if (currentProvider === 'google') {
        try {
          const googleUser = await GoogleSignin.getCurrentUser();
          if (googleUser) {
            await GoogleSignin.signOut();
            console.log('✅ Google signout completed');
          }
        } catch (error) {
          console.log('Google signout error (non-critical):', error);
        }
      }

      // 7️⃣ Firebase signout
      try {
        const firebaseUser = auth().currentUser;
        if (firebaseUser) {
          await auth().signOut();
          console.log('✅ Firebase signout completed');
        }
      } catch (error) {
        console.log('Firebase signout error:', error);
      }

      console.log('✅ FORCE LOGOUT COMPLETED');
    } catch (error) {
      console.error('❌ Error during force logout:', error);
      // Even if everything else fails, ensure user state is cleared
      setUser(null);
      currentUserRef.current = null;
    }
  };

  // Function to check if user document still exists
  const checkUserExists = async (): Promise<boolean> => {
    const currentUser = currentUserRef.current;
    if (!currentUser) return false;

    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();
      if (!userDoc.exists()) {
        console.log('🚨 User document deleted, logging out');
        await forceLogout('User deleted by admin');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return true; // don't logout on network errors
    }
  };

  // Setup periodic user check (backup method)
  const setupUserCheck = () => {
    if (userCheckIntervalRef.current)
      clearInterval(userCheckIntervalRef.current);

    userCheckIntervalRef.current = setInterval(async () => {
      if (currentUserRef.current) {
        await checkUserExists();
      }
    }, 30000); // every 30 seconds
  };

  // Enhanced Firestore listener

  const setupFirestoreListener = (uid: string) => {
    // Clean up previous listener
    firestoreListenerRef.current?.();
    firestoreListenerRef.current = null;

    const unsubscribe = listenToUserDoc(
      uid,
      async updatedData => {
        if (!updatedData) {
          console.log('🚨 User document deleted by admin!');
          await forceLogout('User document deleted by admin');
        } else {
          const currentUser = currentUserRef.current;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...updatedData };
            setUser(updatedUser);
            await saveUserToStorage(updatedUser);
          }
        }
      },
      async error => {
        const err = error as FirebaseErrorLike;
        console.error('Firestore listener error:', err);
        await forceLogout(`Firestore error: ${err.code ?? 'unknown'}`);
      },
    );

    firestoreListenerRef.current = unsubscribe;
  };

  const onAuthStateChanged = async (
    firebaseUser: FirebaseAuthTypes.User | null,
  ) => {
    console.log('🔄 Auth state changed:', firebaseUser?.uid || 'No user');

    try {
      if (firebaseUser) {
        // User is signed in
        try {
          // Fetch user data from Firestore
          const userData = await getUserData(firebaseUser);
          setUser(userData);
          currentUserRef.current = userData;

          console.log('👤 User set in state');
          await saveUserToStorage(userData);

          // 1️⃣ Setup Firestore real-time listener
          setupFirestoreListener(firebaseUser.uid);

          // 2️⃣ Setup periodic backup check
          setupUserCheck();
        } catch (error: any) {
          console.error('❌ Error fetching user data:', error);

          // If user doc is missing, force logout immediately
          if (error.message === 'USER_DOCUMENT_NOT_FOUND') {
            console.log('🚨 User authenticated but document missing');
            await forceLogout('User document not found during auth');
            return;
          }

          // Other unexpected errors
          await forceLogout('Error getting user data during auth');
          return;
        }
      } else {
        // User is signed out
        console.log('📤 User signed out');

        // Clear intervals and listeners
        if (userCheckIntervalRef.current) {
          clearInterval(userCheckIntervalRef.current);
          userCheckIntervalRef.current = null;
        }

        if (firestoreListenerRef.current) {
          firestoreListenerRef.current();
          firestoreListenerRef.current = null;
        }

        setUser(null);
        currentUserRef.current = null;
        await clearUserFromStorage();
      }
    } catch (error) {
      console.error('❌ Unexpected error in auth state change:', error);
      setUser(null);
      currentUserRef.current = null;
    }

    // Initialization complete
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 Initializing auth...');
      try {
        const hasLaunchedBefore = await AsyncStorage.getItem(
          'hasLaunchedBefore',
        );
        setIsFirstLaunch(!hasLaunchedBefore);

        const cachedUser = await AsyncStorage.getItem('user');
        if (cachedUser) {
          console.log('💾 Found cached user');
          try {
            const parsedUser = JSON.parse(cachedUser);

            // Verify cached user still exists
            const userDoc = await firestore()
              .collection('users')
              .doc(parsedUser.uid)
              .get();

            if (userDoc.exists()) {
              setUser(parsedUser);
              currentUserRef.current = parsedUser;
              setupFirestoreListener(parsedUser.uid);
              setupUserCheck();
              console.log('✅ Cached user verified and restored');
            } else {
              console.log('🚨 Cached user no longer exists - clearing');
              await AsyncStorage.removeItem('user');
            }
          } catch (error) {
            console.error('❌ Error verifying cached user:', error);
            await AsyncStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      }
    };

    initializeAuth();

    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged);
    authListenerRef.current = authSubscriber;

    return () => {
      console.log('🧹 Cleaning up auth provider');

      if (authListenerRef.current) {
        authListenerRef.current();
        authListenerRef.current = null;
      }

      if (firestoreListenerRef.current) {
        firestoreListenerRef.current();
        firestoreListenerRef.current = null;
      }

      if (userCheckIntervalRef.current) {
        clearInterval(userCheckIntervalRef.current);
        userCheckIntervalRef.current = null;
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userCredential = await loginWithEmail(email, password);
      const firebaseUser = userCredential.user;

      const userDoc = await getUserDoc(firebaseUser.uid);
      if (!userDoc.exists) throw new Error('USER_DOCUMENT_NOT_FOUND');

      const userData = userDoc.data();
      const completeUser = { uid: firebaseUser.uid, ...userData };

      setUser(completeUser);
      await saveUserToStorage(completeUser);

      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userCredential = await googleLogin();
      if (!userCredential) return false;

      const firebaseUser = userCredential.user;

      await setUserDoc(firebaseUser.uid, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        provider: 'google',
        updatedAt: new Date(),
      });

      const userDoc = await getUserDoc(firebaseUser.uid);
      const userData = userDoc.data();
      const completeUser = { uid: firebaseUser.uid, ...userData };

      setUser(completeUser);
      await saveUserToStorage(completeUser);

      return true;
    } catch (error) {
      console.error('❌ Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userCredential = await registerWithEmail(
        userData.email,
        userData.password,
      );
      const firebaseUser = userCredential.user;

      await setUserDoc(firebaseUser.uid, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        displayName: `${userData.firstName} ${userData.lastName}`,
        provider: 'email',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const userDoc = await getUserDoc(firebaseUser.uid);
      const completeUser = { uid: firebaseUser.uid, ...userDoc.data() };

      setUser(completeUser);
      await saveUserToStorage(completeUser);

      return true;
    } catch (error) {
      console.error('❌ Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // 1️⃣ Store provider before clearing user
      const currentProvider = user?.provider;

      // 2️⃣ Clear intervals and listeners first
      if (userCheckIntervalRef.current) {
        clearInterval(userCheckIntervalRef.current);
        userCheckIntervalRef.current = null;
      }

      if (firestoreListenerRef.current) {
        firestoreListenerRef.current();
        firestoreListenerRef.current = null;
      }

      // 3️⃣ Clear storage
      await clearUserFromStorage();

      // 4️⃣ Google signout if needed
      if (currentProvider === 'google') {
        try {
          const googleUser = await GoogleSignin.getCurrentUser();
          if (googleUser) {
            await GoogleSignin.signOut();
            console.log('✅ Google signout completed');
          }
        } catch (error) {
          console.log('Google signout error (non-critical):', error);
        }
      }

      // 5️⃣ Firebase signout
      await logoutFirebase();

      // 6️⃣ Clear user state last
      setUser(null);
      currentUserRef.current = null;

      console.log('✅ Logout completed successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force clear user state even on error
      setUser(null);
      currentUserRef.current = null;
      throw error;
    }
  };

  const sendEmailVerification = async (): Promise<boolean> => {
    return sendVerificationEmail();
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await resetPasswordService(email);
      return true;
    } catch (error) {
      console.error('❌ Reset password error:', error);
      return false;
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      await updateUserDoc(user.uid, {
        ...data,
        updatedAt: new Date(),
      });

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);

      return true;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return false;
    }
  };

  const markFirstLaunchComplete = async (): Promise<void> => {
    await setFirstLaunch();
    setIsFirstLaunch(false);
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
    checkUserExists,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
