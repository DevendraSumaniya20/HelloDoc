import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/color';

// Types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  isOnline?: boolean;
}

interface HealthCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const Home: React.FC = () => {
  // Sample data
  const topDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Marcus Horizon',
      specialty: 'Chardiologist',
      rating: 4.7,
      reviews: 5,
      image: 'https://via.placeholder.com/60x60',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Dr. Maria Elena',
      specialty: 'Psychologist',
      rating: 4.9,
      reviews: 10,
      image: 'https://via.placeholder.com/60x60',
    },
  ];

  const healthCategories: HealthCategory[] = [
    { id: '1', name: 'Gastroenterologist', icon: '🫁', color: '#E8F4FD' },
    { id: '2', name: 'Cardiologist', icon: '❤️', color: '#FFF0F0' },
    { id: '3', name: 'Neurologist', icon: '🧠', color: '#F0F8FF' },
    { id: '4', name: 'General Surgery', icon: '🏥', color: '#F8F0FF' },
  ];

  const renderDoctorCard = (doctor: Doctor) => (
    <TouchableOpacity key={doctor.id} style={styles.doctorCard}>
      <View style={styles.doctorImageContainer}>
        <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
        {doctor.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
          <Text style={styles.reviewText}>({doctor.reviews} reviews)</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.consultButton}>
        <Text style={styles.consultButtonText}>Consult</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHealthCategory = (category: HealthCategory) => (
    <TouchableOpacity key={category.id} style={styles.categoryCard}>
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Text style={styles.categoryIconText}>{category.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hey, Dev</Text>
              <Text style={styles.subGreeting}>How Can I Help You?</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={{ uri: 'https://via.placeholder.com/40x40' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors, medicines etc"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* AI Doctor Banner */}
          <TouchableOpacity style={styles.aiDoctorBanner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Ask AI Doctor</Text>
              <Text style={styles.bannerSubtitle}>
                Get instant medical advice from our AI assistant
              </Text>
            </View>
            <View style={styles.bannerIcon}>
              <Text style={styles.bannerIconText}>🤖</Text>
            </View>
          </TouchableOpacity>

          {/* Top Doctor Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Doctor's Nearby</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {topDoctors.map(renderDoctorCard)}
          </View>

          {/* Health Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Health Categories</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoriesGrid}>
              {healthCategories.map(renderHealthCategory)}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  content: {
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 20,
    minHeight: '100%',
  },
  aiDoctorBanner: {
    backgroundColor: '#4a90e2',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#e6f3ff',
    fontSize: 14,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIconText: {
    fontSize: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '600',
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  reviewText: {
    fontSize: 12,
    color: '#888',
  },
  consultButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  consultButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default Home;
