import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLaunch: boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  markFirstLaunchComplete: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// --- Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Helper: wait function for simulating API/storage delays
const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

// --- Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        // Simulate checking stored auth data
        await wait(1500);

        // Mock: replace with AsyncStorage / SecureStore
        const storedUser = null; // await AsyncStorage.getItem('user');
        const hasLaunchedBefore = false; // await AsyncStorage.getItem('hasLaunchedBefore');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        setIsFirstLaunch(!hasLaunchedBefore);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate API call
      await wait(1500);

      // Mock user data (replace with actual API response)
      const userData: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://via.placeholder.com/100',
      };

      // Mock storage
      // await AsyncStorage.setItem('user', JSON.stringify(userData));
      // await AsyncStorage.setItem('userToken', 'mock-jwt-token');

      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate API call
      await wait(2000);

      // Mock new user
      const newUser: User = {
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };

      // Mock storage
      // await AsyncStorage.setItem('user', JSON.stringify(newUser));
      // await AsyncStorage.setItem('userToken', 'mock-jwt-token');

      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Mock storage clear
      // await AsyncStorage.removeItem('user');
      // await AsyncStorage.removeItem('userToken');

      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark first launch as complete
  const markFirstLaunchComplete = (): void => {
    setIsFirstLaunch(false);
    // Mock storage
    // AsyncStorage.setItem('hasLaunchedBefore', 'true');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isFirstLaunch,
    login,
    register,
    logout,
    markFirstLaunchComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
