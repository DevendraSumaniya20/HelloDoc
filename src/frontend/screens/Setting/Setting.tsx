import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/AuthContext';

import Icons from '../../constants/svgPath';
import { moderateScale } from '../../constants/responsive';
import { MainStackParamList } from '../../types/types';
import SettingStyle from './SettingStyle';
import Components from '../../components';
import { JSX } from 'react/jsx-runtime';

export type SettingScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'Setting'
>;

interface MenuItem {
  icon: JSX.Element;
  label: string;
  onPress: () => void;
}

type ScreensWithoutParams = 'Profile' | 'Setting';

const Setting: React.FC<SettingScreenProps> = ({ navigation }) => {
  const { user, logout: authLogout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [dontShowLogoutAlert, setDontShowLogoutAlert] = useState(false);

  // Check AsyncStorage on mount
  useEffect(() => {
    const checkDontShow = async () => {
      const value = await AsyncStorage.getItem('dontShowLogoutAlert');
      if (value === 'true') setDontShowLogoutAlert(true);
    };
    checkDontShow();
  }, []);

  const handleNavigation = (screen: ScreensWithoutParams) => {
    navigation.navigate(screen);
  };

  const handleWebViewNavigation = (url: string, title: string) => {
    navigation.navigate('WebView', { url, title });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout();
      // Optional: show toast/snackbar
    } catch {
      // Optional: handle error
    } finally {
      setIsLoggingOut(false);
    }
  };

  const onPressLogout = async () => {
    if (dontShowLogoutAlert) {
      handleLogout();
    } else {
      setShowLogoutAlert(true);
    }
  };

  const getUserDisplayName = (): string => {
    if (user?.firstName) return user.firstName;
    if (user?.displayName) return user.displayName.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserSubtitle = (): string => {
    if (user?.email) return user.email;
    return 'Welcome to HelloDoc';
  };

  const getProfileImage = (): string =>
    user?.photoURL || 'https://via.placeholder.com/80x80';

  const settingsMenu: MenuItem[] = [
    {
      icon: (
        <Icons.Profile width={moderateScale(20)} height={moderateScale(20)} />
      ),
      label: 'Profile Details',
      onPress: () => handleNavigation('Profile'),
    },
    {
      icon: (
        <Icons.TermsAndCondtion
          width={moderateScale(20)}
          height={moderateScale(20)}
        />
      ),
      label: 'Terms & Conditions',
      onPress: () =>
        handleWebViewNavigation(
          'https://www.birajtech.com/terms-and-condition',
          'Terms & Conditions',
        ),
    },
    {
      icon: (
        <Icons.PrivacyPolicy
          width={moderateScale(20)}
          height={moderateScale(20)}
        />
      ),
      label: 'Privacy Policy',
      onPress: () =>
        handleWebViewNavigation(
          'https://www.birajtech.com/privacy-policy',
          'Privacy Policy',
        ),
    },
    {
      icon: (
        <Icons.ContactUs width={moderateScale(20)} height={moderateScale(20)} />
      ),
      label: 'Contact Us',
      onPress: () =>
        handleWebViewNavigation(
          'https://www.birajtech.com/contact-us',
          'Contact Us',
        ),
    },
    {
      icon: <Icons.Faq width={moderateScale(20)} height={moderateScale(20)} />,
      label: 'FAQ',
      onPress: () =>
        handleWebViewNavigation('https://www.birajtech.com/faq', 'FAQ'),
    },
  ];

  return (
    <View style={SettingStyle.container}>
      {/* Header */}
      <View style={SettingStyle.headerContainer}>
        <TouchableOpacity
          style={SettingStyle.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icons.LeftArrow
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        </TouchableOpacity>
        <Text style={SettingStyle.header}>Settings</Text>
      </View>

      <ScrollView
        style={SettingStyle.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <TouchableOpacity
          style={SettingStyle.profileCard}
          onPress={() => handleNavigation('Profile')}
        >
          <View style={SettingStyle.profileContent}>
            <Image
              source={{ uri: getProfileImage() }}
              style={SettingStyle.profileImage}
            />
            <View style={SettingStyle.profileInfo}>
              <Text style={SettingStyle.userName}>{getUserDisplayName()}</Text>
              <Text style={SettingStyle.userSubtitle}>{getUserSubtitle()}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Other Settings Section */}
        <Text style={SettingStyle.sectionTitle}>Other Settings</Text>

        {/* Settings Menu Items */}
        <View style={SettingStyle.menuContainer}>
          {settingsMenu.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                SettingStyle.menuItem,
                index === settingsMenu.length - 1 && SettingStyle.lastMenuItem,
              ]}
              onPress={item.onPress}
            >
              <View style={SettingStyle.menuLeft}>
                {item.icon}
                <Text style={SettingStyle.menuLabel}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={onPressLogout}
            style={[
              SettingStyle.logoutMenuItem,
              isLoggingOut && { opacity: 0.6 },
            ]}
            disabled={isLoggingOut}
          >
            <View style={SettingStyle.menuLeft}>
              <Icons.Logout
                height={moderateScale(20)}
                width={moderateScale(20)}
              />
              <Text style={SettingStyle.logoutText}>
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Logout Alert */}
      <Components.CustomAlert
        visible={showLogoutAlert}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        variant="error"
        leftText="Cancel"
        rightText="Log out"
        onLeftPress={() => setShowLogoutAlert(false)}
        onRightPress={async () => {
          setShowLogoutAlert(false);
          handleLogout();
        }}
      />
    </View>
  );
};

export default Setting;
