import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeStyle from './HomeStyle';
import { Doctor, HealthCategory } from '../../types/types';

const Home: React.FC = () => {
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
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={HomeStyle.header}>
          <View style={HomeStyle.headerTop}>
            <View>
              <Text style={HomeStyle.greeting}>Hey, Dev</Text>
              <Text style={HomeStyle.subGreeting}>How Can I Help You?</Text>
            </View>
            <TouchableOpacity style={HomeStyle.profileButton}>
              <Image
                source={{ uri: 'https://via.placeholder.com/40x40' }}
                style={HomeStyle.profileImage}
              />
            </TouchableOpacity>
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
