import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../hooks/AuthContext';
import Colors from '../../constants/color';

const Setting = () => {
  const { user, logout: authLogout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout();
      Alert.alert('Logged Out', 'You have been signed out successfully.');
    } catch {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserDisplayName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.displayName) return user.displayName.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getProfileImage = () =>
    user?.photoURL || 'https://via.placeholder.com/80x80';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: getProfileImage() }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{getUserDisplayName()}</Text>
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.logoutButton, isLoggingOut && { opacity: 0.6 }]}
        disabled={isLoggingOut}
      >
        <Text style={styles.logoutText}>
          {isLoggingOut ? 'Please wait...' : 'Log Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: Colors.primary || '#e63946',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
