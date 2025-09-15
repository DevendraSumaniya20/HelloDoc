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

// Firebase imports
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import Navigation from '../../navigation/Navigation';
import navigationStrings from '../../constants/navigationString';

const Register: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { setUser } = useAuth(); // Assuming you have setUser in context
  const [isLoading, setIsLoading] = useState(false);
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
    if (!firstName.trim())
      return Alert.alert('Error', 'Enter first name'), false;
    if (!lastName.trim()) return Alert.alert('Error', 'Enter last name'), false;
    if (!email.trim()) return Alert.alert('Error', 'Enter email'), false;
    if (!validateEmail(email))
      return Alert.alert('Error', 'Invalid email'), false;
    const passwordError = validatePassword(password);
    if (passwordError) return Alert.alert('Error', passwordError), false;
    if (password !== confirmPassword)
      return Alert.alert('Error', 'Passwords do not match'), false;
    if (!acceptTerms)
      return Alert.alert('Error', 'Please accept terms & conditions'), false;
    return true;
  };

  // Create user profile in Firestore
  const createUserProfile = async (user: any, additionalData: any = {}) => {
    try {
      const userRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        const { firstName, lastName, email } = additionalData;
        const createdAt = firestore.Timestamp.now();

        await userRef.set({
          firstName,
          lastName,
          email,
          displayName: `${firstName} ${lastName}`,
          createdAt,
          updatedAt: createdAt,
          ...additionalData,
        });
      }
      return userRef;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create user with Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(
        formData.email.trim().toLowerCase(),
        formData.password,
      );

      const user = userCredential.user;

      // Update user profile with display name
      await user.updateProfile({
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      });

      // Create user profile in Firestore
      await createUserProfile(user, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
      });

      // Update auth context
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });

      Alert.alert('Welcome!', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'), // Navigate to home or main screen
        },
      ]);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the users ID token
      const { idToken, user } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      // Split display name for first and last name
      const displayName = user.name || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create user profile in Firestore
      await createUserProfile(userCredential.user, {
        firstName,
        lastName,
        email: user.email,
        photoURL: user.photo,
        provider: 'google',
      });

      // Update auth context
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        firstName,
        lastName,
        photoURL: userCredential.user.photoURL,
      });

      Alert.alert('Welcome!', 'Successfully signed in with Google!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate(navigationStrings.Home),
        },
      ]);
    } catch (error: any) {
      console.error('Google Sign-In error:', error);

      let errorMessage = 'Google sign-in failed. Please try again.';

      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage =
          'An account already exists with the same email address but different sign-in credentials.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Alert.alert('Google Sign-In Failed', errorMessage);
    } finally {
      setIsLoading(false);
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
          />

          {/* Divider */}
          <Components.Divider />

          {/* Social Buttons */}
          <Components.SocialButton
            variant="withIcon"
            onPress={handleGoogleSignIn}
            icon={<Icons.GoogleIcon height={20} width={20} />}
            title="Continue with Google"
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
