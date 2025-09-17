import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { moderateScale } from '../../constants/responsive';
import Colors from '../../constants/color';
import Components from '../../components';
import { useAuth } from '../../hooks/AuthContext';

const { width } = Dimensions.get('window');

// Define the type for updateUserProfile
export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
}

const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Initial values to track changes
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    photoURL: '',
  });

  // Sync auth data into local state
  useEffect(() => {
    if (user) {
      const userEmail = user.email ?? '';
      const userFirstName = user.firstName ?? '';
      const userLastName = user.lastName ?? '';
      const userDisplayName = user.displayName ?? '';
      const userPhotoURL =
        user.photoURL ?? 'https://via.placeholder.com/120x120.png?text=Profile';

      setEmail(userEmail);
      setFirstName(userFirstName);
      setLastName(userLastName);
      setDisplayName(userDisplayName);
      setPhotoURL(userPhotoURL);

      // Set initial values for change tracking
      setInitialValues({
        firstName: userFirstName,
        lastName: userLastName,
        displayName: userDisplayName,
        photoURL: userPhotoURL,
      });
    }
  }, [user]);

  // Track changes
  useEffect(() => {
    const changed =
      firstName !== initialValues.firstName ||
      lastName !== initialValues.lastName ||
      displayName !== initialValues.displayName ||
      photoURL !== initialValues.photoURL;
    setHasChanges(changed);
  }, [firstName, lastName, displayName, photoURL, initialValues]);

  const handleSave = async (): Promise<void> => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation Error', 'First name and last name are required');
      return;
    }

    setIsLoading(true);
    const updatedData: UpdateUserProfileInput = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: displayName.trim(),
      photoURL,
    };

    try {
      await updateUserProfile(updatedData);

      // Update initial values after successful save
      setInitialValues({
        firstName: updatedData.firstName!,
        lastName: updatedData.lastName!,
        displayName: updatedData.displayName!,
        photoURL: updatedData.photoURL!,
      });

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', style: 'default' },
      ]);
    } catch (error) {
      console.error('Error updating profile', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePicker = (): void => {
    Alert.alert(
      'Change Profile Photo',
      'Select an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        {
          text: 'Remove Photo',
          onPress: () => setPhotoURL(''),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const resetChanges = (): void => {
    setFirstName(initialValues.firstName);
    setLastName(initialValues.lastName);
    setDisplayName(initialValues.displayName);
    setPhotoURL(initialValues.photoURL);
  };

  // Show loading state if user not loaded yet
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Profile</Text>
        <Text style={styles.subtitle}>Manage your personal information</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: photoURL }} style={styles.profileImage} />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={handleImagePicker}
                activeOpacity={0.7}
              >
                <Text style={styles.editIconText}>📷</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.displayNameText}>
            {displayName || `${firstName} ${lastName}` || 'No Name'}
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          {/* Profile Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Consultations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>

        {/* Profile Form */}
        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            {hasChanges && (
              <TouchableOpacity
                onPress={resetChanges}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <Components.InputField
            label="Display Name"
            placeholder="Enter your display name"
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Components.InputField
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            required
          />

          <Components.InputField
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            required
          />

          <Components.InputField label="Email Address" value={email} disabled />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !hasChanges && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Text style={styles.saveButtonText}>
                  {hasChanges ? '💾 Save Changes' : '✅ Up to Date'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: moderateScale(16),
    fontSize: 16,
    color: Colors.grayDark,
  },
  headerContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: moderateScale(4),
  },
  subtitle: {
    fontSize: 16,
    color: Colors.grayDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: moderateScale(100),
  },
  profileSection: {
    backgroundColor: Colors.white,
    paddingVertical: moderateScale(30),
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: Colors.grayLight,
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  editIcon: {
    position: 'absolute',
    bottom: moderateScale(5),
    right: moderateScale(5),
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(20),
    padding: moderateScale(8),
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  editIconText: {
    fontSize: 16,
  },
  displayNameText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: moderateScale(4),
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    color: Colors.grayDark,
    marginBottom: moderateScale(20),
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(12),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: moderateScale(2),
  },
  statLabel: {
    fontSize: 12,
    color: Colors.grayDark,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: moderateScale(30),
    backgroundColor: '#CBD5E1',
    marginHorizontal: moderateScale(16),
  },
  formCard: {
    backgroundColor: Colors.white,
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: moderateScale(16),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  resetButton: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    backgroundColor: '#FEF2F2',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(16),
    marginTop: moderateScale(20),
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginBottom: moderateScale(12),
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.grayLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});
