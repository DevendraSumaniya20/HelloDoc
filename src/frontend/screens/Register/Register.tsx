import React, { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { RegisterScreenProps } from '../../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/AuthContext';
import Components from '../../components';
import { validateEmail, validatePassword } from '../../utils/validation';
import Icons from '../../constants/svgPath';
import navigationStrings from '../../constants/navigationString';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateFormData = (key: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (field) {
      case 'firstName':
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          newErrors.password = passwordError;
        } else {
          delete newErrors.password;
          // Re-validate confirm password if it exists
          if (formData.confirmPassword && touched.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
              newErrors.confirmPassword = 'Passwords do not match';
            } else {
              delete newErrors.confirmPassword;
            }
          }
        }
        break;

      case 'confirmPassword':
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Validate last name
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      newErrors.terms = 'Please accept the terms and conditions to continue';
    }

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    return Object.keys(newErrors).length === 0;
  };

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
            onPress: () => {
              // Navigate to the MainStack which contains Home
              navigation.getParent()?.navigate('MainStack');
              // OR use reset to clear the auth stack
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'MainStack' }],
              });
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const newErrors: FormErrors = {};

      switch (error.code) {
        case 'auth/email-already-in-use':
          newErrors.email = 'This email is already registered';
          break;
        case 'auth/weak-password':
          newErrors.password = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          newErrors.email = 'Invalid email address';
          break;
        case 'auth/network-request-failed':
          Alert.alert(
            'Network Error',
            'Please check your internet connection and try again.',
          );
          return;
        default:
          Alert.alert(
            'Registration Failed',
            error.message || 'Something went wrong. Please try again.',
          );
          return;
      }

      setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const success = await loginWithGoogle();

      if (success) {
        Alert.alert('Welcome!', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to the MainStack which contains Home
              navigation.getParent()?.navigate('MainStack');
              // OR use reset to clear the auth stack
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'MainStack' }],
              });
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);

      let errorMessage = 'Google sign-in failed. Please try again.';

      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          errorMessage =
            'An account already exists with the same email address but different sign-in credentials.';
          break;
        case 'auth/network-request-failed':
          errorMessage =
            'Network error. Please check your internet connection.';
          break;
        case 'auth/popup-closed-by-user':
          // User cancelled, don't show error
          return;
        default:
          if (error.message) {
            errorMessage = error.message;
          }
      }

      Alert.alert('Google Sign-In Failed', errorMessage);
    }
  };

  const handleTermsToggle = () => {
    setAcceptTerms(!acceptTerms);
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={{ marginLeft: 20, marginTop: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Icons.LeftArrow width={24} height={24} />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
              onBlur={() => handleFieldBlur('firstName')}
              disabled={isLoading}
              required
              containerStyle={styles.nameInput}
              errorMessage={touched.firstName ? errors.firstName : undefined}
              autoCapitalize="words"
            />
            <Components.InputField
              label="Last Name"
              placeholder="Last name"
              value={formData.lastName}
              onChangeText={updateFormData('lastName')}
              onBlur={() => handleFieldBlur('lastName')}
              disabled={isLoading}
              required
              containerStyle={styles.nameInput}
              errorMessage={touched.lastName ? errors.lastName : undefined}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <Components.InputField
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={updateFormData('email')}
            onBlur={() => handleFieldBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            disabled={isLoading}
            required
            errorMessage={touched.email ? errors.email : undefined}
          />

          {/* Password */}
          <Components.InputField
            label="Password"
            placeholder="Create password"
            value={formData.password}
            onChangeText={updateFormData('password')}
            onBlur={() => handleFieldBlur('password')}
            secureTextEntry
            disabled={isLoading}
            required
            errorMessage={touched.password ? errors.password : undefined}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Components.InputField
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChangeText={updateFormData('confirmPassword')}
            onBlur={() => handleFieldBlur('confirmPassword')}
            secureTextEntry
            disabled={isLoading}
            required
            errorMessage={
              touched.confirmPassword ? errors.confirmPassword : undefined
            }
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Terms & Conditions */}
          <Components.CheckboxWithTerms
            checked={acceptTerms}
            onToggle={handleTermsToggle}
            disabled={isLoading}
            errorMessage={touched.terms ? errors.terms : undefined}
            onPrivacyPress={() => {
              navigation.navigate(navigationStrings.WebView, {
                url: 'https://www.birajtech.com/privacy-policy',
                title: 'Privacy Policy',
              });
            }}
            onTermsPress={() => {
              navigation.navigate(navigationStrings.WebView, {
                url: 'https://www.birajtech.com/terms-and-condition',
                title: 'Terms of Service',
              });
            }}
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
    paddingBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  nameInput: {
    width: '48%',
  },
});

export default Register;
