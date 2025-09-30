import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Colors from '../../constants/color';
import InputField from '../../components/InputField';
import { useAuth } from '../../hooks/AuthContext';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileStyle from './ProfileStyle';

// import navigationStrings from '../../constants/navigationString';

// Define the expected structure for updating the user profile
export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
}

// Define the structure for initial values to track changes
interface InitialProfileValues {
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL: string;
}

const Profile: React.FC = () => {
  // Destructure only the necessary functions/state from useAuth
  const { user, updateUserProfile } = useAuth();

  // Use a more specific type for navigation if available, otherwise use a generic type
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  // State variables for form fields
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // State to hold original values for comparison and reset
  const [initialValues, setInitialValues] = useState<InitialProfileValues>({
    firstName: '',
    lastName: '',
    displayName: '',
    photoURL: '',
  });

  useEffect(() => {
    if (user) {
      // Use nullish coalescing for safer access and defaults
      const userEmail = user.email ?? '';
      const userFirstName = user.firstName ?? '';
      const userLastName = user.lastName ?? '';
      const userDisplayName = user.displayName ?? '';
      const defaultPhotoURL =
        'https://via.placeholder.com/120x120.png?text=Profile';
      const userPhotoURL = user.photoURL ?? defaultPhotoURL;

      setEmail(userEmail);
      setFirstName(userFirstName);
      setLastName(userLastName);
      setDisplayName(userDisplayName);
      setPhotoURL(userPhotoURL);

      const newInitialValues: InitialProfileValues = {
        firstName: userFirstName,
        lastName: userLastName,
        displayName: userDisplayName,
        photoURL: userPhotoURL,
      };
      setInitialValues(newInitialValues);
    }
  }, [user]);

  useEffect(() => {
    const changed =
      firstName !== initialValues.firstName ||
      lastName !== initialValues.lastName ||
      displayName !== initialValues.displayName ||
      photoURL !== initialValues.photoURL;
    setHasChanges(changed);
  }, [firstName, lastName, displayName, photoURL, initialValues]);

  const handleSave = useCallback(async (): Promise<void> => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation Error', 'First name and last name are required.');
      return;
    }

    setIsLoading(true);
    const updatedData: UpdateUserProfileInput = {
      // Use trimmed values for storage
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: displayName.trim(),
      // Use photoURL as is (empty string means "remove" or default logic)
      photoURL,
    };

    try {
      await updateUserProfile(updatedData);

      // Update initial values with the newly saved data
      setInitialValues({
        firstName: updatedData.firstName!,
        lastName: updatedData.lastName!,
        displayName: updatedData.displayName!,
        photoURL: updatedData.photoURL!,
      });
      // The state variables (firstName, etc.) are implicitly updated via the useEffect
      // triggered by the `user` object update from `updateUserProfile`.
      // Explicitly setting them here might lead to a race condition or unnecessary render,
      // but if the AuthContext doesn't immediately reflect the changes, they should be set
      // to the *initial values* again. Since the useEffect runs on `user` change,
      // we only need to update `initialValues` here.

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', style: 'default' },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [firstName, lastName, displayName, photoURL, updateUserProfile]);

  /**
   * Handles the selection logic for the profile image.
   */
  const handleImagePicker = useCallback((): void => {
    Alert.alert(
      'Change Profile Photo',
      'Select an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        {
          text: 'Remove Photo',
          onPress: () => setPhotoURL(''), // Set to empty string for removal logic
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  }, []); // Empty dependency array as setPhotoURL is stable

  /**
   * Resets the form fields to their last saved initial values.
   */
  const resetChanges = useCallback((): void => {
    setFirstName(initialValues.firstName);
    setLastName(initialValues.lastName);
    setDisplayName(initialValues.displayName);
    setPhotoURL(initialValues.photoURL);
  }, [initialValues]);

  // Show nothing if the user object is not loaded (AuthContext handles navigation/loading screen)
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={ProfileStyle.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header with Back Button */}
      <View style={ProfileStyle.headerContainer}>
        <TouchableOpacity
          style={ProfileStyle.backButton}
          onPress={navigation.goBack}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Go back to previous screen"
        >
          <Text style={ProfileStyle.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={ProfileStyle.headerTextContainer}>
          <Text style={ProfileStyle.header}>My Profile</Text>
        </View>
      </View>

      <ScrollView
        style={ProfileStyle.scrollView}
        contentContainerStyle={ProfileStyle.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Image Section */}
        <View style={ProfileStyle.profileSection}>
          <View style={ProfileStyle.profileImageWrapper}>
            <Image
              source={{ uri: photoURL }}
              style={ProfileStyle.profileImage}
              accessibilityLabel="User profile photo"
            />
            <TouchableOpacity
              style={ProfileStyle.editIcon}
              onPress={handleImagePicker}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel="Change profile photo"
            >
              <Text style={ProfileStyle.editIconText}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={ProfileStyle.displayNameText}
            accessible={true}
            accessibilityLabel={`Display name: ${
              displayName || `${firstName} ${lastName}` || 'No Name'
            }`}
          >
            {displayName || `${firstName} ${lastName}` || 'No Name'}
          </Text>
          <Text
            style={ProfileStyle.emailText}
            accessible={true}
            accessibilityLabel={`Email address: ${email}`}
          >
            {email}
          </Text>
        </View>

        {/* Profile Form */}
        <View style={ProfileStyle.formCard}>
          <View style={ProfileStyle.cardHeader}>
            <Text style={ProfileStyle.cardTitle}>Personal Information</Text>
            {hasChanges && (
              <TouchableOpacity
                onPress={resetChanges}
                style={ProfileStyle.resetButton}
                accessible={true}
                accessibilityLabel="Reset changes"
              >
                <Text style={ProfileStyle.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <InputField
            label="Display Name"
            placeholder="Enter your display name"
            value={displayName}
            onChangeText={setDisplayName}
          />

          <InputField
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            required
            autoCapitalize="words"
          />

          <InputField
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            required
            autoCapitalize="words"
          />

          {/* Email field is disabled and not editable */}
          <InputField
            label="Email Address"
            value={email}
            disabled
            keyboardType="email-address"
          />
        </View>

        {/* Save Button (Logout button has been removed) */}
        <View style={ProfileStyle.buttonContainer}>
          <TouchableOpacity
            style={[
              ProfileStyle.saveButton,
              !hasChanges && ProfileStyle.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel={
              hasChanges ? 'Save changes to profile' : 'Profile is up to date'
            }
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={ProfileStyle.saveButtonText}>
                {hasChanges ? '💾 Save Changes' : '✅ Up to Date'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
