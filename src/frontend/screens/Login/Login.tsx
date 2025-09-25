import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/AuthContext';
import Components from '../../components';
import Icons from '../../constants/svgPath';
import auth from '@react-native-firebase/auth';
import type { RootStackParamList } from '../../types/types';
import Colors from '../../constants/color';
import { validateEmail } from '../../utils/validation';
import { moderateScale, scale } from '../../constants/responsive';

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { login, loginWithGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate individual fields
  const validateField = (field: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (field) {
      case 'email':
        if (!email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!password.trim()) {
          newErrors.password = 'Password is required';
        } else if (password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return Object.keys(newErrors).length === 0;
  };

  // ===============================
  // Email/Password Login Handler
  // ===============================
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const success = await login(email.trim(), password);

      if (success) {
        Alert.alert('Success', 'Welcome back!', [
          { text: 'OK', onPress: () => navigation.navigate('MainStack') },
        ]);
      } else {
        setErrors({ password: 'Invalid email or password' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Something went wrong. Please try again.';

      switch (error.code) {
        case 'auth/user-not-found':
          setErrors({ email: 'No account found with this email address.' });
          return;
        case 'auth/wrong-password':
          setErrors({ password: 'Incorrect password. Please try again.' });
          return;
        case 'auth/invalid-email':
          setErrors({ email: 'Invalid email address.' });
          return;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage =
            'Network error. Please check your internet connection.';
          break;
        default:
          if (error.message) errorMessage = error.message;
      }

      Alert.alert('Login Failed', errorMessage);
    }
  };

  // ===============================
  // Google Sign-In Handler
  // ===============================
  const handleGoogleSignIn = async () => {
    try {
      const success = await loginWithGoogle();

      if (success) {
        Alert.alert('Welcome!', 'Successfully signed in with Google!', [
          { text: 'OK', onPress: () => navigation.navigate('MainStack') },
        ]);
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      let errorMessage = 'Google sign-in failed. Please try again.';

      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage =
          'An account already exists with the same email address but different sign-in credentials.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Google Sign-In Failed', errorMessage);
    }
  };

  // ===============================
  // Forgot Password Handler
  // ===============================
  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Enter your email address to receive a password reset link.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Reset Link',
          onPress: async () => {
            if (!email) {
              return Alert.alert(
                'Error',
                'Please enter your email address first.',
              );
            }
            try {
              await auth().sendPasswordResetEmail(email);
              Alert.alert(
                'Reset Link Sent',
                'Check your email for password reset instructions.',
              );
            } catch (error: any) {
              console.error('Forgot password error:', error);
              let errorMessage = 'Failed to send reset email.';
              if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
              } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
              }
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Components.AuthHeader
            title="Welcome Back"
            subtitle="Sign in to continue"
          />

          {/* Email */}
          <Components.InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => handleFieldBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
            errorMessage={touched.email ? errors.email : undefined}
          />

          {/* Password */}
          <Components.InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => handleFieldBlur('password')}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
            errorMessage={touched.password ? errors.password : undefined}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Components.PrimaryButton
            title={isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
            variant="primary"
          />

          <Components.Divider />

          <Components.SocialButton
            variant="withIcon"
            onPress={handleGoogleSignIn}
            icon={<Icons.GoogleIcon height={20} width={20} />}
            title={
              isLoading ? 'Signing in with Google...' : 'Continue with Google'
            }
            disabled={isLoading}
          />

          <Components.FooterLink
            text="Don't have an account?"
            linkText="Sign Up"
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  keyboardContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: moderateScale(20) },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: moderateScale(30) },
  forgotPasswordText: {
    fontSize: scale(14),
    color: Colors.info,
    fontWeight: '500',
  },
});

export default Login;
