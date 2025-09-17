import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HomeStyle from './HomeStyle';
import { Doctor, HealthCategory, MainStackParamList } from '../../types/types';
import { useAuth } from '../../hooks/AuthContext';
import Colors from '../../constants/color';
import Components from '../../components';
import Icons from '../../constants/svgPath';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import navigationStrings from '../../constants/navigationString';

const Home: React.FC = () => {
  const { user, checkUserExists, isAuthenticated } = useAuth();
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  type HomeScreenNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'Home'
  >;

  const navigation = useNavigation<HomeScreenNavigationProp>();

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
            <TouchableOpacity
              style={HomeStyle.profileButton}
              onPress={() => navigation.navigate(navigationStrings.Profile)}
            >
              <Image
                source={{ uri: getProfileImage() }}
                style={HomeStyle.profileImage}
              />
            </TouchableOpacity>
          </View>
          <View style={HomeStyle.searchContainer}>
            <Icons.Search height={20} width={20} fill={Colors.white} />
            <TextInput
              style={HomeStyle.searchInput}
              placeholder="Search doctors, medicines etc"
              placeholderTextColor={Colors.neutral}
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
              <Components.DoctorCard
                key={doc.id}
                doctor={doc}
                onConsult={() =>
                  navigation.navigate(navigationStrings.Chat, { doctor: doc })
                }
              />
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
