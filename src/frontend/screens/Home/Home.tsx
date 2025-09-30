import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home: React.FC = () => {
  const { user, checkUserExists, isAuthenticated } = useAuth();
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  // State for showing the AI alert
  const [showAlert, setShowAlert] = useState(false);

  type HomeScreenNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'Tabs'
  >;

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const topDoctors: Doctor[] = [
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
  ];

  const healthCategories: HealthCategory[] = [
    { id: '1', name: 'Gastroenterologist', icon: '🫁', color: '#E8F4FD' },
    { id: '2', name: 'Cardiologist', icon: '❤️', color: '#FFF0F0' },
    { id: '3', name: 'Neurologist', icon: '🧠', color: '#F0F8FF' },
    { id: '4', name: 'General Surgery', icon: '🏥', color: '#F8F0FF' },
  ];

  // Show AI alert 5 seconds after Home screen is focused
  useFocusEffect(
    useCallback(() => {
      let timer: NodeJS.Timeout;

      const showAIAlert = async () => {
        const dontShow = await AsyncStorage.getItem('dontShowAIAlert');
        if (!dontShow) {
          timer = setTimeout(() => setShowAlert(true), 5000);
        }
      };

      showAIAlert();

      return () => {
        if (timer) clearTimeout(timer);
      };
    }, []),
  );

  // Verify user exists when screen is focused
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

  // Check user when app comes to foreground
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

  // Navigate to search screen
  const handleSearchPress = () => {
    navigation.navigate(navigationStrings.Search);
  };

  // Navigate to search screen when "View All" is pressed
  const handleViewAllDoctors = () => {
    navigation.navigate(navigationStrings.Search);
  };

  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate(navigationStrings.Search, {
      categoryQuery: categoryName, // Pass the category name as a parameter
    });
  };

  if (!user || !isAuthenticated) return null;

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

            <TouchableOpacity
              onPress={() => navigation.navigate(navigationStrings.Profile)}
            >
              <Components.ProfileImage
                photoURL={user?.photoURL as string | null | undefined}
                style={HomeStyle.profileButton}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar - Now pressable */}
          <TouchableOpacity
            style={HomeStyle.searchContainer}
            onPress={handleSearchPress}
            activeOpacity={0.7}
          >
            <Icons.Search height={20} width={20} fill={Colors.white} />
            <Text style={HomeStyle.searchPlaceholder}>
              Search doctors, specialties...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
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

          {/* Top Doctors */}
          <View style={HomeStyle.section}>
            <View style={HomeStyle.sectionHeader}>
              <Text style={HomeStyle.sectionTitle}>Top Doctor's Nearby</Text>
              <TouchableOpacity onPress={handleViewAllDoctors}>
                <Text style={HomeStyle.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {topDoctors.map(doc => (
              <Components.DoctorCard
                key={doc.id}
                doctor={doc}
                onConsult={() =>
                  setTimeout(() => {
                    navigation.navigate(navigationStrings.Chat, {
                      doctor: doc,
                    });
                  }, 300)
                }
              />
            ))}
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
              {healthCategories.map(cat => (
                <Components.CategoryCard
                  key={cat.id}
                  category={cat}
                  onPress={() => handleCategoryPress(cat.name)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI Warning Alert */}
      <Components.CustomAlert
        visible={showAlert}
        title="AI Assistant Notice"
        description="This app is connected with AI. Responses you receive are AI-generated and for informational purposes only."
        variant="warning"
        leftText="Cancel"
        rightText="Agree"
        onLeftPress={() => setShowAlert(false)}
        onRightPress={() => setShowAlert(false)}
        showTerms={true}
        showPrivacy={true}
        onPrivacyPress={() => {
          navigation.navigate(navigationStrings.WebView, {
            url: 'https://www.birajtech.com/privacy-policy',
            title: 'Privacy Policy',
          });
        }}
        onTermsPress={() => {
          navigation.navigate(navigationStrings.WebView, {
            url: 'https://www.birajtech.com/terms-and-condition',
            title: 'Terms of Service',
          });
        }}
      />
    </SafeAreaView>
  );
};

export default Home;
