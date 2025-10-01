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

// Import your picker functions
import { pickFromCamera, pickFromGallery } from '../../utils/mediaPicker';
import Icons from '../../constants/svgPath';
import { moderateScale } from '../../constants/responsive';

// --- User Profile Input Types ---
export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
}

interface InitialProfileValues {
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL: string;
}

const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const [initialValues, setInitialValues] = useState<InitialProfileValues>({
    firstName: '',
    lastName: '',
    displayName: '',
    photoURL: '',
  });

  useEffect(() => {
    if (user) {
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

      setInitialValues({
        firstName: userFirstName,
        lastName: userLastName,
        displayName: userDisplayName,
        photoURL: userPhotoURL,
      });
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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: displayName.trim(),
      photoURL,
    };

    try {
      await updateUserProfile(updatedData);
      setInitialValues({
        firstName: updatedData.firstName!,
        lastName: updatedData.lastName!,
        displayName: updatedData.displayName!,
        photoURL: updatedData.photoURL!,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [firstName, lastName, displayName, photoURL, updateUserProfile]);

  // --- Handle Profile Image Change ---
  const handleImagePicker = useCallback((): void => {
    Alert.alert(
      'Change Profile Photo',
      'Select an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await pickFromCamera();
            if (result) setPhotoURL(result.path);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await pickFromGallery();
            if (result) setPhotoURL(result.path);
          },
        },
        {
          text: 'Remove Photo',
          onPress: () => {
            const defaultPhotoURL =
              'https://via.placeholder.com/120x120.png?text=Profile';
            setPhotoURL(defaultPhotoURL);
          },
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  }, []);

  const resetChanges = useCallback((): void => {
    setFirstName(initialValues.firstName);
    setLastName(initialValues.lastName);
    setDisplayName(initialValues.displayName);
    setPhotoURL(initialValues.photoURL);
  }, [initialValues]);

  if (!user) return null;

  return (
    <SafeAreaView style={ProfileStyle.container} edges={['top']}>
      {/* Header */}
      <View style={ProfileStyle.headerContainer}>
        <TouchableOpacity
          style={ProfileStyle.backButton}
          onPress={navigation.goBack}
          activeOpacity={0.7}
        >
          <Icons.LeftArrow
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
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
        {/* Profile Image */}
        <View style={ProfileStyle.profileSection}>
          <View style={ProfileStyle.profileImageWrapper}>
            <Image
              source={{ uri: photoURL }}
              style={ProfileStyle.profileImage}
            />
            <TouchableOpacity
              style={ProfileStyle.editIcon}
              onPress={handleImagePicker}
              activeOpacity={0.8}
            >
              <Icons.Edit
                height={moderateScale(16)}
                width={moderateScale(16)}
              />
            </TouchableOpacity>
          </View>

          <Text style={ProfileStyle.displayNameText}>
            {displayName || `${firstName} ${lastName}` || 'No Name'}
          </Text>
          <Text style={ProfileStyle.emailText}>{email}</Text>
        </View>

        {/* Profile Form */}
        <View style={ProfileStyle.formCard}>
          <View style={ProfileStyle.cardHeader}>
            <Text style={ProfileStyle.cardTitle}>Personal Information</Text>
            {hasChanges && (
              <TouchableOpacity
                onPress={resetChanges}
                style={ProfileStyle.resetButton}
                activeOpacity={0.7}
              >
                <Icons.ResetIcon
                  height={moderateScale(16)}
                  width={moderateScale(16)}
                />
                <Text style={ProfileStyle.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <InputField
            label="Display Name"
            placeholder="Enter your display name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
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
        </View>

        {/* Action Buttons */}
        <View style={ProfileStyle.buttonContainer}>
          <TouchableOpacity
            style={[
              ProfileStyle.saveButton,
              (!hasChanges || isLoading) && ProfileStyle.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
            activeOpacity={0.8}
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
