import React, { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { RegisterScreenProps } from '../../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/AuthContext';
import Components from '../../components';
import { validateEmail, validatePassword } from '../../utils/validation';
import Icons from '../../constants/svgPath';

const Register: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, loginWithGoogle, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const updateFormData = (key: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim()) {
      Alert.alert('Error', 'Enter first name');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Enter last name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Enter email');
      return false;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid email');
      return false;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept terms & conditions');
      return false;
    }
    return true;
  };

  // ===============================
  // Email/Password Registration Handler
  // ===============================
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const success = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (success) {
        Alert.alert('Welcome!', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Something went wrong. Please try again.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage =
            'This email is already registered. Please use a different email or sign in.';
          break;
        case 'auth/weak-password':
          errorMessage =
            'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address. Please check and try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage =
            'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      Alert.alert('Registration Failed', errorMessage);
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
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Components.AuthHeader
            title="Create Account"
            subtitle="Sign up to get started"
          />

          {/* Name Fields */}
          <View style={styles.nameContainer}>
            <Components.InputField
              label="First Name"
              placeholder="First name"
              value={formData.firstName}
              onChangeText={updateFormData('firstName')}
              editable={!isLoading}
              containerStyle={styles.nameInput}
            />
            <Components.InputField
              label="Last Name"
              placeholder="Last name"
              value={formData.lastName}
              onChangeText={updateFormData('lastName')}
              editable={!isLoading}
              containerStyle={styles.nameInput}
            />
          </View>

          {/* Email */}
          <Components.InputField
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={updateFormData('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          {/* Password */}
          <Components.InputField
            label="Password"
            placeholder="Create password"
            value={formData.password}
            onChangeText={updateFormData('password')}
            secureTextEntry
            editable={!isLoading}
          />
          <Components.InputField
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChangeText={updateFormData('confirmPassword')}
            secureTextEntry
            editable={!isLoading}
          />

          {/* Terms & Conditions */}
          <Components.CheckboxWithTerms
            checked={acceptTerms}
            onToggle={() => setAcceptTerms(!acceptTerms)}
            onTermsPress={() => Alert.alert('Terms & Conditions')}
            onPrivacyPress={() => Alert.alert('Privacy Policy')}
            disabled={isLoading}
          />

          {/* Register Button */}
          <Components.PrimaryButton
            title={isLoading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            disabled={isLoading}
            loading={isLoading}
          />

          {/* Divider */}
          <Components.Divider />

          {/* Social Buttons */}
          <Components.SocialButton
            variant="withIcon"
            onPress={handleGoogleSignIn}
            icon={<Icons.GoogleIcon height={20} width={20} />}
            title={
              isLoading ? 'Signing in with Google...' : 'Continue with Google'
            }
            disabled={isLoading}
          />

          {/* Footer */}
          <Components.FooterLink
            text="Already have an account?"
            linkText="Sign In"
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '48%',
  },
});

export default Register;
