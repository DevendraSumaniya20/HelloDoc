import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeStyle from './HomeStyle';
import { Doctor, HealthCategory } from '../../types/types';
import { useAuth } from '../../hooks/AuthContext';
import Colors from '../../constants/color';

const Home: React.FC = () => {
  // Get authenticated user data from AuthContext
  const { user, logout: authLogout } = useAuth();

  // Sample data
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

  // 🔑 Logout function using AuthContext
  const handleLogout = async () => {
    try {
      await authLogout();
      Alert.alert('Logged Out', 'You have been signed out successfully.');
      // 👉 If you have navigation, redirect user to Login screen:
      // navigation.replace("Login");
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  // Helper function to get user's first name or display name
  const getUserDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    } else if (user?.displayName) {
      // Extract first name from display name
      return user.displayName.split(' ')[0];
    } else if (user?.email) {
      // Fallback to email username
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Helper function to get profile image
  const getProfileImage = () => {
    if (user?.photoURL) {
      return user.photoURL;
    }
    // Fallback to placeholder
    return 'https://via.placeholder.com/40x40';
  };

  const renderDoctorCard = (doctor: Doctor) => (
    <TouchableOpacity key={doctor.id} style={HomeStyle.doctorCard}>
      <View style={HomeStyle.doctorImageContainer}>
        <Image source={{ uri: doctor.image }} style={HomeStyle.doctorImage} />
        {doctor.isOnline && <View style={HomeStyle.onlineIndicator} />}
      </View>
      <View style={HomeStyle.doctorInfo}>
        <Text style={HomeStyle.doctorName}>{doctor.name}</Text>
        <Text style={HomeStyle.doctorSpecialty}>{doctor.specialty}</Text>
        <View style={HomeStyle.ratingContainer}>
          <Text style={HomeStyle.ratingText}>⭐ {doctor.rating}</Text>
          <Text style={HomeStyle.reviewText}>({doctor.reviews} reviews)</Text>
        </View>
      </View>
      <TouchableOpacity style={HomeStyle.consultButton}>
        <Text style={HomeStyle.consultButtonText}>Consult</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHealthCategory = (category: HealthCategory) => (
    <TouchableOpacity key={category.id} style={HomeStyle.categoryCard}>
      <View
        style={[HomeStyle.categoryIcon, { backgroundColor: category.color }]}
      >
        <Text style={HomeStyle.categoryIconText}>{category.icon}</Text>
      </View>
      <Text style={HomeStyle.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={HomeStyle.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.grayDark} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={HomeStyle.header}>
          <View style={HomeStyle.headerTop}>
            <View>
              <Text style={HomeStyle.greeting}>
                Hey, {getUserDisplayName()}
              </Text>
              <Text style={HomeStyle.subGreeting}>How Can I Help You?</Text>
            </View>

            {/* Profile + Logout Button */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={HomeStyle.profileButton}>
                <Image
                  source={{ uri: getProfileImage() }}
                  style={HomeStyle.profileImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  marginLeft: 10,
                  backgroundColor: '#e63946',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={HomeStyle.searchContainer}>
            <Text style={HomeStyle.searchIcon}>🔍</Text>
            <TextInput
              style={HomeStyle.searchInput}
              placeholder="Search doctors, medicines etc"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {/* Main Content */}
        <View style={HomeStyle.content}>
          {/* AI Doctor Banner */}
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

          {/* Top Doctor Section */}
          <View style={HomeStyle.section}>
            <View style={HomeStyle.sectionHeader}>
              <Text style={HomeStyle.sectionTitle}>Top Doctor's Nearby</Text>
              <TouchableOpacity>
                <Text style={HomeStyle.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {topDoctors.map(renderDoctorCard)}
          </View>

          {/* Health Categories */}
          <View style={HomeStyle.section}>
            <View style={HomeStyle.sectionHeader}>
              <Text style={HomeStyle.sectionTitle}>Top Health Categories</Text>
              <TouchableOpacity>
                <Text style={HomeStyle.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={HomeStyle.categoriesGrid}>
              {healthCategories.map(renderHealthCategory)}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
