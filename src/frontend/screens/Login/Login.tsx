import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginScreenProps } from '../../types/types';
import { useAuth } from '../../hooks/AuthContext';
import Components from '../../components';
import Icons from '../../constants/svgPath';

const Login: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert('Error', 'Please fill in all fields');
    if (!email.includes('@'))
      return Alert.alert('Error', 'Please enter a valid email');

    try {
      const success = await login(email, password);
      success
        ? Alert.alert('Success', 'Welcome back!')
        : Alert.alert('Error', 'Invalid email or password');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error(error);
    }
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

          <Components.InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Components.InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => Alert.alert('Reset link sent')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Components.PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
          />

          <Components.Divider />

          <Components.SocialButton
            variant="withIcon"
            onPress={() => Alert.alert('Google login')}
            icon={<Icons.GoogleIcon height={20} width={20} />}
            title="Continue with Google"
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
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotPasswordText: { fontSize: 14, color: '#007AFF', fontWeight: '500' },
});

export default Login;
