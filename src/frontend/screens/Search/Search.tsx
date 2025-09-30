import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, Doctor } from '../../types/types';
import Colors from '../../constants/color';
import Components from '../../components';
import Icons from '../../constants/svgPath';
import navigationStrings from '../../constants/navigationString';
import { StyleSheet } from 'react-native';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Search'
>;

const Search: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // All doctors data - you can later move this to a separate data file or API
  const allDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Marcus Horizon',
      specialty: 'Cardiology',
      rating: 4.7,
      reviews: 5,
      image:
        'https://thumbs.dreamstime.com/b/indian-doctor-mature-male-medical-standing-inside-hospital-handsome-model-portrait-43992356.jpg',
      isOnline: true,
      isAI: true,
    },
    {
      id: '2',
      name: 'Dr. Maria Elena',
      specialty: 'Psychology',
      rating: 4.9,
      reviews: 10,
      image:
        'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg',
      isAI: true,
    },
    {
      id: '3',
      name: 'Dr. Sarah Johnson',
      specialty: 'Gastroenterologist',
      rating: 4.8,
      reviews: 15,
      image:
        'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
      isOnline: true,
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Neurologist',
      rating: 4.6,
      reviews: 8,
      image:
        'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg',
    },
    {
      id: '5',
      name: 'Dr. Emily Brown',
      specialty: 'General Surgery',
      rating: 4.9,
      reviews: 20,
      image:
        'https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg',
      isOnline: true,
    },
    {
      id: '6',
      name: 'Dr. Robert Taylor',
      specialty: 'Cardiologist',
      rating: 4.7,
      reviews: 12,
      image:
        'https://img.freepik.com/free-photo/doctor-offering-medical-teleconsultation_23-2149329007.jpg',
    },
  ];

  // Filter doctors based on search query
  const filteredDoctors = searchQuery.trim()
    ? allDoctors.filter(
        doctor =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allDoctors;

  // Auto-focus search input when screen loads
  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
    }, []),
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate(navigationStrings.Chat, { doctor });
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <Components.DoctorCard
      doctor={item}
      onConsult={() => handleDoctorPress(item)}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No doctors found</Text>
      <Text style={styles.emptySubtitle}>
        Try searching with different keywords
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.grayDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icons.LeftArrow height={24} width={24} fill={Colors.white} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Icons.Search height={20} width={20} fill={Colors.white} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, specialties..."
            placeholderTextColor={Colors.neutral}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icons.Cross height={20} width={20} fill={Colors.neutral} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <View style={styles.content}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {isSearching
              ? 'Searching...'
              : `${filteredDoctors.length} doctor${
                  filteredDoctors.length !== 1 ? 's' : ''
                } found`}
          </Text>
        </View>

        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredDoctors}
            renderItem={renderDoctorItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyComponent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayMedium,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    padding: 0,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.grayDark,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.grayDark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.neutral,
    textAlign: 'center',
  },
});

export default Search;
