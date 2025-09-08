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

const Register: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, isLoading } = useAuth();
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

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      const success = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      success
        ? Alert.alert('Welcome!', 'Account created successfully!')
        : Alert.alert('Error', 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Something went wrong');
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Components.InputField
              label="First Name"
              placeholder="First name"
              value={formData.firstName}
              onChangeText={updateFormData('firstName')}
              editable={!isLoading}
              containerStyle={{ width: '48%' }}
            />
            <Components.InputField
              label="Last Name"
              placeholder="Last name"
              value={formData.lastName}
              onChangeText={updateFormData('lastName')}
              editable={!isLoading}
              containerStyle={{ width: '48%' }} // 48% width
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
            variant="google"
            onPress={() => Alert.alert('Google signup')}
            icon
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
  container: { flex: 1, backgroundColor: '#fff' },
  keyboard: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },
});

export default Register;
