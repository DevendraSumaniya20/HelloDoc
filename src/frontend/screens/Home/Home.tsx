import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import HomeStyle from './HomeStyle';
import { Doctor, HealthCategory } from '../../types/types';
import { useAuth } from '../../hooks/AuthContext';
import Colors from '../../constants/color';
import Components from '../../components';

const Home: React.FC = () => {
  const {
    user,
    logout: authLogout,
    checkUserExists,
    isAuthenticated,
  } = useAuth();
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  const topDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Marcus Horizon',
      specialty: 'Chardiologist',
      rating: 4.7,
      reviews: 5,
      image:
        'https://thumbs.dreamstime.com/b/indian-doctor-mature-male-medical-standing-inside-hospital-handsome-model-portrait-43992356.jpg',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Dr. Maria Elena',
      specialty: 'Psychologist',
      rating: 4.9,
      reviews: 10,
      image:
        'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg',
    },
  ];

  const healthCategories: HealthCategory[] = [
    { id: '1', name: 'Gastroenterologist', icon: '🫁', color: '#E8F4FD' },
    { id: '2', name: 'Cardiologist', icon: '❤️', color: '#FFF0F0' },
    { id: '3', name: 'Neurologist', icon: '🧠', color: '#F0F8FF' },
    { id: '4', name: 'General Surgery', icon: '🏥', color: '#F8F0FF' },
  ];

  useFocusEffect(
    useCallback(() => {
      const verifyUser = async () => {
        if (!user || !isAuthenticated) return;
        setIsCheckingUser(true);
        try {
          await checkUserExists();
        } finally {
          setIsCheckingUser(false);
        }
      };
      verifyUser();
    }, [user, isAuthenticated, checkUserExists]),
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && user && isAuthenticated) {
        checkUserExists().catch(console.error);
      }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, [user, isAuthenticated, checkUserExists]);

  const handleLogout = async () => {
    setIsCheckingUser(true);
    try {
      await authLogout();
      Alert.alert('Logged Out', 'You have been signed out successfully.');
    } catch {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setIsCheckingUser(false);
    }
  };

  const getUserDisplayName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.displayName) return user.displayName.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getProfileImage = () =>
    user?.photoURL || 'https://via.placeholder.com/40x40';

  if (!user || !isAuthenticated) return null;

  return (
    <SafeAreaView style={HomeStyle.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.grayDark} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={HomeStyle.header}>
          <View style={HomeStyle.headerTop}>
            <View>
              <Text style={HomeStyle.greeting}>
                Hey, {getUserDisplayName()}
              </Text>
              <Text style={HomeStyle.subGreeting}>How Can I Help You?</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={HomeStyle.profileButton}>
                <Image
                  source={{ uri: getProfileImage() }}
                  style={HomeStyle.profileImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                disabled={isCheckingUser}
                style={{
                  marginLeft: 8,
                  backgroundColor: '#e63946',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  opacity: isCheckingUser ? 0.6 : 1,
                }}
              >
                <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
                  {isCheckingUser ? 'Wait...' : 'Logout'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={HomeStyle.searchContainer}>
            <Text style={HomeStyle.searchIcon}>🔍</Text>
            <TextInput
              style={HomeStyle.searchInput}
              placeholder="Search doctors, medicines etc"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <View style={HomeStyle.content}>
          <TouchableOpacity style={HomeStyle.aiDoctorBanner}>
            <View style={HomeStyle.bannerContent}>
              <Text style={HomeStyle.bannerTitle}>Ask AI Doctor</Text>
              <Text style={HomeStyle.bannerSubtitle}>
                Get instant medical advice from our AI assistant
              </Text>
            </View>
            <View style={HomeStyle.bannerIcon}>
              <Text style={HomeStyle.bannerIconText}>🤖</Text>
            </View>
          </TouchableOpacity>

          <View style={HomeStyle.section}>
            <View style={HomeStyle.sectionHeader}>
              <Text style={HomeStyle.sectionTitle}>Top Doctor's Nearby</Text>
              <TouchableOpacity>
                <Text style={HomeStyle.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {topDoctors.map(doc => (
              <Components.DoctorCard key={doc.id} doctor={doc} />
            ))}
          </View>

          <View style={HomeStyle.section}>
            <View style={HomeStyle.sectionHeader}>
              <Text style={HomeStyle.sectionTitle}>Top Health Categories</Text>
              <TouchableOpacity>
                <Text style={HomeStyle.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={HomeStyle.categoriesGrid}>
              {healthCategories.map(cat => (
                <Components.CategoryCard key={cat.id} category={cat} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
